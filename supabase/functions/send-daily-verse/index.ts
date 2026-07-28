import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Curated selection of notable Quranic verses for daily reminders
const DAILY_VERSES = [
  { surah: "Al-Baqarah", ayah: "2:152", arabic: "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ", fr: "Souvenez-vous de Moi, Je me souviendrai de vous.", en: "Remember Me, and I will remember you." },
  { surah: "Al-Baqarah", ayah: "2:186", arabic: "وَإِذَا سَأَلَكَ عِبَادِى عَنِّى فَإِنِّى قَرِيبٌ", fr: "Quand Mes serviteurs t'interrogent à Mon sujet, Je suis proche.", en: "When My servants ask about Me, I am near." },
  { surah: "Al-Baqarah", ayah: "2:286", arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا", fr: "Allah n'impose à aucune âme une charge supérieure à sa capacité.", en: "Allah does not burden a soul beyond its capacity." },
  { surah: "Āl-Imrān", ayah: "3:139", arabic: "وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ", fr: "Ne vous laissez pas abattre, ne vous affligez pas alors que vous êtes les supérieurs.", en: "Do not weaken or grieve, for you are superior." },
  { surah: "An-Nisā'", ayah: "4:29", arabic: "وَلَا تَقْتُلُوٓا۟ أَنفُسَكُمْ ۚ إِنَّ ٱللَّهَ كَانَ بِكُمْ رَحِيمًا", fr: "Et ne vous tuez pas vous-mêmes. Allah est Miséricordieux envers vous.", en: "And do not kill yourselves. Indeed, Allah is Merciful to you." },
  { surah: "Al-Mā'idah", ayah: "5:8", arabic: "ٱعْدِلُوا۟ هُوَ أَقْرَبُ لِلتَّقْوَىٰ", fr: "Soyez justes, c'est plus proche de la piété.", en: "Be just; that is nearer to righteousness." },
  { surah: "Al-An'ām", ayah: "6:59", arabic: "وَعِندَهُۥ مَفَاتِحُ ٱلْغَيْبِ لَا يَعْلَمُهَآ إِلَّا هُوَ", fr: "Il détient les clefs de l'Inconnaissable, nul autre que Lui ne les connaît.", en: "With Him are the keys of the unseen; none knows them except Him." },
  { surah: "Al-A'rāf", ayah: "7:56", arabic: "إِنَّ رَحْمَتَ ٱللَّهِ قَرِيبٌ مِّنَ ٱلْمُحْسِنِينَ", fr: "La miséricorde d'Allah est proche des bienfaisants.", en: "The mercy of Allah is near to the doers of good." },
  { surah: "Yūnus", ayah: "10:62", arabic: "أَلَآ إِنَّ أَوْلِيَآءَ ٱللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ", fr: "Les alliés d'Allah n'auront aucune crainte et ne seront point affligés.", en: "Indeed, the allies of Allah – no fear will there be upon them, nor will they grieve." },
  { surah: "Hūd", ayah: "11:6", arabic: "وَمَا مِن دَآبَّةٍ فِى ٱلْأَرْضِ إِلَّا عَلَى ٱللَّهِ رِزْقُهَا", fr: "Il n'y a point de bête sur terre dont la subsistance n'incombe à Allah.", en: "There is no creature on earth but that upon Allah is its provision." },
  { surah: "Ar-Ra'd", ayah: "13:28", arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", fr: "C'est par le rappel d'Allah que les cœurs se tranquillisent.", en: "Verily, in the remembrance of Allah do hearts find rest." },
  { surah: "Ibrāhīm", ayah: "14:7", arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", fr: "Si vous êtes reconnaissants, J'augmenterai Mes bienfaits pour vous.", en: "If you are grateful, I will surely increase you." },
  { surah: "An-Nahl", ayah: "16:97", arabic: "مَنْ عَمِلَ صَـٰلِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُۥ حَيَوٰةً طَيِّبَةً", fr: "Quiconque fait une bonne œuvre, homme ou femme, tout en étant croyant, Nous lui ferons vivre une bonne vie.", en: "Whoever does righteousness, whether male or female, while being a believer – We will grant them a good life." },
  { surah: "Al-Isrā'", ayah: "17:82", arabic: "وَنُنَزِّلُ مِنَ ٱلْقُرْءَانِ مَا هُوَ شِفَآءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ", fr: "Nous faisons descendre du Coran ce qui est guérison et miséricorde pour les croyants.", en: "We send down of the Quran that which is healing and mercy for the believers." },
  { surah: "Al-Kahf", ayah: "18:10", arabic: "رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", fr: "Notre Seigneur, accorde-nous de Ta part une miséricorde et assure-nous la droiture dans notre affaire.", en: "Our Lord, grant us mercy and prepare for us guidance in our affair." },
  { surah: "Tā-Hā", ayah: "20:114", arabic: "وَقُل رَّبِّ زِدْنِى عِلْمًا", fr: "Et dis : « Seigneur, accrois mes connaissances ! »", en: "And say: My Lord, increase me in knowledge." },
  { surah: "Al-Anbiyā'", ayah: "21:87", arabic: "لَّآ إِلَـٰهَ إِلَّآ أَنتَ سُبْحَـٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّـٰلِمِينَ", fr: "Pas de divinité à part Toi ! Gloire à Toi ! J'ai été du nombre des injustes.", en: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." },
  { surah: "Al-Mu'minūn", ayah: "23:115", arabic: "أَفَحَسِبْتُمْ أَنَّمَا خَلَقْنَـٰكُمْ عَبَثًا", fr: "Pensiez-vous que Nous vous avions créés sans but ?", en: "Did you think that We created you uselessly?" },
  { surah: "An-Nūr", ayah: "24:35", arabic: "ٱللَّهُ نُورُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ", fr: "Allah est la Lumière des cieux et de la terre.", en: "Allah is the Light of the heavens and the earth." },
  { surah: "Al-Furqān", ayah: "25:74", arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّـٰتِنَا قُرَّةَ أَعْيُنٍ", fr: "Notre Seigneur, fais que nos épouses et nos descendants soient la joie de nos yeux.", en: "Our Lord, grant us from among our spouses and offspring comfort to our eyes." },
  { surah: "Ash-Sharh", ayah: "94:5-6", arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", fr: "Car après la difficulté, il y a certes une facilité. Oui, après la difficulté, il y a certes une facilité.", en: "For indeed, with hardship comes ease. Indeed, with hardship comes ease." },
  { surah: "Ad-Duhā", ayah: "93:5", arabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ", fr: "Ton Seigneur t'accordera certes [Ses faveurs], et alors tu seras satisfait.", en: "And your Lord is going to give you, and you will be satisfied." },
  { surah: "Al-Hashr", ayah: "59:22", arabic: "هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَـٰهَ إِلَّا هُوَ ۖ عَـٰلِمُ ٱلْغَيْبِ وَٱلشَّهَـٰدَةِ ۖ هُوَ ٱلرَّحْمَـٰنُ ٱلرَّحِيمُ", fr: "C'est Lui Allah. Nulle divinité que Lui, le Connaisseur de l'Invisible et du Visible. C'est Lui le Tout Miséricordieux, le Très Miséricordieux.", en: "He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Most Gracious, the Most Merciful." },
  { surah: "Al-Mulk", ayah: "67:2", arabic: "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا", fr: "Celui qui a créé la mort et la vie afin de vous éprouver, lequel de vous est le meilleur en œuvre.", en: "He who created death and life to test you as to which of you is best in deed." },
  { surah: "Yāsīn", ayah: "36:58", arabic: "سَلَـٰمٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ", fr: "« Paix » : parole d'un Seigneur Très Miséricordieux.", en: "'Peace' – a word from a Merciful Lord." },
  { surah: "Az-Zumar", ayah: "39:53", arabic: "لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا", fr: "Ne désespérez pas de la miséricorde d'Allah. Allah pardonne tous les péchés.", en: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins." },
  { surah: "Qāf", ayah: "50:16", arabic: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ ٱلْوَرِيدِ", fr: "Nous sommes plus près de lui que sa veine jugulaire.", en: "We are closer to him than his jugular vein." },
  { surah: "Ar-Rahmān", ayah: "55:13", arabic: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ", fr: "Lequel donc des bienfaits de votre Seigneur nierez-vous ?", en: "So which of the favors of your Lord would you deny?" },
  { surah: "Al-Hadīd", ayah: "57:4", arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", fr: "Et Il est avec vous où que vous soyez.", en: "And He is with you wherever you are." },
  { surah: "At-Tahrīm", ayah: "66:8", arabic: "تُوبُوٓا۟ إِلَى ٱللَّهِ تَوْبَةً نَّصُوحًا", fr: "Repentez-vous à Allah d'un repentir sincère.", en: "Repent to Allah with sincere repentance." },
];

// Web Push helpers using Web Crypto API
function base64urlToBytes(b64: string): Uint8Array {
  const bin = atob(b64.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function bytesToBase64url(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Create unsigned VAPID JWT
async function createVapidJwt(privateJwk: JsonWebKey, audience: string, subject: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "jwk", privateJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]
  );

  const header = { typ: "JWT", alg: "ES256" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { aud: audience, exp: now + 86400, sub: subject };

  const headerB64 = bytesToBase64url(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = bytesToBase64url(new TextEncoder().encode(JSON.stringify(payload)));
  const unsigned = `${headerB64}.${payloadB64}`;

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(unsigned)
  );

  // Convert DER signature to raw r||s format
  const sigBytes = new Uint8Array(signature);
  let r: Uint8Array, s: Uint8Array;

  if (sigBytes.length === 64) {
    r = sigBytes.slice(0, 32);
    s = sigBytes.slice(32);
  } else {
    // DER format
    const rLen = sigBytes[3];
    const rStart = 4;
    r = sigBytes.slice(rStart, rStart + rLen);
    const sLen = sigBytes[rStart + rLen + 1];
    const sStart = rStart + rLen + 2;
    s = sigBytes.slice(sStart, sStart + sLen);
  }

  // Pad/trim to 32 bytes
  const rPad = new Uint8Array(32);
  const sPad = new Uint8Array(32);
  rPad.set(r.length > 32 ? r.slice(r.length - 32) : r, 32 - Math.min(r.length, 32));
  sPad.set(s.length > 32 ? s.slice(s.length - 32) : s, 32 - Math.min(s.length, 32));

  const rawSig = new Uint8Array(64);
  rawSig.set(rPad, 0);
  rawSig.set(sPad, 32);

  return `${unsigned}.${bytesToBase64url(rawSig)}`;
}

// Encrypt push message using Web Crypto (RFC 8291)
async function encryptPayload(
  payload: string,
  p256dh: string,
  auth: string
): Promise<{ encrypted: Uint8Array; salt: Uint8Array; localPublicKey: Uint8Array }> {
  const userPublicKeyBytes = base64urlToBytes(p256dh);
  const authSecretBytes = base64urlToBytes(auth);

  // Import user's public key
  const userPublicKey = await crypto.subtle.importKey(
    "raw", userPublicKeyBytes, { name: "ECDH", namedCurve: "P-256" }, false, []
  );

  // Generate local ECDH key pair
  const localKeyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]
  );
  const localPublicKeyBytes = new Uint8Array(await crypto.subtle.exportKey("raw", localKeyPair.publicKey));

  // Derive shared secret
  const sharedSecret = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "ECDH", public: userPublicKey }, localKeyPair.privateKey, 256
  ));

  // Generate salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // HKDF-based key derivation (RFC 8291)
  const authInfo = new TextEncoder().encode("Content-Encoding: auth\0");
  const prkKey = await crypto.subtle.importKey("raw", authSecretBytes, { name: "HKDF" }, false, ["deriveBits"]);

  // IKM = HKDF(auth_secret, shared_secret, "Content-Encoding: auth\0", 32)
  const ikm = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: sharedSecret, info: authInfo },
    prkKey, 256
  ));

  // Build key info and nonce info
  const keyInfo = concatBytes(
    new TextEncoder().encode("Content-Encoding: aes128gcm\0"),
    new Uint8Array([0]),
    new Uint8Array([0, 65]), userPublicKeyBytes,
    new Uint8Array([0, 65]), localPublicKeyBytes
  );

  const nonceInfo = concatBytes(
    new TextEncoder().encode("Content-Encoding: nonce\0"),
    new Uint8Array([0]),
    new Uint8Array([0, 65]), userPublicKeyBytes,
    new Uint8Array([0, 65]), localPublicKeyBytes
  );

  const ikmKey = await crypto.subtle.importKey("raw", ikm, { name: "HKDF" }, false, ["deriveBits"]);
  const cekBits = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt, info: keyInfo }, ikmKey, 128
  ));
  const nonce = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt, info: nonceInfo }, ikmKey, 96
  ));

  // Encrypt with AES-128-GCM
  const cek = await crypto.subtle.importKey("raw", cekBits, { name: "AES-GCM" }, false, ["encrypt"]);
  const payloadBytes = new TextEncoder().encode(payload);
  const paddedPayload = concatBytes(payloadBytes, new Uint8Array([2])); // padding delimiter

  const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce, tagLength: 128 }, cek, paddedPayload
  ));

  // Build aes128gcm header: salt(16) + rs(4) + idlen(1) + keyid(65) + ciphertext
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096);
  const encrypted = concatBytes(salt, rs, new Uint8Array([65]), localPublicKeyBytes, ciphertext);

  return { encrypted, salt, localPublicKey: localPublicKeyBytes };
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, a) => sum + a.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPrivateJwk: JsonWebKey,
  vapidPublicKey: string
): Promise<boolean> {
  try {
    const endpointUrl = new URL(subscription.endpoint);
    const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;

    const jwt = await createVapidJwt(vapidPrivateJwk, audience, "mailto:contact@alkareem.app");

    const { encrypted } = await encryptPayload(payload, subscription.p256dh, subscription.auth);

    const response = await fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "aes128gcm",
        Authorization: `vapid t=${jwt}, k=${vapidPublicKey}`,
        TTL: "86400",
        Urgency: "normal",
      },
      body: encrypted,
    });

    return response.ok || response.status === 201;
  } catch (e) {
    console.error("Push send failed:", e);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get VAPID keys
    const { data: configs } = await supabase
      .from("app_config")
      .select("key, value")
      .in("key", ["vapid_public_key", "vapid_private_jwk"]);

    if (!configs || configs.length < 2) {
      return new Response(JSON.stringify({ error: "VAPID keys not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const vapidPublicKey = configs.find((c: any) => c.key === "vapid_public_key")!.value;
    const vapidPrivateJwk = JSON.parse(configs.find((c: any) => c.key === "vapid_private_jwk")!.value);

    // Get current hour in each timezone and find matching subscriptions
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("is_active", true);

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No active subscriptions", sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pick verse of the day based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const verse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];

    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions) {
      // Check if current hour matches subscription's preferred hour in their timezone
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: sub.timezone || "Europe/Paris",
      });
      const currentHour = parseInt(formatter.format(now));

      if (currentHour !== sub.notification_hour) continue;

      const payload = JSON.stringify({
        title: `📖 ${verse.surah} (${verse.ayah})`,
        body: verse.arabic + "\n" + verse.fr,
        data: { ayah: verse.ayah, url: "/" },
      });

      const success = await sendPushNotification(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        payload,
        vapidPrivateJwk,
        vapidPublicKey
      );

      if (success) sent++;
      else failed++;
    }

    return new Response(
      JSON.stringify({ message: "Daily verse sent", sent, failed, verse: verse.ayah }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
