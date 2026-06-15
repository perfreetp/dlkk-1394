export type TreasureCategory = 'shop' | 'exhibition' | 'park' | 'viewpoint';

export type FilterKey = 'walkTime' | 'budget' | 'rainy' | 'family';

export interface Treasure {
  id: string;
  name: string;
  category: TreasureCategory;
  image: string;
  description: string;
  address: string;
  distance: number;
  walkTime: number;
  budget: number;
  isRainy: boolean;
  isFamilyFriendly: boolean;
  isNew: boolean;
  rating: number;
  checkinCount: number;
  highlights: string[];
  openTime: string;
  tips: string[];
  photoSpots: string[];
  nearbySupply: string[];
  latitude: number;
  longitude: number;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  treasureIds: string[];
  totalDistance: number;
  totalTime: number;
  createdAt: string;
  isFavorite: boolean;
}

export interface CheckinRecord {
  id: string;
  treasureId: string;
  treasureName: string;
  photo: string;
  comment: string;
  createdAt: string;
}

export interface FilterOption {
  key: FilterKey;
  label: string;
  options: { value: string; label: string }[];
}

export interface CategoryItem {
  key: TreasureCategory | 'all';
  label: string;
  icon: string;
}
