"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { columns, SizeColumn } from "./columns";
import { Separator } from "@radix-ui/react-separator";
import { DataTable } from "./data.tabel";
import ApiList from "@/components/ui/api-list";
import { ApiAlertProps } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SizeClientProps {
	data: SizeColumn[];
}

const SizeClient: React.FC<SizeClientProps> = ({ data = [] }) => {
	const router = useRouter();
	const { storeId } = useParams();
	const origin = useOrigin();
	const baseUrl = `${origin}/api/${storeId}`;
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;
	const apiListData: ApiAlertProps[] = [
		{ title: "GET", description: `${baseUrl}/sizes`, variant: "public" },
		{
			title: "GET",
			description: `${baseUrl}/sizes/{sizeId}`,
			variant: "public",
		},
		{
			title: "POST",
			description: `${baseUrl}/sizes`,
			variant: "admin",
		},
		{
			title: "PATCH",
			description: `${baseUrl}/sizes/{sizeId}`,
			variant: "admin",
		},
		{
			title: "DELETE",
			description: `${baseUrl}/sizes/{sizeId}`,
			variant: "admin",
		},
	];
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Sizes (${data?.length})`}
					description="Manage Sizes for your store"
				/>
				<Button onClick={() => router.push(`/${storeId}/sizes/new`)}>
					<Plus className="w-4 h-4 mr-2" />
					Add New
				</Button>
			</div>

			<Separator />
			<DataTable columns={columns} data={data} />
			<Heading title="API" description="API calls for Sizes" />
			<ApiList data={apiListData} />
		</>
	);
};

export default SizeClient;
