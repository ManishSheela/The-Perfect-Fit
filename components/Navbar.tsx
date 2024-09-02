import { auth, UserButton } from "@clerk/nextjs";
import React from "react";
import { MainNav } from "./MainNav";
import StoreSwitcher from "./StoreSwitcher";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
	const { userId } = auth();
	const stores = await prismadb.store.findMany({
		where: {
			userId: userId || undefined,
		},
	});
	return (
		<div className="h-16 border-b flex items-center px-4">
			<StoreSwitcher stores={stores} />
			<MainNav className="mx-6" />
			<div className="ml-auto">
				<UserButton afterSignOutUrl="/" />
			</div>
		</div>
	);
};

export default Navbar;
