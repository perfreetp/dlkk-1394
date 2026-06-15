import { create } from 'zustand';
import { Treasure, Route, CheckinRecord } from '@/types/treasure';
import { treasureList, routeList, checkinRecords } from '@/data/mockData';

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
}

export const useAppStore = create<AppState>((set, get) => ({
  treasures: treasureList,
  routes: routeList,
  checkins: checkinRecords,
  favoriteIds: ['1', '4', '5'],
  currentRouteTreasureIds: [],

  addToFavorites: (id: string) => {
    set((state) => ({
      favoriteIds: [...state.favoriteIds, id],
    }));
  },

  removeFromFavorites: (id: string) => {
    set((state) => ({
      favoriteIds: state.favoriteIds.filter((fid) => fid !== id),
    }));
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

    set((state) => ({
      routes: [newRoute, ...state.routes],
      currentRouteTreasureIds: [],
    }));
  },

  toggleRouteFavorite: (routeId: string) => {
    set((state) => ({
      routes: state.routes.map((r) =>
        r.id === routeId ? { ...r, isFavorite: !r.isFavorite } : r
      ),
    }));
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

    set((state) => ({
      checkins: [newCheckin, ...state.checkins],
    }));
  },
}));
