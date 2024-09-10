import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string; productId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

		const product = await prismadb.product.findMany({
			where: {
				id: params.productId,
			},
			include: {
				size: true,
				category: true,
				color: true,
				images: true,
			},
		});
		console.log({ product });
		return NextResponse.json(product);
	} catch (err) {
		console.log("[PRODUCT_GET]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; productId: string } }
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
			return new NextResponse("Product name is required", { status: 400 });
		if (!price) return new NextResponse("Price is required", { status: 400 });

		// Verify the store belongs to the authenticated user
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
		if (!storeByUserId)
			return new NextResponse("Unauthorized", { status: 403 });

		// Validate the product ID
		if (!params?.productId)
			return new NextResponse("Product ID is required", { status: 400 });

		// Update the product
		await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				name,
				price,
				isFeatured,
				isArchived,
				storeId: params.storeId,
				images: {
					deleteMany: {}, // This will delete all related images
				},
				categoryId,
				sizeId,
				colorId,
			},
		});
		const product = await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				name,
				price,
				isFeatured,
				isArchived,
				storeId: params.storeId,
				images: {
					...(images &&
						images.length > 0 && {
							createMany: {
								data: images.map((image: { url: string }) => ({
									url: image.url,
								})),
							},
						}),
				},
				categoryId,
				sizeId,
				colorId,
			},
		});

		return NextResponse.json(product);
	} catch (err) {
		console.log("[PRODUCT_PATCH]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string; productId: string } }
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
		if (!storeByUserId && !params?.productId)
			return new NextResponse("Unauthorized", { status: 403 });

		const product = await prismadb.product.deleteMany({
			where: {
				id: params.productId,
			},
		});
		return NextResponse.json(product);
	} catch (err) {
		console.log("[PRODUCT_DELETE]", err);
		return new NextResponse("Internal server error", { status: 500 });
	}
}
