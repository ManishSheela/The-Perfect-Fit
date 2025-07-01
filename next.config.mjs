/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:3001/api/:path*",
			},
		];
	},
	images: {
		domains: ["fakestoreapi.com", "res.cloudinary.com"],
	},
};

export default nextConfig;
