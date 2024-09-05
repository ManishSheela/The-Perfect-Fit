import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

		const categories = await prismadb.category.findMany({
			where: {
				id: params.storeId,
			},
		});
		return NextResponse.json(categories);
	} catch (err) {
		console.log("[BILLBOARDS_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const body = await req.json();
		const { name, billboardId } = body;
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
		if (!name) return new NextResponse("name is required", { status: 400 });
		if (!billboardId)
			return new NextResponse("billboardId  is required", { status: 400 });

		console.log({ body });

		const category = await prismadb.category.create({
			data: {
				name,
				billboardId,
				storeId: params?.storeId,
			},
		});
		return NextResponse.json(category);
	} catch (err) {
		console.log("[CATEGORY_POST]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
