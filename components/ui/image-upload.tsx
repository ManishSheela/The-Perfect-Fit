"use client";
import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value,
}) => {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);
	const onUpload = (result: any) => {
		console.log({ result });
		const newImageUrl = result.info.secure_url;
		onChange(newImageUrl);
	};
	console.log({value});

	if (!isMounted) return null;

	return (
		<>
			<div className="mb-4 flex items-center gap-4">
				{value?.map((url, index) => (
					<div
						key={index}
						className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
					>
						<div className="z-10 absolute top-2 right-2">
							<Button
								type="button"
								variant="destructive"
								onClick={() => onRemove(url)}
								size="icon"
							>
								<Trash className="w-4 h-4" />
							</Button>
						</div>
						<Image
							src={url}
							alt="Picture of the author"
							className="object-cover"
							fill
						/>
					</div>
				))}
			</div>
			<CldUploadWidget
				onSuccess={onUpload}
				uploadPreset="jg6xzyvs"
				options={{
					multiple: true,
					maxFiles: 5,
					sources: ["local", "url", "unsplash"],
				}}
				onQueuesEnd={(res) => console.log({res})}
			>
				{({ open }) => {
					const onClick = () => {
						open();
					};

					return (
						<Button
							type="button"
							disabled={disabled}
							variant="secondary"
							onClick={onClick}
						>
							<ImagePlus className="w-4 h-4 mr-2" />
							Upload an Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</>
	);
};
export default ImageUpload;
