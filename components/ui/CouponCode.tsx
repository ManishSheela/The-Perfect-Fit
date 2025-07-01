import { BiSolidOffer } from "react-icons/bi";
import React, { useState } from "react";

const CouponCode = ({
	codes,
}: {
	codes: { description: string; code: string }[];
}) => {
	const [showMore, setShowMore] = useState(false);

	return (
		<div className="flex flex-col border p-3 mb-2 rounded-md h-auto">
			<div className="flex gap-2 items-center">
				<BiSolidOffer className="text-gray-600" />
				<p className="text-gray-600 font-semibold text-xs">Available Offers</p>
			</div>
			<ul className="list-disc flex flex-col justify-center gap-2 mt-4 px-4">
				{codes?.slice(0, showMore ? codes.length : 1).map((code, index) => (
					<li key={index} className="text-gray-700 text-sm">
						{code?.description} Use :{" "}
						<span className="font-bold text-black"> ({code?.code})</span>
					</li>
				))}
			</ul>

			{/* Button to show more or show less */}
			{codes.length > 1 && (
				<button
					onClick={() => setShowMore(!showMore)}
					className="text-red-500 text-sm font-semibold mt-2 focus:outline-none"
				>
					{showMore ? "Show less" : `Show more (${codes.length - 1}+)`}
				</button>
			)}
		</div>
	);
};

export default CouponCode;
