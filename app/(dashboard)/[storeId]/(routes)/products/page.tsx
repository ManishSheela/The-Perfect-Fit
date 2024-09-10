import React from "react";
import BillboardClient from "./components/product-client";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ProductColumn } from "./components/columns";
import ProductClient from "./components/product-client";
import { formatter } from "@/app/util/util";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const products = await prismadb?.product.findMany({
		where: {
			storeId: params?.storeId,
		},
		include: {
			category: true,
			size: true,
			color: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formatedProducts: ProductColumn[] = products.map((item) => ({
		id: item?.id,
		name: item?.name,
		price: formatter(item?.price?.toNumber()),
		isFeatured: item?.isFeatured,
		isArchived: item?.isArchived,
		size: item?.size.name,
		color: item?.color?.value,
		category: item?.category?.name,
		createdAt: format(item?.createdAt, "MMMM do, yyyy"),
	}));
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductClient data={formatedProducts} />
			</div>
		</div>
	);
};

export default ProductsPage;
