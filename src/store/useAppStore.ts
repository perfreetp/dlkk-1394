import { create } from 'zustand';
import Taro from '@tarojs/taro';
import { Treasure, Route, CheckinRecord } from '@/types/treasure';
import { treasureList, routeList, checkinRecords } from '@/data/mockData';

const STORAGE_KEYS = {
  checkins: 'app_checkins',
  favoriteIds: 'app_favorite_ids',
  routes: 'app_routes',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = Taro.getStorageSync(key);
    if (stored) {
      return JSON.parse(stored as string) as T;
    }
  } catch (e) {
    console.error('[Storage] 读取失败:', key, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (e) {
    console.error('[Storage] 保存失败:', key, e);
  }
}

interface AppState {
  treasures: Treasure[];
  routes: Route[];
  checkins: CheckinRecord[];
  favoriteIds: string[];
  currentRouteTreasureIds: string[];
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addToCurrentRoute: (id: string) => void;
  removeFromCurrentRoute: (id: string) => void;
  clearCurrentRoute: () => void;
  saveRoute: (name: string, description: string) => void;
  toggleRouteFavorite: (routeId: string) => void;
  addCheckin: (treasureId: string, treasureName: string, photo: string, comment: string) => void;
  removeCheckin: (checkinId: string) => void;
}

const initialCheckins = loadFromStorage<CheckinRecord[]>(STORAGE_KEYS.checkins, checkinRecords);
const initialFavoriteIds = loadFromStorage<string[]>(STORAGE_KEYS.favoriteIds, ['1', '4', '5']);
const initialRoutes = loadFromStorage<Route[]>(STORAGE_KEYS.routes, routeList);

export const useAppStore = create<AppState>((set, get) => ({
  treasures: treasureList,
  routes: initialRoutes,
  checkins: initialCheckins,
  favoriteIds: initialFavoriteIds,
  currentRouteTreasureIds: [],

  addToFavorites: (id: string) => {
    set((state) => {
      const newFavoriteIds = [...state.favoriteIds, id];
      saveToStorage(STORAGE_KEYS.favoriteIds, newFavoriteIds);
      return { favoriteIds: newFavoriteIds };
    });
  },

  removeFromFavorites: (id: string) => {
    set((state) => {
      const newFavoriteIds = state.favoriteIds.filter((fid) => fid !== id);
      saveToStorage(STORAGE_KEYS.favoriteIds, newFavoriteIds);
      return { favoriteIds: newFavoriteIds };
    });
  },

  isFavorite: (id: string) => {
    return get().favoriteIds.includes(id);
  },

  addToCurrentRoute: (id: string) => {
    set((state) => ({
      currentRouteTreasureIds: [...state.currentRouteTreasureIds, id],
    }));
  },

  removeFromCurrentRoute: (id: string) => {
    set((state) => ({
      currentRouteTreasureIds: state.currentRouteTreasureIds.filter((tid) => tid !== id),
    }));
  },

  clearCurrentRoute: () => {
    set({ currentRouteTreasureIds: [] });
  },

  saveRoute: (name: string, description: string) => {
    const { currentRouteTreasureIds, treasures } = get();
    if (currentRouteTreasureIds.length === 0) return;

    const routeTreasures = currentRouteTreasureIds
      .map((id) => treasures.find((t) => t.id === id))
      .filter(Boolean) as Treasure[];

    const totalDistance = routeTreasures.reduce((sum, t) => sum + t.distance, 0);
    const totalTime = routeTreasures.reduce((sum, t) => sum + t.walkTime + 30, 0);

    const newRoute: Route = {
      id: `r${Date.now()}`,
      name,
      description,
      coverImage: routeTreasures[0]?.image || '',
      treasureIds: currentRouteTreasureIds,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalTime,
      createdAt: new Date().toISOString().split('T')[0],
      isFavorite: false,
    };

    set((state) => {
      const newRoutes = [newRoute, ...state.routes];
      saveToStorage(STORAGE_KEYS.routes, newRoutes);
      return {
        routes: newRoutes,
        currentRouteTreasureIds: [],
      };
    });
  },

  toggleRouteFavorite: (routeId: string) => {
    set((state) => {
      const newRoutes = state.routes.map((r) =>
        r.id === routeId ? { ...r, isFavorite: !r.isFavorite } : r
      );
      saveToStorage(STORAGE_KEYS.routes, newRoutes);
      return { routes: newRoutes };
    });
  },

  addCheckin: (treasureId: string, treasureName: string, photo: string, comment: string) => {
    const newCheckin: CheckinRecord = {
      id: `c${Date.now()}`,
      treasureId,
      treasureName,
      photo,
      comment,
      createdAt: new Date().toLocaleString('zh-CN'),
    };

    set((state) => {
      const newCheckins = [newCheckin, ...state.checkins];
      saveToStorage(STORAGE_KEYS.checkins, newCheckins);
      return { checkins: newCheckins };
    });
  },

  removeCheckin: (checkinId: string) => {
    set((state) => {
      const newCheckins = state.checkins.filter((c) => c.id !== checkinId);
      saveToStorage(STORAGE_KEYS.checkins, newCheckins);
      return { checkins: newCheckins };
    });
  },
}));
