import EngagementService from "@/actions/EngagementService";
import BillboardSlider from "@/components/BillboardSlider";
import Container from "@/components/ui/Container";
import React from "react";

interface CategoryPageProps {
	params: {
		categoryId: string;
	};
	searchParams: {
		colorId: string;
		sizeId: string;
	};
}

const CategoryPage: React.FC<CategoryPageProps> = async ({
	params,
	searchParams,
}) => {
	const products = await EngagementService.getProducts({
		categoryId: params.categoryId,
		colorId: searchParams.colorId,
		sizeId: searchParams.sizeId,
	});

	const category = await EngagementService.getCategory(params?.categoryId);
	const sizes = await EngagementService.getSizes();
	const colors = await EngagementService.getColors();

	return (
		<div className="bg-white">
			<Container>
				<BillboardSlider />
			</Container>
		</div>
	);
};

export default CategoryPage;
