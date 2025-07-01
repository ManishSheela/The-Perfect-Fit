import React from "react";
import Currency from "./ui/Currency";
import { Product } from "@/types";
import { Button } from "./ui/button";
import { LuShoppingCart } from "react-icons/lu";

const Info = ({ data }: { data: Product }) => {
	const { name, price, size, color } = data;
	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-900">{name}</h1>

			<div className="mt-3 flex items-end justify-between">
				<p className="text-2xl text-gray-900">
					<Currency value={price} />
				</p>
			</div>

			<hr className="my-4" />

			<div className="flex flex-col gap-y-6">
				{/* Size */}
				<div className="flex items-center gap-x-4">
					<h3 className="font-semibold text-black">Size:</h3>
					<div>{size?.name}</div>
				</div>

				{/* Color */}
				<div className="flex items-center gap-x-4">
					<h3 className="font-semibold text-black">Color:</h3>
					<div
						className="h-6 w-6 rounded-full border border-gray-600"
						style={{ backgroundColor: color?.value }}
					/>
				</div>
			</div>

			<div className="mt-10 flex items-center gap-x-3">
				<Button className="flex items-center gap-x-2">
					Add to Cart
					<LuShoppingCart />
				</Button>
			</div>
		</div>
	);
};

export default Info;
