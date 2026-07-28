import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MushafErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function MushafErrorState({ message, onRetry }: MushafErrorStateProps) {
  return (
    <div className="mushaf-container">
      <div className="mushaf-page-wrapper">
        <div className="mushaf-page items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            {message || "Impossible de charger le contenu. Vérifiez votre connexion."}
          </p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Réessayer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
