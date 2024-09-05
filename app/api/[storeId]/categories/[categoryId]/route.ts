import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

		const category = await prismadb.category.findMany({
			where: {
				id: params.categoryId,
			},
		});
		return NextResponse.json(category);
	} catch (err) {
		console.log("[CATEGORY_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const body = await req.json();
		const { name, billboardId } = body;
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
		if (!name) return new NextResponse("Name is required", { status: 400 });
		if (!billboardId)
			return new NextResponse("billboardId required", { status: 400 });

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
		if (!storeByUserId && !params?.categoryId)
			return new NextResponse("Unauthorized", { status: 403 });

		const category = await prismadb.category.updateMany({
			where: {
				id: params.categoryId,
			},
			data: {
				name,
				billboardId,
			},
		});
		return NextResponse.json(category);
	} catch (err) {
		console.log("[CATEGORY_PATCH]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
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
		if (!storeByUserId && !params?.categoryId)
			return new NextResponse("Unauthorized", { status: 403 });

		const category = await prismadb.category.deleteMany({
			where: {
				id: params.categoryId,
			},
		});
		return NextResponse.json(category);
	} catch (err) {
		console.log("[CATEGORY_DELETE]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
