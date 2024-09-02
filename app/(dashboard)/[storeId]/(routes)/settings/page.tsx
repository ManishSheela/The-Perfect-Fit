import React from "react";
import { Store } from "@prisma/client";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import SettingForm from "./components/SettingForm";

const SettingsPage = async ({
	params: { storeId },
}: {
	params: { storeId: string };
}) => {
	const { userId } = auth();
	if (!userId) redirect("/sign-in");

	const store = await prismadb.store.findFirst({
		where: {
			id: storeId,
			userId,
		},
	});
	if (!store) redirect("/");
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SettingForm initialData={store} />
			</div>
		</div>
	);
};

export default SettingsPage;
