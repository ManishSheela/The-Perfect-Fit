"use client";
import { useState, useEffect } from "react";

const slider = [
	{
		image:
			"https://img.freepik.com/free-photo/full-shot-cool-people-wearing-chain-necklace_23-2149409723.jpg?t=st=1723995902~exp=1723999502~hmac=af3c8ca422a0ea36c0e1907e7607d735b508caa64ddb919b2f0046c70f693db7&w=826",
		label: "Explore the special collection!",
	},
	{
		image:
			"https://img.freepik.com/free-photo/magnificent-woman-long-bright-skirt-dancing-studio-carefree-inspired-female-model-posing-with-pleasure-yellow_197531-11084.jpg?t=st=1723995997~exp=1723999597~hmac=57b8ec63b50c1c5d6e423441627460e43966b9dc8f957ac2b29c1ff3fc6cb774&w=826",
		label: "Latest fashion trends!",
	},
	{
		image:
			"https://img.freepik.com/free-photo/laughing-fascinating-girl-white-sneakers-jumping-purple-wall-full-length-photo-enthusiastic-young-woman-with-wavy-hair-dancing_197531-5121.jpg?t=st=1723996073~exp=1723999673~hmac=f428ac378cd7fc2005a0e523137d90a6fc81581b513bfb5b3635095253a089a7&w=826",
		label: "Discover exclusive deals!",
	},
];

const BillboardSlider = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) =>
				prevIndex === slider.length - 1 ? 0 : prevIndex + 1
			);
		}, 2000); // Change image every 2 seconds

		return () => clearInterval(interval); // Cleanup function when component unmount
	}, []);

	const { image, label } = slider[currentIndex];

	return (
		<div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
			<div
				className="rounded-xl relative aspect-[2.4/1] overflow-hidden bg-no-repeat bg-cover max-h-[350px] w-full transition-all duration-500"
				style={{
					backgroundImage: `url(${image})`,
				}}
			>
				<div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8 bg-black bg-opacity-40">
					<p className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs text-white">
						{label}
					</p>
				</div>
			</div>
		</div>
	);
};

export default BillboardSlider;
