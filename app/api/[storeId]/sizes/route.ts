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

		const sizes = await prismadb.size.findMany({
			where: {
				id: params.storeId,
			},
		});
		return NextResponse.json(sizes);
	} catch (err) {
		console.log("[SIZE_GET]", err);
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
			return new NextResponse("size value  is required", { status: 400 });

		console.log({ body });

		const size = await prismadb.size.create({
			data: {
				name,
				value,
				storeId: params?.storeId,
			},
		});
		return NextResponse.json(size);
	} catch (err) {
		console.log("[SIZE_POST]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
