import { NextResponse } from "next/server"; // Adjust the import path based on your setup
import { auth } from "@clerk/nextjs";

// export function verifyUser(): string | ResponseInit {
// 	console.log("user verify");
// 	const { userId } = auth();
// 	if (!userId) {
// 		return new NextResponse("Unauthorized", { status: 401 });
// 	}
// 	return userId;
// }

export function formatter(number: number) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
	}).format(number);
}
