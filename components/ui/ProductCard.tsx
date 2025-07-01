"use client";
import Image from "next/image";
import React from "react";
import { LuExpand, LuShoppingCart } from "react-icons/lu";
import IconButton from "./IconButton";
import Currency from "./Currency";
import { Product } from "@/types";
import useCart from "@/hooks/useCart";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: { product: Product }) => {
	const { addItem } = useCart();
	const router = useRouter();

	const handleClick = () => {
		router.push(`/product/${product?.id}`);
	};
	return (
		<div
			className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4"
			onClick={handleClick}
		>
			{/* images and actions  */}

			<div className="aspect-square rounded-xl bg-gray-100 relative">
				<Image
					src={product?.images?.[0]?.url}
					fill
					alt={product?.name}
					className="aspect-square object-cover rounded-md"
				/>

				<div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
					<div className="flex gap-x-6 justify-center">
						<IconButton
							onClick={() => {}}
							icon={<LuExpand size={20} />}
							className="text-gray-600"
						/>

						<IconButton
							onClick={() => addItem(product)}
							icon={<LuShoppingCart size={20} />}
							className="text-gray-600"
						/>
					</div>
				</div>
			</div>
			{/* product description  */}
			<div>
				<p className="font-semibold text-lg text-ellipsis whitespace-nowrap overflow-hidden">
					{product?.name}
				</p>
				<p className="text-sm text-gray-500">{product?.category?.name}</p>
			</div>
			{/* price  */}
			<div className="flex items-center justify-between">
				{/* pass currency e.g. "USD", "INR", "EUR", etc. */}
				<Currency value={product?.price} />
			</div>
		</div>
	);
};

export default ProductCard;
