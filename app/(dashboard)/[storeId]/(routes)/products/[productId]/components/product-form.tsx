"use client";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
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
import { Category, Color, Image, Product, Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export const ProductFormSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	images: z
		.object({
			url: z.string().url({ message: "Must be a valid URL." }),
		})
		.array(),
	sizeId: z.string().min(1, { message: "Size must be present" }),
	categoryId: z.string().min(1, { message: "Category must be present" }),
	colorId: z
		.string()
		.min(1, { message: "Color of the product must be present" }),
	isFeatured: z.boolean().optional(),
	isArchived: z.boolean().optional(),
	price: z.number().min(0, { message: "Price must be a positive number." }),
});

const ProductForm = ({
	initialData,
	categories,
	sizes,
	colors,
}: {
	initialData: (Product & { images: Image[] }) | null;
	categories: Category[];
	sizes: Size[];
	colors: Color[];
}) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { storeId, productId } = useParams();
	const router = useRouter();
	const title = initialData ? "Edit product" : "Create product";
	const description = initialData ? "Edit a product" : "Add a new product";
	const toastMessage = initialData ? "Product updated." : "Product created.";
	const action = initialData ? "Save Changes" : "Create";

	const form = useForm<z.infer<typeof ProductFormSchema>>({
		resolver: zodResolver(ProductFormSchema),
		defaultValues: initialData
			? {
					...initialData,
					price: parseFloat(String(initialData?.price)),
					images: initialData.images.map((image) => ({ url: image.url })),
			  }
			: {
					name: "",
					images: [],
					price: 0,
					sizeId: "",
					categoryId: "",
					colorId: "",
					isFeatured: false,
					isArchived: false,
			  },
	});

	async function onSubmit(values: z.infer<typeof ProductFormSchema>) {
		setLoading(true);
		try {
			if (!!initialData) {
				await axios.patch(`/api/${storeId}/products/${productId}`, values);
			} else await axios.post(`/api/${storeId}/products`, values);
			router.refresh();
			router.push(`/${storeId}/products`);
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
			await axios.delete(`/api/${storeId}/products/${productId}`);
			router.refresh();
			router.push(`/${storeId}/products`);
			toast.success("Product deleted.");
		} catch (error) {
			toast.error("Make sure you removed all products first!");
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
						name="images"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product images</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value.map(
											(image: { url: string }) => image.url
										)}
										disabled={loading}
										onChange={(image) => {
											console.log(image);
											console.log(field.value);
											field.onChange([...field.value, { url: image }]);
										}}
										onRemove={(url: string) => {
											field.onChange(
												field.value.filter((current) => current?.url !== url)
											);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
											placeholder="Product Name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={loading}
											placeholder="9.99"
											{...field}
											value={field.value ? Number(field.value) : ""} // Ensure it's a number
											onChange={(e) => field.onChange(Number(e.target.value))} // Handle numeric change
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
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
													placeholder="Select a Category"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories &&
												categories?.map((category: Category) => (
													<SelectItem key={category.id} value={category.id}>
														{category.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="sizeId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Size</FormLabel>
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
													placeholder="Select a size"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sizes &&
												sizes?.map((size: Size) => (
													<SelectItem key={size.id} value={size.id}>
														{size.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="colorId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Color</FormLabel>
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
													placeholder="Select a Color"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{colors &&
												colors?.map((color: Color) => (
													<SelectItem key={color.id} value={color.id}>
														{color.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isFeatured"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(checked) => field.onChange(checked)} // Pass boolean directly
										/>
									</FormControl>

									<div className="space-y-1 leading-none">
										<FormLabel>Featured</FormLabel>
										<FormDescription>
											This product will not appear on the homepage
										</FormDescription>
									</div>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isArchived"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(checked) => field.onChange(checked)}
										/>
									</FormControl>

									<div className="space-y-1 leading-none">
										<FormLabel>Archived</FormLabel>
										<FormDescription>
											This product will not appear anywhere in the store
										</FormDescription>
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

export default ProductForm;
