import { create } from "zustand";

interface FilterStore {
  search: string;
  type: PropertyType | null;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  setSearch: (search: string) => void;
  setType: (type: PropertyType | null) => void;
  setBedrooms: (bedrooms: number | null) => void;
  setMinPrice: (minPrice: number | null) => void;
  setMaxPrice: (maxPrice: number | null) => void;
  resetFilters: () => void;
}

export type PropertyType = "apartment" | "house" | "villa" | "studio" | null;

export const useFilterStore = create<FilterStore>((set) => ({
  search: "",
  type: null,
  bedrooms: null,
  minPrice: null,
  maxPrice: null,

  setSearch: (search) => set({ search }),
  setType: (type) => set({ type }),
  setBedrooms: (bedrooms) => set({ bedrooms }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  resetFilters: () =>
    set({
      search: "",
      type: null,
      bedrooms: null,
      minPrice: null,
      maxPrice: null,
    }),
    
}));
