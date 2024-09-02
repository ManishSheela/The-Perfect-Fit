import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const body = await req.json();
		const { name } = body;
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthorized", { status: 401 });
		if (!name) return new NextResponse("Name is required", { status: 400 });

		const store = await prismadb.store.updateMany({
			where: {
				id: params?.storeId,
				userId,
			},
			data: {
				name,
			},
		});

		return NextResponse.json(store);
	} catch (err) {
		console.log("[STORE_PATCH]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		console.log(params);
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthorized", { status: 401 });
		const store = await prismadb.store.deleteMany({
			where: {
				id: params?.storeId,
				userId,
			},
		});
		return NextResponse.json(store);
	} catch (err) {
		console.log("[STORE_DELETE]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
