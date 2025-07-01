import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "@/types";
import toast from "react-hot-toast";
import ProductToast from "@/components/ui/ProductToast";

interface CartStore {
	items: Product[];
	addItem: (data: Product) => void;
	removeItem: (id: number) => void;
	removeAll: () => void;
	updateQuantity: (id: number, quantity: number) => void;
}

const useCart = create<CartStore>()(
	persist<CartStore>(
		(set, get) => ({
			items: [],
			addItem: (data: Product) => {
				if (!data || !data.id) {
					toast.error("Invalid product.");
					return;
				}

				const currentItems = get().items;
				const existingItem = currentItems.find(
					(product) => product.id === data.id
				);

				// Update quantity if item already exists in cart
				if (existingItem) {
					set({
						items: currentItems.map((item) =>
							item.id === data.id
								? { ...item, quantity: (item.quantity || 1) + 1 }
								: item
						),
					});
					toast.success("Quantity updated in cart.");
				} else {
					set({ items: [...currentItems, { ...data, quantity: 1 }] });
					toast.custom(<ProductToast product={data} title="Added to" />, {
						duration: 3000,
					});
				}
			},
			removeItem: (id: number) => {
				if (!id) {
					toast.error("Invalid product ID.");
					return;
				}

				const currentItems = get().items;
				const itemExists = currentItems.find((product) => product.id === id);

				if (!itemExists) {
					toast.error("Product not found in cart.");
					return;
				}

				set({ items: currentItems.filter((product) => product.id !== id) });
				toast.custom(
					<ProductToast product={itemExists} title="Removed from" />,
					{
						duration: 3000,
					}
				);
			},

			removeAll: () => {
				set({ items: [] });
				toast.success("All products removed from the cart.");
			},

			updateQuantity: (id: number, quantity: number) => {
				if (!id) {
					toast.error("Invalid product ID.");
					return;
				}

				const currentItems = get().items;
				const itemExists = currentItems.find((product) => product.id === id);

				if (!itemExists) {
					toast.error("Product not found in cart.");
					return;
				}

				// Update quantity or remove item if quantity is less than 1
				if (quantity < 1) {
					set({ items: currentItems.filter((product) => product.id !== id) });
					toast.custom(
						<ProductToast product={itemExists} title="Removed from" />,
						{
							duration: 3000,
						}
					);
				} else {
					set({
						items: currentItems.map((item) =>
							item.id === id ? { ...item, quantity } : item
						),
					});
					toast.success("Quantity updated in cart.");
				}
			},
		}),
		{
			name: "cart-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export default useCart;
