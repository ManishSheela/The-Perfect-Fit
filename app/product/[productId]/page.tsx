import EngagementService from "@/actions/EngagementService";
import Gallery from "@/components/gallery";
import Info from "@/components/Info";
import ProductList from "@/components/ProductList";
import Container from "@/components/ui/Container";
import React from "react";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
	const { productId } = params;
	const product = await EngagementService.getProduct(productId);
	const suggestedProducts = await EngagementService.getProducts({
		categoryId: product?.[0].category?.id,
	});
	return (
		<div className="bg-white">
			<Container>
				<div className="px-4 py-10 sm:px-6 lg:px-8">
					<div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
						<Gallery images={product?.[0].images} />
						<div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
							<Info data={product?.[0]} />
						</div>
					</div>
					<hr className="my-10" />
				</div>
				<ProductList title="Related Items" items={suggestedProducts} />
			</Container>
		</div>
	);
};

export default ProductPage;
