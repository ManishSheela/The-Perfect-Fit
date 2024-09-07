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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export const categoryFormSchema = z.object({
	name: z.string().min(2, {
		message: "name must be at least 2 characters.",
	}),
	billboardId: z.string().min(1),
});

const CategoryForm = ({
	initialData,
	billboards,
}: {
	initialData: Category | null;
	billboards: Billboard[] | null;
}) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { storeId, categoryId } = useParams();
	const router = useRouter();
	const title = initialData ? "Edit category" : "Create category";
	const description = initialData ? "Edit a category" : "Add a new category";
	const toastMessage = initialData ? "Category updated." : "Category created.";
	const action = initialData ? "Save Changes" : "Create";

	const form = useForm<z.infer<typeof categoryFormSchema>>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: initialData || {
			name: "",
			billboardId: "",
		},
	});

	async function onSubmit(values: z.infer<typeof categoryFormSchema>) {
		setLoading(true);
		try {
			if (!!initialData) {
				await axios.patch(`/api/${storeId}/categories/${categoryId}`, values);
			} else await axios.post(`/api/${storeId}/categories`, values);
			router.refresh();
			router.push(`/${storeId}/categories`);
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
			await axios.delete(`/api/${storeId}/categories/${categoryId}`);
			router.refresh();
			router.push(`/${storeId}/categories`);
			toast.success("Category deleted.");
		} catch (error) {
			toast.error(
				"Make sure you removed all billboards using this category first!"
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
											placeholder="Category name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="billboardId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Billboard</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										value={field.value}
										disabled={loading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a billboard"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{billboards &&
												billboards.map((billboard) => (
													<SelectItem key={billboard.id} value={billboard.id}>
														{billboard.label}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
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

export default CategoryForm;
