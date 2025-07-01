"use client";

import Image from "next/image";
import Currency from "@/components/ui/Currency"; // Use your existing currency component
import useCart from "@/hooks/useCart"; // Assume you have a cart Zustand hook
import { Product } from "@/types";
import IconButton from "@/components/ui/IconButton";
import { LuMinus, LuPlus } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import { useState } from "react";
import ProductToast from "@/components/ui/ProductToast";

const CartPage = ({ item }: { item: Product }) => {
	const { updateQuantity, removeItem } = useCart();

	const handleIncrement = (item: Product) => {
		if (item?.quantity >= item?.stock)
			return toast.error("There are not enough items in stock");
		updateQuantity(item.id, (item.quantity || 1) + 1);
	};

	const handleDecrement = (item: Product) => {
		if (item.quantity && item.quantity > 1) {
			updateQuantity(item.id, item.quantity - 1);
		} else {
			removeItem(item.id);
		}
	};

	return (
		<tr key={item.id} className="border-b">
			<td>
				<IconButton
					onClick={() => removeItem(item.id)}
					icon={<RxCross2 />}
					className="text-red-400"
				/>
			</td>
			<td className="py-4 flex items-center">
				<Image src={item.image} alt={item.name} width={80} height={80} />
				<span className="ml-4 font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
					{item.name}
				</span>
			</td>
			<td className="py-4">
				<Currency value={item.price} />
			</td>

			<td className="py-4">
				<div className="flex items-center">
					<IconButton
						onClick={() => handleDecrement(item)}
						icon={<LuMinus />}
						className="text-gray-600"
					/>
					<span className="mx-4 w-3">{item.quantity || 1}</span>
					<IconButton
						onClick={() => handleIncrement(item)}
						icon={<LuPlus />}
						className="text-gray-600"
					/>
				</div>
			</td>
			<td className="py-4">
				<Currency value={item.price * (item.quantity || 1)} />
			</td>
		</tr>
	);
};

export default CartPage;
