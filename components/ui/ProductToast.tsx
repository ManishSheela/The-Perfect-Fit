import { Product } from "@/types";
import Image from "next/image";
import React from "react";

const ProductToast = ({
	product,
	title,
}: {
	product: Product;
	title: string;
}) => {
	return (
		<div className="flex items-center p-2 gap-2 w-auto rounded-md h-[40px] bg-slate-900">
			<Image src={product?.image} alt={product?.name} width={20} height={40} />
			<div className="text-white font-semibold">{title} bag</div>
		</div>
	);
};

export default ProductToast;
