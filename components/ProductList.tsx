import React from "react";
import ProductCard from "./ui/ProductCard";
import { Product } from "@/types";
import NoResult from "./ui/NoResult";

interface ProductListProps {
	title: string;
	items: Product[]; 
}
const ProductList: React.FC<ProductListProps> = ({ title, items = [] }) => {
	return (
		<div className="space-y-4">
			<h3 className="font-bold text-3xl">{title}</h3>
			{!items?.length && <NoResult />}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{items &&
					items?.map((product) => (
						<ProductCard key={product?.id} product={product} />
					))}
			</div>
		</div>
	);
};

export default ProductList;
