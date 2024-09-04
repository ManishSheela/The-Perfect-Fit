import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import React, { useState } from "react";
import { BillboardColumn } from "./columns";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";

interface CellActionProps {
	data: BillboardColumn;
}
const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { storeId, billboardId } = useParams();
	const router = useRouter();
	const onCopy = (id: string) => {
		window.navigator.clipboard.writeText(id);
		toast.success("Billboard Id copied to the clipboard");
	};

	async function onDelete() {
		setLoading(true);
		try {
			await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
			router.refresh();
			toast.success("Billboard deleted.");
		} catch (error) {
			toast.error(
				"Make sure you removed all categores using this billboard first!"
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	}
	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div>
						<span className="sr-only">Open Menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					<DropdownMenuItem onClick={() => onCopy(data?.id)}>
						<Copy className="mr-2 h-4 w-4" />
						<span>Copy Id</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Edit className="mr-2 h-4 w-4" />
						<span>Update</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={onDelete}>
						<Trash className="mr-2 h-4 w-4" />
						<span className="text-red-400">Delete</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default CellAction;
