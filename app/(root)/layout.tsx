import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
interface SetupLayoutProps {
	children: React.ReactNode;
}

const SetupLayout: React.FC<SetupLayoutProps> = async ({ children }) => {
	const { userId } = auth();
	if (!userId) return redirect("/sign-in");
	const store = await prismadb.store.findFirst({
		where: {
			userId,
		},
	});

	if (store) return redirect(`/${store?.id}`);

	return <>{children}</>;
};

export default SetupLayout;
