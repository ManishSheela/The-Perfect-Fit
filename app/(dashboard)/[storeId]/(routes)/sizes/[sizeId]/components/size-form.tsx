"use client";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export const sizeFormSchema = z.object({
	name: z.string().min(2, {
		message: "name must be at least 2 characters.",
	}),
	value: z.string().min(1),
});

const SizeForm = ({ initialData }: { initialData: Size | null }) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { storeId, sizeId } = useParams();
	const router = useRouter();
	const title = initialData ? "Edit Size" : "Create Size";
	const description = initialData ? "Edit a size" : "Add a new size";
	const toastMessage = initialData ? "Size updated." : "Size created.";
	const action = initialData ? "Save Changes" : "Create";

	const form = useForm<z.infer<typeof sizeFormSchema>>({
		resolver: zodResolver(sizeFormSchema),
		defaultValues: initialData || {
			name: "",
			value: "",
		},
	});

	async function onSubmit(values: z.infer<typeof sizeFormSchema>) {
		setLoading(true);
		try {
			if (!!initialData) {
				await axios.patch(`/api/${storeId}/sizes/${sizeId}`, values);
			} else await axios.post(`/api/${storeId}/sizes`, values);
			router.refresh();
			router.push(`/${storeId}/sizes`);
			toast.success(toastMessage);
		} catch (error) {
			toast.error("Something went wrong!");
		} finally {
			setLoading(false);
		}
	}

	async function onDelete() {
		setLoading(true);
		try {
			await axios.delete(`/api/${storeId}/sizes/${sizeId}`);
			router.refresh();
			router.push(`/${storeId}/sizes`);
			toast.success("Size deleted.");
		} catch (error) {
			toast.error("Make sure you removed all sizes!");
		} finally {
			setLoading(false);
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
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{!!initialData && (
					<Button
						variant="destructive"
						size="icon"
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Size name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Size</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder="Value" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
			<Separator />
		</>
	);
};

export default SizeForm;
