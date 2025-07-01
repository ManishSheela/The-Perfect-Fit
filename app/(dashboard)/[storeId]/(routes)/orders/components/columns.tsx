"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import { Order } from "@prisma/client";

export type OrderColumn = {
	id: string;
	name: string;
	isPaid: Boolean;
	address : string;
	phone 	: string;
	totalPrice : Number;
	orderItem : Order[]
	createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "value",
		header: "Size",
		cell: ({ row }) => row.original.value,
	},
	{
		accessorKey: "createdAt",
		header: "Date",
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
