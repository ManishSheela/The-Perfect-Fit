"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Link from "next/link";
import MainNav from "@/components/MainNav";
import useCart from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import EngagementService from "@/actions/EngagementService";
import { LuShoppingBag } from "react-icons/lu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
	const [categories, setCategories] = useState(null);
	const router = useRouter();
	const { items } = useCart();
	const itemCount = items?.length;

	const getCategories = async () => {
		const res = await EngagementService.getCategories();
		setCategories(res);
	};

	useEffect(() => {
		getCategories();
	}, []);

	return (
		<div className="border-b sticky top-0 z-40 bg-white">
			<Container>
				<div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
					{/* store name  */}
					<Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
						<p className="font-bold text-xl text-black">The Perfect Fit</p>
					</Link>
					{/* list all categories or loading state */}
					{categories ? (
						<MainNav data={categories || []} />
					) : (
						<div className="text-gray-500 ml-4">Loading categories...</div>
					)}
					{/* shopping cart button  */}
					<div
						className="ml-auto relative"
						onClick={() => router.push("/cart")}
					>
						<Button className="flex items-center rounded-full bg-black px-4 py-2">
							<LuShoppingBag size={20} color="white" />
							<span className="ml-2 text-sm font-medium text-white">
								{itemCount}
							</span>
						</Button>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Navbar;
