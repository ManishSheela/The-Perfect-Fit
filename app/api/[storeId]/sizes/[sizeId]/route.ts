import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; sizeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

		const size = await prismadb.size.findMany({
			where: {
				id: params.sizeId,
			},
		});
		return NextResponse.json(size);
	} catch (err) {
		console.log("[SIZE_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; sizeId: string } }
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
		if (!storeByUserId && !params?.sizeId)
			return new NextResponse("Unauthorized", { status: 403 });

		const size = await prismadb.size.updateMany({
			where: {
				id: params.sizeId,
			},
			data: {
				name,
				value,
			},
		});
		return NextResponse.json(size);
	} catch (err) {
		console.log("[SIZE_PATCH]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string; sizeId: string } }
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
		if (!storeByUserId && !params?.sizeId)
			return new NextResponse("Unauthorized", { status: 403 });

		const size = await prismadb.size.deleteMany({
			where: {
				id: params.sizeId,
			},
		});
		return NextResponse.json(size);
	} catch (err) {
		console.log("[SIZE_DELETE]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
