import EngagementService from "@/actions/EngagementService";
import BillboardSlider from "@/components/BillboardSlider";
import ProductList from "@/components/ProductList";
import Container from "@/components/ui/Container";

export default async function HomePage() {
	const products = await EngagementService.getProducts({});
	return (
		<Container>
			<div className="space-y-10 pb-10">
				<BillboardSlider />

				<div className="flex flex-col gap-y-8 sm:px-6 lg:px-8">
					<ProductList title="Featured Products" items={products} />
				</div>
			</div>
		</Container>
	);
}
