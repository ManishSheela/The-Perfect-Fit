"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useParams, useRouter } from "next/navigation";
import { Store } from "@prisma/client";
import { useModalStore } from "@/hooks/use-store-modal";

export default function StoreSwitcher({ stores = [] }: { stores: Store[] }) {
	const [open, setOpen] = React.useState(false);
	const onOpen = useModalStore((state) => state.onOpen);
	const params = useParams();
	const router = useRouter();
	const formattedStore = stores?.map((store) => ({
		label: store?.name,
		value: store?.id,
	}));
	const currentStore = formattedStore.find(
		(store: { label: string; value: string }) => store.value === params?.storeId
	) ?? { label: "", value: "" };

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size={"sm"}
					role="combobox"
					aria-expanded={open}
					aria-label="Select store"
					className="w-[200px] justify-between"
				>
					<StoreIcon className="mr-2 h-4 w-4" />
					{currentStore?.label}
					<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search store..." />
					<CommandList>
						<CommandEmpty>No store found.</CommandEmpty>
						<CommandGroup>
							{formattedStore.map((store) => (
								<CommandItem
									key={store.value}
									value={store.value}
									onSelect={(currentValue) => {
										setOpen(false);
										console.log(currentValue);
										router.push(`/${currentValue}`);
									}}
								>
									<StoreIcon className="mr-2 h-4 w-4" />
									{store.label}
									<Check
										className={cn(
											"ml-auto mr-2 h-4 w-4",
											currentStore.value === store.value
												? "opacity-100"
												: "opacity-0"
										)}
									/>
								</CommandItem>
							))}
							<CommandItem
								onSelect={() => {
									setOpen(false);
									onOpen();
								}}
							>
								<PlusCircle className="mr-2 h-5 w-5" />
								Create store
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
