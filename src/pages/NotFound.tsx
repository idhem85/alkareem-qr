import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useSettings } from "@/contexts/AppContext";

const labels = {
  fr: { title: "Page introuvable", subtitle: "La page que vous cherchez n'existe pas.", back: "Retour à l'accueil" },
  ar: { title: "الصفحة غير موجودة", subtitle: "الصفحة التي تبحث عنها غير موجودة.", back: "العودة للرئيسية" },
  en: { title: "Page not found", subtitle: "The page you're looking for doesn't exist.", back: "Back to home" },
};

export default function NotFound() {
  const { settings } = useSettings();
  const lang = (settings.language || "fr") as keyof typeof labels;
  const t = labels[lang] || labels.fr;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4 text-center animate-fade-in">
      <p className="font-arabic text-6xl text-accent">٤٠٤</p>
      <div>
        <p className="text-lg font-semibold mb-1" dir={lang === "ar" ? "rtl" : "ltr"}>{t.title}</p>
        <p className="text-sm text-muted-foreground" dir={lang === "ar" ? "rtl" : "ltr"}>{t.subtitle}</p>
      </div>
      <Link to="/">
        <Button variant="outline" className="gap-2">
          <Home className="h-4 w-4" />
          {t.back}
        </Button>
      </Link>
    </div>
  );
}
