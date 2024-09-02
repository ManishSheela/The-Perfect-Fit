import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

		const billboard = await prismadb.billboard.findMany({
			where: {
				id: params.billboardId,
			},
		});
		return NextResponse.json(billboard);
	} catch (err) {
		console.log("[BILLBOARD_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const body = await req.json();
		const { label, imageUrl } = body;
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
		if (!label) return new NextResponse("Lable is required", { status: 400 });
		if (!imageUrl)
			return new NextResponse("Image URL is required", { status: 400 });

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
		if (!storeByUserId && !params?.billboardId)
			return new NextResponse("Unauthorized", { status: 403 });

		const billboard = await prismadb.billboard.updateMany({
			where: {
				id: params.billboardId,
			},
			data: {
				label,
				imageUrl,
			},
		});
		return NextResponse.json(billboard);
	} catch (err) {
		console.log("[BILLBOARD_PATCH]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
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
		if (!storeByUserId && !params?.billboardId)
			return new NextResponse("Unauthorized", { status: 403 });

		const billboard = await prismadb.billboard.deleteMany({
			where: {
				id: params.billboardId,
			},
		});
		return NextResponse.json(billboard);
	} catch (err) {
		console.log("[BILLBOARD_DELETE]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
