import { useCallback, useSyncExternalStore, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLineProfile } from "@/lib/useLineProfile";

const STORAGE_KEY = "toast_saved_restaurants";
const MIGRATION_KEY = "toast_saved_migrated";

export type SaveBucket = "mine" | "partner";

export interface SavedData {
  mine: number[];
  partner: number[];
}

interface ServerList {
  id: number;
  userId: string;
  name: string;
  emoji: string;
  isDefault: boolean;
  createdAt: string;
  items: { id: number; listId: number; restaurantId: number; addedAt: string }[];
}

function getStoredData(): SavedData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { mine: [], partner: [] };
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { mine: parsed, partner: [] };
    }
    return { mine: parsed.mine || [], partner: parsed.partner || [] };
  } catch {
    return { mine: [], partner: [] };
  }
}

let subscribers = new Set<() => void>();
let snapshot = getStoredData();

function notify() {
  snapshot = getStoredData();
  subscribers.forEach(cb => cb());
}

function persistAndNotify(data: SavedData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  notify();
}

function subscribe(listener: () => void) {
  subscribers.add(listener);
  return () => { subscribers.delete(listener); };
}

function getSnapshot() {
  return snapshot;
}

function serverListsToSavedData(lists: ServerList[]): SavedData {
  const mine = lists.find(l => l.isDefault && l.name === "My Saves");
  const partner = lists.find(l => l.isDefault && l.name === "With Partner");
  return {
    mine: mine ? mine.items.map(i => i.restaurantId) : [],
    partner: partner ? partner.items.map(i => i.restaurantId) : [],
  };
}

export function useSavedRestaurants() {
  const localData = useSyncExternalStore(subscribe, getSnapshot);
  const { profile, isLineUser } = useLineProfile();
  const userId = profile?.userId;
  const isAuthenticated = !!userId && !userId.startsWith("guest_");
  const queryClient = useQueryClient();
  const migrationDone = useRef(false);

  const { data: serverLists } = useQuery<ServerList[]>({
    queryKey: ["/api/saved-lists", userId],
    queryFn: async () => {
      if (!isAuthenticated || !userId) return [];
      const res = await fetch(`/api/saved-lists?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isAuthenticated,
    staleTime: 5000,
  });

  useEffect(() => {
    if (!isAuthenticated || !userId || migrationDone.current) return;
    const alreadyMigrated = localStorage.getItem(MIGRATION_KEY);
    if (alreadyMigrated === userId) return;
    const local = getStoredData();
    if (local.mine.length === 0 && local.partner.length === 0) {
      localStorage.setItem(MIGRATION_KEY, userId);
      migrationDone.current = true;
      return;
    }
    migrationDone.current = true;
    apiRequest("POST", "/api/saved-lists/migrate", {
      userId,
      mine: local.mine,
      partner: local.partner,
    }).then(() => {
      localStorage.setItem(MIGRATION_KEY, userId);
      localStorage.removeItem(STORAGE_KEY);
      queryClient.invalidateQueries({ queryKey: ["/api/saved-lists", userId] });
    }).catch(console.error);
  }, [isAuthenticated, userId, queryClient]);

  const data: SavedData = isAuthenticated && serverLists
    ? serverListsToSavedData(serverLists)
    : localData;

  const findListId = useCallback((bucket: SaveBucket): number | null => {
    if (!serverLists) return null;
    const name = bucket === "mine" ? "My Saves" : "With Partner";
    const list = serverLists.find(l => l.isDefault && l.name === name);
    return list?.id ?? null;
  }, [serverLists]);

  const saveMutation = useMutation({
    mutationFn: async ({ restaurantId, bucket }: { restaurantId: number; bucket: SaveBucket }) => {
      if (!isAuthenticated || !userId) return;
      let listId = findListId(bucket);
      if (!listId) {
        const res = await fetch(`/api/saved-lists?userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const freshLists: ServerList[] = await res.json();
          const name = bucket === "mine" ? "My Saves" : "With Partner";
          const match = freshLists.find(l => l.isDefault && l.name === name);
          listId = match?.id ?? null;
        }
      }
      if (!listId) return;
      await apiRequest("POST", `/api/saved-lists/${listId}/items`, { userId, restaurantId });
    },
    onMutate: async ({ restaurantId, bucket }) => {
      await queryClient.cancelQueries({ queryKey: ["/api/saved-lists", userId] });
      const previous = queryClient.getQueryData<ServerList[]>(["/api/saved-lists", userId]);
      if (previous) {
        const name = bucket === "mine" ? "My Saves" : "With Partner";
        queryClient.setQueryData<ServerList[]>(["/api/saved-lists", userId], prev =>
          prev?.map(list => {
            if (list.isDefault && list.name === name && !list.items.some(i => i.restaurantId === restaurantId)) {
              return { ...list, items: [...list.items, { id: -Date.now(), listId: list.id, restaurantId, addedAt: new Date().toISOString() }] };
            }
            return list;
          })
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["/api/saved-lists", userId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-lists", userId] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async ({ restaurantId }: { restaurantId: number }) => {
      if (!isAuthenticated || !userId || !serverLists) return;
      for (const list of serverLists) {
        if (list.items.some(i => i.restaurantId === restaurantId)) {
          await apiRequest("DELETE", `/api/saved-lists/${list.id}/items/${restaurantId}?userId=${encodeURIComponent(userId)}`);
        }
      }
    },
    onMutate: async ({ restaurantId }) => {
      await queryClient.cancelQueries({ queryKey: ["/api/saved-lists", userId] });
      const previous = queryClient.getQueryData<ServerList[]>(["/api/saved-lists", userId]);
      if (previous) {
        queryClient.setQueryData<ServerList[]>(["/api/saved-lists", userId], prev =>
          prev?.map(list => ({
            ...list,
            items: list.items.filter(i => i.restaurantId !== restaurantId),
          }))
        );
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["/api/saved-lists", userId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-lists", userId] });
    },
  });

  const isSaved = useCallback((id: number): boolean => {
    return data.mine.includes(id) || data.partner.includes(id);
  }, [data]);

  const getBucket = useCallback((id: number): SaveBucket | null => {
    if (data.mine.includes(id)) return "mine";
    if (data.partner.includes(id)) return "partner";
    return null;
  }, [data]);

  const saveToMine = useCallback((id: number) => {
    if (isAuthenticated) {
      saveMutation.mutate({ restaurantId: id, bucket: "mine" });
    } else {
      const current = getStoredData();
      if (current.mine.includes(id)) return;
      current.mine = [...current.mine, id];
      persistAndNotify(current);
    }
  }, [isAuthenticated, saveMutation]);

  const saveToPartner = useCallback((id: number) => {
    if (isAuthenticated) {
      saveMutation.mutate({ restaurantId: id, bucket: "partner" });
    } else {
      const current = getStoredData();
      if (current.partner.includes(id)) return;
      current.partner = [...current.partner, id];
      persistAndNotify(current);
    }
  }, [isAuthenticated, saveMutation]);

  const unsave = useCallback((id: number) => {
    if (isAuthenticated) {
      unsaveMutation.mutate({ restaurantId: id });
    } else {
      const current = getStoredData();
      current.mine = current.mine.filter(i => i !== id);
      current.partner = current.partner.filter(i => i !== id);
      persistAndNotify(current);
    }
  }, [isAuthenticated, unsaveMutation]);

  return {
    data,
    isSaved,
    getBucket,
    saveToMine,
    saveToPartner,
    unsave,
    mineCount: data.mine.length,
    partnerCount: data.partner.length,
    serverLists: serverLists || [],
    isServerPersisted: isAuthenticated,
  };
}
