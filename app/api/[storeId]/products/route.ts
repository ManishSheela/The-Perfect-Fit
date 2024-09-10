import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = await auth();
		const { searchParams } = new URL(req.url);

		console.log({searchParams})
		console.log('url',req.url);
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

		// const { categoryId, colorId, sizeId, isFeatured } = searchParams;
		// const products = await prismadb.product.findMany({
		// 	where: {
		// 		storeId: params.storeId,
		// 		categoryId: categoryId || undefined, // Optional filtering
		// 		colorId: colorId || undefined,
		// 		sizeId: sizeId || undefined,
		// 		isFeatured: isFeatured ? true : undefined,
		// 		isArchived: false,
		// 	},
		// 	include: {
		// 		images: true,
		// 		category: true,
		// 		color: true,
		// 		size: true,
		// 	},
		// });

		return NextResponse.json({});
	} catch (err) {
		console.log("[PRODUCTS_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const body = await req.json();
		const {
			name,
			images,
			price,
			isFeatured,
			isArchived,
			categoryId,
			sizeId,
			colorId,
		} = body;

		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
		if (!name)
			return new NextResponse("Name of product is required", { status: 400 });
		if (!price) return new NextResponse("Price is required", { status: 400 });

		console.log({ body });

		const product = await prismadb.product.create({
			data: {
				name,
				price,
				isFeatured,
				isArchived,
				storeId: params?.storeId,
				images: {
					createMany: {
						data: images.map((image: { url: string }) => ({ url: image.url })),
					},
				},
				categoryId,
				sizeId,
				colorId,
			},
		});

		return NextResponse.json(product);
	} catch (err) {
		console.error("[PRODUCT_POST]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
