"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import { BillboardColumn, columns } from "./columns";
import { Separator } from "@radix-ui/react-separator";
import { DataTable } from "./data.tabel";

interface BillboardClientProps {
	data: BillboardColumn[];
}
const BillboardClient: React.FC<BillboardClientProps> = ({ data = [] }) => {
	const router = useRouter();
	const { storeId } = useParams();
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
		</>
	);
};

export default BillboardClient;
