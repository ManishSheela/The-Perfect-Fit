"use client";
import AlertModal from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
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
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export const billboardFormSchema = z.object({
	label: z.string().min(2, {
		message: "name must be at least 2 characters.",
	}),
	imageUrl: z.string().min(1),
});

const BillboardForm = ({ initialData }: { initialData: Billboard }) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { storeId, billboardId } = useParams();
	const router = useRouter();
	const origin = useOrigin();
	const title = initialData ? "Edit billboard" : "Create billboard";
	const description = initialData ? "Edit a billboard" : "Add a new billboard";
	const toastMessage = initialData
		? "Billboard updated."
		: "Billboard created.";
	const action = initialData ? "Save Changes" : "Create";

	const form = useForm<z.infer<typeof billboardFormSchema>>({
		resolver: zodResolver(billboardFormSchema),
		defaultValues: initialData || {
			label: "",
			imageUrl: "",
		},
	});

	async function onSubmit(values: z.infer<typeof billboardFormSchema>) {
		setLoading(true);
		try {
			if (!!initialData) {
				await axios.patch(`/api/${storeId}/billboards/${billboardId}`, values);
			} else await axios.post(`/api/${storeId}/billboards`, values);
			router.refresh();
			router.push(`/${storeId}/billboards`);
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
			await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
			router.refresh();
			router.push(`/${storeId}/billboards`);
			toast.success("Billboard deleted.");
		} catch (error) {
			toast.error(
				"Make sure you removed all categores using this billboard first!"
			);
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
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Background image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange("")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Billboard label"
											{...field}
										/>
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
			{/* <ApiAlert
				title="NEXT_PUBLIC_API_URL"
				description={`${origin}/api/${storeId}`}
				variant="public"
			/> */}
		</>
	);
};

export default BillboardForm;
