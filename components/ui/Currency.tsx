"use client";
import React, { useEffect, useState } from "react";

type Props = {
	value: string | number;
};

const currencyMap: { [key: string]: string } = {
	$: "USD",
	"₹": "INR",
	// Add more  if needed
};

const Currency = ({ value }: Props) => {
	const [isMounted, setIsMounted] = useState(false);

	// to prevent hydration error
	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	// Determine the currency based on `value` if `currency` is not provided
	const currencyCode = currencyMap[value.toString().trim().charAt(0)] || "INR";

	// Handle cases where `value` might include a currency symbol or be just a number
	const numericValue =
		typeof value === "number"
			? value
			: parseFloat(value.replace(/[^\d.-]/g, "")); // Remove currency symbols

	// Create a formatter for the given currency code
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currencyCode,
	});

	return <div className="font-semibold">{formatter.format(numericValue)}</div>;
};

export default Currency;
