"use client";

import { useModalStore } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const formSchema = z.object({
	name: z.string().min(2, {
		message: "name must be at least 2 characters.",
	}),
});

export const StoreModal = () => {
	const { isOpen, onClose } = useModalStore();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			const response = await axios.post("/api/stores", values);
			window.location.assign(`${response?.data?.id}`);
		} catch (error) {
			toast.error("Something went wrong!");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Modal
			title="Create store"
			description="Add a new store to manage products and categories"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="E-commerece"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-4">
							<Button disabled={isLoading} variant="outline" onClick={onClose}>
								Cancel
							</Button>

							<Button disabled={isLoading} type="submit">
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</Modal>
	);
};
