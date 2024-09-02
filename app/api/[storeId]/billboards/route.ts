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

		const billboards = await prismadb.billboard.findMany({
			where: {
				id: params.storeId,
			},
		});
		return NextResponse.json(billboards);
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
		const { label, imageUrl } = body;
		const { userId } = auth(); // manish
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
		if (!label) return new NextResponse("Lable is required", { status: 400 });
		if (!imageUrl)
			return new NextResponse("Image URL is required", { status: 400 });

		console.log({ body });

		const billboard = await prismadb.billboard.create({
			data: {
				label,
				imageUrl,
				storeId: params?.storeId,
			},
		});
		return NextResponse.json(billboard);
	} catch (err) {
		console.log("[BILLBOARD_POST]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
