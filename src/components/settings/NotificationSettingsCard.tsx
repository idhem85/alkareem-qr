import { Bell, BellOff, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useState } from "react";
import { toast } from "sonner";

interface NotificationSettingsCardProps {
  lang: string;
  timezone: string;
}

const labels = {
  fr: {
    title: "Verset du jour",
    desc: "Recevez un rappel quotidien avec un verset du Coran",
    enabled: "Notifications activées",
    disabled: "Notifications désactivées",
    time: "Heure du rappel",
    notSupported: "Les notifications ne sont pas supportées sur ce navigateur",
    permDenied: "Les notifications sont bloquées. Autorisez-les dans les paramètres de votre navigateur.",
    subscribed: "Notifications activées ! Vous recevrez le verset du jour.",
    unsubscribed: "Notifications désactivées.",
    error: "Erreur lors de l'activation des notifications.",
  },
  ar: {
    title: "آية اليوم",
    desc: "احصل على تذكير يومي بآية من القرآن الكريم",
    enabled: "الإشعارات مفعّلة",
    disabled: "الإشعارات معطّلة",
    time: "وقت التذكير",
    notSupported: "الإشعارات غير مدعومة في هذا المتصفح",
    permDenied: "الإشعارات محظورة. فعّلها من إعدادات المتصفح.",
    subscribed: "تم تفعيل الإشعارات! ستتلقى آية اليوم.",
    unsubscribed: "تم إيقاف الإشعارات.",
    error: "حدث خطأ أثناء تفعيل الإشعارات.",
  },
  en: {
    title: "Verse of the Day",
    desc: "Receive a daily reminder with a verse from the Quran",
    enabled: "Notifications enabled",
    disabled: "Notifications disabled",
    time: "Reminder time",
    notSupported: "Notifications are not supported on this browser",
    permDenied: "Notifications are blocked. Enable them in your browser settings.",
    subscribed: "Notifications enabled! You'll receive the verse of the day.",
    unsubscribed: "Notifications disabled.",
    error: "Error enabling notifications.",
  },
};

const hours = Array.from({ length: 24 }, (_, i) => i);

export default function NotificationSettingsCard({ lang, timezone }: NotificationSettingsCardProps) {
  const t = labels[lang as keyof typeof labels] || labels.fr;
  const {
    isSubscribed,
    isSupported,
    permission,
    loading,
    subscribe,
    unsubscribe,
    updateTime,
  } = usePushNotifications(timezone);

  const [selectedHour, setSelectedHour] = useState(8);

  if (!isSupported) {
    return (
      <Card className="p-3 opacity-60">
        <div className="flex items-center gap-2">
          <BellOff className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{t.notSupported}</span>
        </div>
      </Card>
    );
  }

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      const success = await subscribe(selectedHour, 0);
      if (success) {
        toast.success(t.subscribed);
      } else if (permission === "denied" || Notification.permission === "denied") {
        toast.error(t.permDenied);
      } else {
        toast.error(t.error);
      }
    } else {
      const success = await unsubscribe();
      if (success) toast.info(t.unsubscribed);
    }
  };

  const handleHourChange = async (value: string) => {
    const hour = parseInt(value);
    setSelectedHour(hour);
    if (isSubscribed) {
      await updateTime(hour, 0);
    }
  };

  return (
    <Card className="p-4 border-primary/20">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{t.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
            </div>
            <Switch
              checked={isSubscribed}
              onCheckedChange={handleToggle}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {isSubscribed && (
        <div className="mt-3 flex items-center justify-between gap-3 px-1">
          <span className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {t.time}
          </span>
          <Select value={String(selectedHour)} onValueChange={handleHourChange}>
            <SelectTrigger className="h-8 text-xs w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hours.map((h) => (
                <SelectItem key={h} value={String(h)} className="text-xs">
                  {String(h).padStart(2, "0")}:00
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </Card>
  );
}
