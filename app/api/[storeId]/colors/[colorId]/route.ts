import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; colorId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

		const color = await prismadb.color.findMany({
			where: {
				id: params.colorId,
			},
		});
		return NextResponse.json(color);
	} catch (err) {
		console.log("[COLOR_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; colorId: string } }
) {
	try {
		const body = await req.json();
		const { name, value } = body;
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
		if (!name) return new NextResponse("Name is required", { status: 400 });
		if (!value) return new NextResponse("value is required", { status: 400 });

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
		if (!storeByUserId && !params?.colorId)
			return new NextResponse("Unauthorized", { status: 403 });

		const color = await prismadb.color.updateMany({
			where: {
				id: params.colorId,
			},
			data: {
				name,
				value,
			},
		});
		return NextResponse.json(color);
	} catch (err) {
		console.log("[COLOR_PATCH]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string; colorId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
		if (!storeByUserId && !params?.colorId)
			return new NextResponse("Unauthorized", { status: 403 });

		const color = await prismadb.color.deleteMany({
			where: {
				id: params.colorId,
			},
		});
		return NextResponse.json(color);
	} catch (err) {
		console.log("[COLOR_DELETE]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
