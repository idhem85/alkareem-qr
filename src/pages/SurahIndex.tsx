import { useState } from "react";
import { surahs } from "@/data/surahs";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "all" | "meccan" | "medinan";
type View = "list" | "grid";

export default function SurahIndex() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("list");

  const filtered = surahs.filter(s => {
    const matchesSearch =
      s.nameArabic.includes(search) ||
      s.nameTransliteration.toLowerCase().includes(search.toLowerCase()) ||
      s.nameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toString() === search;
    const matchesFilter = filter === "all" || s.revelationType === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">Index des Sourates</h1>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une sourate..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(["all", "meccan", "medinan"] as Filter[]).map(f => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="text-xs"
              >
                {f === "all" ? "Toutes" : f === "meccan" ? "Mecquoises" : "Médinoises"}
              </Button>
            ))}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setView("list")}>
              <LayoutList className={cn("h-4 w-4", view === "list" && "text-accent")} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setView("grid")}>
              <LayoutGrid className={cn("h-4 w-4", view === "grid" && "text-accent")} />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={cn(
        view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : "space-y-2"
      )}>
        {filtered.map(s => (
          <Link key={s.id} to={`/surah/${s.id}`}>
            <Card className={cn(
              "hover-scale border-border/50 transition-colors",
              view === "grid" ? "p-4 text-center" : "p-3 flex items-center justify-between"
            )}>
              {view === "grid" ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-bold">{s.id}</span>
                  </div>
                  <p className="font-arabic text-lg text-accent mb-1">{s.nameArabic}</p>
                  <p className="text-xs font-semibold">{s.nameTransliteration}</p>
                  <p className="text-[10px] text-muted-foreground">{s.ayahCount} versets</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold">{s.id}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{s.nameTransliteration}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.nameTranslation} • {s.ayahCount} versets • {s.revelationType === "meccan" ? "Mecquoise" : "Médinoise"}
                      </p>
                    </div>
                  </div>
                  <p className="font-arabic text-lg text-accent shrink-0">{s.nameArabic}</p>
                </>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Aucune sourate trouvée.</p>
      )}
    </div>
  );
}
