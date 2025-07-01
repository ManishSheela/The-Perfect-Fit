import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "The Perfect Fit",
	description: "E-commerce Store",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster position="top-center" reverseOrder={false} />
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
