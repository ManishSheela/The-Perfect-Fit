import Navbar from "@/components/Navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const DashboardLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { storeId: string };
}) => {
	const { userId } = auth();
	if (!userId) return redirect("/sign-in");

	const store = await prismadb.store.findFirst({
		where: {
			id: params?.storeId,
			userId,
		},
	});

	if (!store) return redirect(`/`);

	return (
		<>
			<Navbar/>
			{children}
		</>
	);
};

export default DashboardLayout;
