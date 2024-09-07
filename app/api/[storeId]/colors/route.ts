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

		const colors = await prismadb.color.findMany({
			where: {
				id: params.storeId,
			},
		});
		return NextResponse.json(colors);
	} catch (err) {
		console.log("[COLORS_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const body = await req.json();
		const { name, value } = body;
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
		if (!name) return new NextResponse("name is required", { status: 400 });
		if (!value)
			return new NextResponse("color value  is required", { status: 400 });

		console.log({ body });

		const color = await prismadb.color.create({
			data: {
				name,
				value,
				storeId: params?.storeId,
			},
		});
		return NextResponse.json(color);
	} catch (err) {
		console.log("[COLOR_POST]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
