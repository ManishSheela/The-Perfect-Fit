import { Image as ImageType } from "@/types";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import React from "react";
import GalleryTab from "./gallery-tab";

interface GalleryProps {
	images: ImageType[];
}
const Gallery: React.FC<GalleryProps> = ({ images }) => {
	return (
		<TabGroup as="div" className="flex flex-col-reverse">
			<div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
				<TabList>
					{images?.map((image, index) => (
						<GalleryTab key={image?.id ?? index} image={image} />
					))}
				</TabList>
			</div>

			<TabPanels className="aspect-square w-full">
				{images?.map((image, index) => {
					return (
						<TabPanel key={image?.id ?? index}>
							<div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
								<Image
									fill
									src={image?.url}
									alt={`Image ${index + 1}`}
									className="object-cover object-center"
								/>
							</div>
						</TabPanel>
					);
				})}
			</TabPanels>
		</TabGroup>
	);
};

export default Gallery;
