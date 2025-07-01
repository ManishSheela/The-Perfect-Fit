import React from "react";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { SizeColumn } from "./components/columns";
import SizeClient from "./components/size-client";
import { formatter } from "@/app/util/util";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
	const orders = await prismadb?.order?.findMany({
		where: {
			storeId: params?.storeId,
		},
		include : {
			orderItem: {
				product : true
			}
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const formatedOrders: SizeColumn[] = orders.map((item) => ({
		id: item?.id,
		isPaid : item?.isPaid,
		phone : item?.phone,
		address : item?.address,
		products : item?.orderItems.map((order))
		totalPrice : formatter(item.orderItems?.reduce((total, item)=> total+=item?.price),0),

		createdAt: format(item?.createdAt, "MMMM do, yyyy"),
	}));
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SizeClient data={formatedOrders} />
			</div>
		</div>
	);
};

export default OrdersPage;
