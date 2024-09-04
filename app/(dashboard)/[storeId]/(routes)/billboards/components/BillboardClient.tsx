"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import { BillboardColumn, columns } from "./columns";
import { Separator } from "@radix-ui/react-separator";
import { DataTable } from "./data.tabel";
import ApiList from "@/components/ui/api-list";
import { ApiAlertProps } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface BillboardClientProps {
	data: BillboardColumn[];
}

const BillboardClient: React.FC<BillboardClientProps> = ({ data = [] }) => {
	const router = useRouter();
	const { storeId } = useParams();
	const origin = useOrigin();
	const baseUrl = `${origin}/api/${storeId}`;
	const apiListData: ApiAlertProps[] = [
		{ title: "GET", description: `${baseUrl}/billboards`, variant: "public" },
		{
			title: "GET",
			description: `${baseUrl}/billboards/{billboardId}`,
			variant: "public",
		},
		{
			title: "POST",
			description: `${baseUrl}/billboards`,
			variant: "admin",
		},
		{
			title: "PATCH",
			description: `${baseUrl}/billboards/{billboardId}`,
			variant: "admin",
		},
		{
			title: "DELETE",
			description: `${baseUrl}/billboards/{billboardId}`,
			variant: "admin",
		},
	];
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Billboards (${data?.length})`}
					description="Manage billboards for your store"
				/>
				<Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
					<Plus className="w-4 h-4 mr-2" />
					Add New
				</Button>
			</div>

			<Separator />
			<DataTable columns={columns} data={data} />
			<Heading title="API" description="API calls for Billboards" />
			<ApiList data={apiListData} />
		</>
	);
};

export default BillboardClient;
