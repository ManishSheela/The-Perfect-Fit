"use client";
import AlertModal from "@/components/modals/alert-modal";
import { formSchema } from "@/components/modals/store-modal";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const SettingForm = ({ initialData }: { initialData: Store }) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const { storeId } = useParams();
	const origin = useOrigin();
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);
		try {
			await axios.patch(`/api/stores/${storeId}`, values);
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong!");
		} finally {
			setLoading(false);
		}
	}

	async function onDelete() {
		setLoading(true);
		try {
			await axios.delete(`/api/stores/${storeId}`);
			router.refresh();
			router.push("/");
			toast.success("Store deleted.");
		} catch (error) {
			toast.error("Make sure you removed all products and categories first!");
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
				<Heading title="Settings" description="Manage store preferences" />
				<Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
					<Trash className="h-4 w-4" />
				</Button>
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
											placeholder="Store name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						Save changes
					</Button>
				</form>
			</Form>
			<Separator />
			<ApiAlert
				title="NEXT_PUBLIC_API_URL"
				description={`${origin}/api/${storeId}`}
				variant="public"
			/>
		</>
	);
};

export default SettingForm;
