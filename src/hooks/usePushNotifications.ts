import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NotificationSettings {
  isSubscribed: boolean;
  isSupported: boolean;
  permission: NotificationPermission | "default";
  hour: number;
  minute: number;
  loading: boolean;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(timezone: string) {
  const [settings, setSettings] = useState<NotificationSettings>({
    isSubscribed: false,
    isSupported: false,
    permission: "default",
    hour: 8,
    minute: 0,
    loading: true,
  });

  const isSupported =
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  useEffect(() => {
    if (!isSupported) {
      setSettings((s) => ({ ...s, isSupported: false, loading: false }));
      return;
    }

    const checkSubscription = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setSettings((s) => ({
          ...s,
          isSupported: true,
          isSubscribed: !!sub,
          permission: Notification.permission,
          loading: false,
        }));
      } catch {
        setSettings((s) => ({ ...s, isSupported: true, loading: false }));
      }
    };

    checkSubscription();
  }, [isSupported]);

  const subscribe = useCallback(
    async (hour: number, minute: number) => {
      setSettings((s) => ({ ...s, loading: true }));
      try {
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setSettings((s) => ({ ...s, permission, loading: false }));
          return false;
        }

        // Get VAPID public key from edge function
        const { data: vapidData, error: vapidError } = await supabase.functions.invoke(
          "get-vapid-key"
        );
        if (vapidError || !vapidData?.publicKey) {
          throw new Error("Failed to get VAPID key");
        }

        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey),
        });

        // Send subscription to backend
        const subJson = subscription.toJSON();
        const { error } = await supabase.functions.invoke("push-subscribe", {
          body: {
            subscription: {
              endpoint: subJson.endpoint,
              keys: subJson.keys,
            },
            notificationHour: hour,
            notificationMinute: minute,
            timezone,
            isActive: true,
          },
        });

        if (error) throw error;

        setSettings((s) => ({
          ...s,
          isSubscribed: true,
          permission: "granted",
          hour,
          minute,
          loading: false,
        }));
        return true;
      } catch (e) {
        console.error("Push subscribe failed:", e);
        setSettings((s) => ({ ...s, loading: false }));
        return false;
      }
    },
    [timezone]
  );

  const unsubscribe = useCallback(async () => {
    setSettings((s) => ({ ...s, loading: true }));
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        // Deactivate on backend
        const subJson = sub.toJSON();
        await supabase.functions.invoke("push-subscribe", {
          body: {
            subscription: {
              endpoint: subJson.endpoint,
              keys: subJson.keys,
            },
            isActive: false,
          },
        });
        await sub.unsubscribe();
      }
      setSettings((s) => ({ ...s, isSubscribed: false, loading: false }));
      return true;
    } catch (e) {
      console.error("Push unsubscribe failed:", e);
      setSettings((s) => ({ ...s, loading: false }));
      return false;
    }
  }, []);

  const updateTime = useCallback(
    async (hour: number, minute: number) => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (!sub) return false;

        const subJson = sub.toJSON();
        await supabase.functions.invoke("push-subscribe", {
          body: {
            subscription: {
              endpoint: subJson.endpoint,
              keys: subJson.keys,
            },
            notificationHour: hour,
            notificationMinute: minute,
            timezone,
            isActive: true,
          },
        });

        setSettings((s) => ({ ...s, hour, minute }));
        return true;
      } catch (e) {
        console.error("Update time failed:", e);
        return false;
      }
    },
    [timezone]
  );

  return { ...settings, subscribe, unsubscribe, updateTime };
}
