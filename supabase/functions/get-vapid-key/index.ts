import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Convert JWK coordinates to raw uncompressed public key (base64url)
function jwkToApplicationServerKey(jwk: JsonWebKey): string {
  const x = base64urlToBytes(jwk.x!);
  const y = base64urlToBytes(jwk.y!);
  const raw = new Uint8Array(65);
  raw[0] = 0x04; // uncompressed point prefix
  raw.set(x, 1);
  raw.set(y, 33);
  return bytesToBase64url(raw);
}

function base64urlToBytes(b64: string): Uint8Array {
  const bin = atob(b64.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function bytesToBase64url(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if VAPID keys already exist in app_config
    const { data: existing } = await supabase
      .from("app_config")
      .select("key, value")
      .in("key", ["vapid_public_key", "vapid_private_jwk"]);

    let publicKey: string;

    if (existing && existing.length === 2) {
      publicKey = existing.find((r: any) => r.key === "vapid_public_key")!.value;
    } else {
      // Generate new VAPID keys using Web Crypto API
      const keyPair = await crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["sign", "verify"]
      );

      const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
      const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
      publicKey = jwkToApplicationServerKey(publicJwk);

      // Store keys in app_config
      await supabase.from("app_config").upsert([
        { key: "vapid_public_key", value: publicKey },
        { key: "vapid_private_jwk", value: JSON.stringify(privateJwk) },
        { key: "vapid_public_jwk", value: JSON.stringify(publicJwk) },
      ]);
    }

    return new Response(JSON.stringify({ publicKey }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
