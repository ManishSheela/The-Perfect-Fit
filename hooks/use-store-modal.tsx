import { create } from "zustand";

interface useStoreModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const useModalStore = create<useStoreModalStore>((set) => ({
	isOpen: false,
	onClose: () => set({ isOpen: false }),
	onOpen: () => set({ isOpen: true }),
}));
