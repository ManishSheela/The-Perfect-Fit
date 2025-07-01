"use client";

import Container from "@/components/ui/Container";
import useCart from "@/hooks/useCart";
import CartItem from "./components/CartItem";
import Currency from "@/components/ui/Currency";
import { Product } from "@/types";
import CouponCode from "./../../components/ui/CouponCode";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const DISCOUNT_CODES = [
	{
		code: "WELCOME50",
		description: "Flat ₹50 off on first purchase",
		value: 50,
		type: "fixed",
	},
	{
		code: "SUMMER20",
		description: "Get 20% off on all products",
		value: 20,
		type: "percentage",
	},
	{
		code: "FREESHIP",
		description: "Free shipping on orders over ₹100",
		value: 20,
		type: "fixed",
		minOrderValue: 100,
	},
	{
		code: "BLACKFRIDAY50",
		description: "50% off on selected items during Black Friday",
		value: 50,
		type: "percentage",
	},
	{
		code: "SAVE15",
		description: "Save ₹15 on purchases above ₹75",
		value: 15,
		type: "fixed",
		minOrderValue: 75,
	},
];

const CartPage = () => {
	const cart = useCart();
	const [discountCode, setDiscountCode] = useState("");
	const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
	const router = useRouter();

	// Calculate subtotal by summing up the prices for all items
	const subtotal = cart.items.reduce(
		(sum, item) => sum + item.price * (item.quantity || 1),
		0
	);
	// Static shipping fee (you can adjust this or make it dynamic)
	const shippingFee = subtotal > 100 ? 0 : 20;

	// Calculate discount based on discount code
	const handleRedeem = () => {
		const discount = DISCOUNT_CODES.find(
			(code) => code.code === discountCode.toUpperCase()
		);
		if (!discount) {
			toast.error("Invalid discount code");
			setAppliedDiscount(null);
		} else if (
			(discount.minOrderValue && subtotal < discount.minOrderValue) ||
			subtotal <= discount.value
		) {
			toast.error(
				`Order value must be more than ₹${discount.value} for this code`
			);
			setAppliedDiscount(null);
		} else if (subtotal < discount.value) {
			toast.error(`Order value must be more than discount`);
		} else {
			setAppliedDiscount(discount);
		}
	};

	const calculateDiscount = () => {
		if (!appliedDiscount) return 0;
		if (appliedDiscount.type === "fixed") {
			return appliedDiscount.value;
		} else if (appliedDiscount.type === "percentage") {
			return (appliedDiscount.value / 100) * subtotal;
		}
		return 0;
	};

	const discountAmount = calculateDiscount().toFixed(2);
	const total = Math.max(subtotal - discountAmount, 0) + shippingFee;

	return (
		<div className="bg-white">
			<Container>
				<div className="px-4 py-8 sm:px-6 lg:px-8">
					<h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

					{cart.items.length === 0 ? (
						<p className="text-neutral-500">No items added to cart</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full bg-white">
								<thead className="border-b">
									<tr>
										<th className="py-2 text-left " />
										<th className="py-2 text-left">PRODUCT</th>
										<th className="py-2 text-left">UNIT PRICE</th>
										<th className="py-2 text-left">QTY</th>
										<th className="py-2 text-left">PRICE</th>
									</tr>
								</thead>
								<tbody>
									{cart.items.map((product: Product) => (
										<CartItem key={product.id} item={product} />
									))}
								</tbody>
							</table>
						</div>
					)}

					{/* Summary section */}
					{cart.items.length !== 0 && (
						<div className="mt-8 flex flex-col items-center md:flex-row  justify-between">
							{/* coupon code  */}
							<div className="flex flex-col gap-4">
								<CouponCode codes={DISCOUNT_CODES} />
								<div className="flex h-[56px] w-fit items-center gap-2 rounded-md border border-gray-300 px-4 py-2 shadow-sm mb-4">
									<input
										className="text-gray-500 p-2"
										placeholder="Voucher code"
										value={discountCode}
										onChange={(e) => setDiscountCode(e.target.value)}
									/>
									<button
										type="button"
										onClick={handleRedeem}
										className="bg-slate-950 hover:bg-slate-900 text-white font-semibold py-2 px-4 rounded"
									>
										Redeem
									</button>
								</div>
							</div>
							{/* checkout section */}
							<div className="w-full max-w-xs space-y-4">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<Currency value={subtotal} />
								</div>
								<div className="flex justify-between mb-4">
									<span>Discount</span>
									<span>₹{discountAmount}</span>
								</div>
								<div className="flex justify-between">
									<span>Shipping Fee</span>
									<Currency value={shippingFee} />
								</div>
								<div className="flex justify-between font-bold border-t">
									<span>Total</span>
									<Currency value={total} />
								</div>
								<button
									onClick={() => router.push("/checkout")}
									className="w-full bg-black text-white py-2 rounded"
								>
									Check out
								</button>
							</div>
						</div>
					)}
				</div>
			</Container>
		</div>
	);
};

export default CartPage;
