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

export const colorFormSchema = z.object({
	name: z.string().min(2, {
		message: "name must be at least 2 characters.",
	}),
	value: z.string().min(1),
});

const ColorForm = ({ initialData }: { initialData: Size | null }) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { storeId, colorId } = useParams();
	const router = useRouter();
	const title = initialData ? "Edit Color" : "Create Color";
	const description = initialData ? "Edit a color" : "Add a new color";
	const toastMessage = initialData ? "Color updated." : "Color created.";
	const action = initialData ? "Save Changes" : "Create";

	const form = useForm<z.infer<typeof colorFormSchema>>({
		resolver: zodResolver(colorFormSchema),
		defaultValues: initialData || {
			name: "",
			value: "",
		},
	});

	async function onSubmit(values: z.infer<typeof colorFormSchema>) {
		setLoading(true);
		try {
			if (!!initialData) {
				await axios.patch(`/api/${storeId}/colors/${colorId}`, values);
			} else await axios.post(`/api/${storeId}/colors`, values);
			router.refresh();
			router.push(`/${storeId}/colors`);
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
			await axios.delete(`/api/${storeId}/colors/${colorId}`);
			router.refresh();
			router.push(`/${storeId}/colors`);
			toast.success("Color deleted.");
		} catch (error) {
			toast.error("Make sure you removed all colors!");
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
									<FormLabel>Color</FormLabel>
									<div className="flex items-center gap-x-4">
										<Input
											disabled={loading}
											placeholder="Color value"
											{...field}
										/>
										<div
											className="border p-4 rounded-full"
											style={{ backgroundColor: field.value }}
										/>
									</div>
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

export default ColorForm;
