"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ColorColumn, columns } from "./columns";
import { Separator } from "@radix-ui/react-separator";
import { DataTable } from "./data.tabel";
import ApiList from "@/components/ui/api-list";
import { ApiAlertProps } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SizeClientProps {
	data: ColorColumn[];
}

const ColorClient: React.FC<SizeClientProps> = ({ data = [] }) => {
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
		{ title: "GET", description: `${baseUrl}/colors`, variant: "public" },
		{
			title: "GET",
			description: `${baseUrl}/colors/{colorId}`,
			variant: "public",
		},
		{
			title: "POST",
			description: `${baseUrl}/colors`,
			variant: "admin",
		},
		{
			title: "PATCH",
			description: `${baseUrl}/colors/{colorId}`,
			variant: "admin",
		},
		{
			title: "DELETE",
			description: `${baseUrl}/colors/{colorId}`,
			variant: "admin",
		},
	];
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Colors (${data?.length})`}
					description="Manage Colors for your store"
				/>
				<Button onClick={() => router.push(`/${storeId}/colors/new`)}>
					<Plus className="w-4 h-4 mr-2" />
					Add New
				</Button>
			</div>

			<Separator />
			<DataTable columns={columns} data={data} />
			<Heading title="API" description="API calls for colors" />
			<ApiList data={apiListData} />
		</>
	);
};

export default ColorClient;
