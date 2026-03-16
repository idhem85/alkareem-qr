import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4 text-center animate-fade-in">
      <p className="font-arabic text-6xl text-accent">٤٠٤</p>
      <div>
        <p className="text-lg font-semibold mb-1">الصفحة غير موجودة</p>
        <p className="text-sm text-muted-foreground">Page introuvable</p>
      </div>
      <Link to="/">
        <Button variant="outline" className="gap-2">
          <Home className="h-4 w-4" />
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
}
