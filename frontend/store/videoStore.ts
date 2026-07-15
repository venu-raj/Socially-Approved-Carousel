import { create } from "zustand";

interface VideoStore {
  openModal: (index: number) => void;
  isModalOpen: boolean;
  activeIndex: number;
  closeModal: () => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  openModal: (index) => set({ isModalOpen: true, activeIndex: index }),
  isModalOpen: false,
  activeIndex: 0,
  closeModal: () => set({ isModalOpen: false }),
}));
