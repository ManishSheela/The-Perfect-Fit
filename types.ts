export interface Billboard {
	id: string;
	label: string;
	imageUrl: string;
}

export interface Category {
	id: string;
	name: string;
	billboard?: Billboard;
}
export interface Product {
	id: number;
	name: string;
	price: number;
	images : Image[];
	category?: Category;
	size?: Object;
	color?: Object;
	description?: string;
	quantity?: number;
	stock?: number;
}

export interface Image {
	id: string;
	url: string;
	productId : string;
}


