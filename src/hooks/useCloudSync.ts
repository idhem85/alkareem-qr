/**
 * useCloudSync — synchronise les signets et la progression
 * entre le localStorage et Supabase via un identifiant de device anonyme.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const DEVICE_ID_KEY = "almushaf-device-id";
const SYNC_ENABLED_KEY = "almushaf-cloud-sync";

export interface BookmarkRow {
  surah_id: number;
  ayah_number: number;
  note: string | null;
  created_at: string;
}

export interface ProgressRow {
  surah_id: number;
  ayah_number: number;
  updated_at: string;
}

// ===== Device ID management =====
function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function isCloudSyncEnabled(): boolean {
  return localStorage.getItem(SYNC_ENABLED_KEY) === "true";
}

export function setCloudSyncEnabled(enabled: boolean) {
  localStorage.setItem(SYNC_ENABLED_KEY, enabled ? "true" : "false");
}

// ===== Hook =====
export function useCloudSync() {
  const deviceId = useRef(getDeviceId());
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const enabled = isCloudSyncEnabled();

  // ===== Bookmarks =====

  /** Fetch all bookmarks for this device from Supabase */
  const fetchBookmarks = useCallback(async (): Promise<BookmarkRow[]> => {
    if (!enabled || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("surah_id, ayah_number, note, created_at")
        .eq("device_id", deviceId.current)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as BookmarkRow[];
    } catch (e) {
      console.warn("[CloudSync] Fetch bookmarks failed:", e);
      return [];
    }
  }, [enabled]);

  /** Save a single bookmark to Supabase */
  const saveBookmark = useCallback(
    async (surahId: number, ayahNumber: number, note?: string) => {
      if (!enabled || !supabase) return;
      try {
        const { error } = await supabase.from("bookmarks").upsert(
          {
            device_id: deviceId.current,
            surah_id: surahId,
            ayah_number: ayahNumber,
            note: note || null,
          },
          { onConflict: "device_id, surah_id, ayah_number" }
        );
        if (error) throw error;
      } catch (e) {
        console.warn("[CloudSync] Save bookmark failed:", e);
      }
    },
    [enabled]
  );

  /** Remove a bookmark from Supabase */
  const removeBookmark = useCallback(
    async (surahId: number, ayahNumber: number) => {
      if (!enabled || !supabase) return;
      try {
        await supabase
          .from("bookmarks")
          .delete()
          .eq("device_id", deviceId.current)
          .eq("surah_id", surahId)
          .eq("ayah_number", ayahNumber);
      } catch (e) {
        console.warn("[CloudSync] Remove bookmark failed:", e);
      }
    },
    [enabled]
  );

  // ===== Reading Progress =====

  /** Save reading progress to cloud */
  const saveProgress = useCallback(
    async (surahId: number, ayahNumber: number) => {
      if (!enabled || !supabase) return;
      try {
        await supabase.from("reading_progress").upsert(
          {
            device_id: deviceId.current,
            surah_id: surahId,
            ayah_number: ayahNumber,
          },
          { onConflict: "device_id, surah_id" }
        );
      } catch (e) {
        console.warn("[CloudSync] Save progress failed:", e);
      }
    },
    [enabled]
  );

  /** Fetch reading progress from cloud */
  const fetchProgress = useCallback(async (): Promise<ProgressRow[]> => {
    if (!enabled || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("surah_id, ayah_number, updated_at")
        .eq("device_id", deviceId.current)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return (data || []) as ProgressRow[];
    } catch (e) {
      console.warn("[CloudSync] Fetch progress failed:", e);
      return [];
    }
  }, [enabled]);

  /**
   * Sync Now: pushes all local data to cloud, then pulls and merges.
   * Returns merged bookmarks + progress so the caller can update state.
   */
  const syncNow = useCallback(
    async (localBookmarks: { surahId: number; ayahNumber: number; note?: string; timestamp: number }[], localProgress: { surahId: number; ayahNumber: number; timestamp: number } | null): Promise<{
      bookmarks: { surahId: number; ayahNumber: number; note?: string; timestamp: number }[];
      progress: { surahId: number; ayahNumber: number; timestamp: number } | null;
    }> => {
      if (!enabled) return { bookmarks: localBookmarks, progress: localProgress };
      setSyncing(true);
      setSyncError(null);

      try {
        // 1. Push all local bookmarks to cloud
        const upserts = localBookmarks.map((b) => ({
          device_id: deviceId.current,
          surah_id: b.surahId,
          ayah_number: b.ayahNumber,
          note: b.note || null,
        }));

        if (upserts.length > 0 && supabase) {
          for (let i = 0; i < upserts.length; i += 50) {
            await supabase.from("bookmarks").upsert(upserts.slice(i, i + 50), {
              onConflict: "device_id, surah_id, ayah_number",
            });
          }
        }

        // 2. Push local progress
        if (localProgress && supabase) {
          await supabase.from("reading_progress").upsert(
            {
              device_id: deviceId.current,
              surah_id: localProgress.surahId,
              ayah_number: localProgress.ayahNumber,
            },
            { onConflict: "device_id, surah_id" }
          );
        }

        // 3. Fetch all cloud bookmarks & merge
        const cloudRows = await fetchBookmarks();
        const mergedMap = new Map<string, { surahId: number; ayahNumber: number; note?: string; timestamp: number }>();
        for (const b of localBookmarks) {
          mergedMap.set(`${b.surahId}:${b.ayahNumber}`, b);
        }
        for (const row of cloudRows) {
          const key = `${row.surah_id}:${row.ayah_number}`;
          const existing = mergedMap.get(key);
          const cloudTs = new Date(row.created_at).getTime();
          if (!existing || cloudTs > existing.timestamp) {
            mergedMap.set(key, { surahId: row.surah_id, ayahNumber: row.ayah_number, note: row.note || undefined, timestamp: cloudTs });
          }
        }

        // 4. Fetch cloud progress & merge
        const progressRows = await fetchProgress();
        let mergedProgress = localProgress;
        if (progressRows.length > 0) {
          const latest = progressRows[0];
          const cloudTs = new Date(latest.updated_at).getTime();
          if (!localProgress || cloudTs > localProgress.timestamp) {
            mergedProgress = { surahId: latest.surah_id, ayahNumber: latest.ayah_number, timestamp: cloudTs };
          }
        }

        setLastSyncTime(new Date());
        return { bookmarks: Array.from(mergedMap.values()), progress: mergedProgress };
      } catch (e: any) {
        const msg = e?.message || "Sync failed";
        console.warn("[CloudSync] syncNow failed:", msg);
        setSyncError(msg);
        return { bookmarks: localBookmarks, progress: localProgress };
      } finally {
        setSyncing(false);
      }
    },
    [enabled, fetchBookmarks, fetchProgress]
  );

  return {
    enabled,
    syncing,
    syncError,
    lastSyncTime,
    fetchBookmarks,
    saveBookmark,
    removeBookmark,
    saveProgress,
    fetchProgress,
    syncNow,
  };
}
