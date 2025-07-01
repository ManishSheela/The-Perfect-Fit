const url = process.env.NEXT_PUBLIC_URL_STORE;
class EngagementServices {
	getCategories = async () => {
		const response = await fetch(`${url}/categories`);
		const res = await response.json(); // Only call .json() once
		return res;
	};

	getCategory = async (categoryId = "") => {
		try {
			const res = await fetch(`${url}/categories/${categoryId}`, {
				method: "GET",
			});
			const data = await res.json();
			return data;
		} catch (error) {
			console.error("Error fetching category:", error);
			return null; // or handle the error as needed
		}
	};

	getProducts = async ({ categoryId = "", colorId = "", sizeId = "" }) => {
		const query = [];
		if (categoryId) {
			query.push(`categoryId=${categoryId}`);
		}
		if (colorId) {
			query.push(`categorcolorIdyId=${colorId}`);
		}
		if (sizeId) {
			query.push(`sizeId=${sizeId}`);
		}

		try {
			const response = await fetch(`${url}/products?${query.join("&")}`);
			const res = await response.json();
			return res;
		} catch (error) {
			return { error: "Failed to fetch products" };
		}
	};

	getProduct = async (productId = "") => {
		const res = await fetch(`${url}/products/${productId}`, {
			method: "get",
		}).then((res) => res.json());
		return res;
	};

	getColors = async () => {
		try {
			const res = await fetch(`${url}/colors`, {method:'get'});
			if (!res.ok) {
				throw new Error(`API responded with status ${res.status}`);
			}
			const response = await res.json();
			return response;
		} catch (error) {
			console.error("Error fetching colors:", error);
		}
	};

	getSizes = async () => {
		const res = await fetch(`${url}/sizes`, {method : 'get'}).then((res) => res.json());
		return res;
	};
}

const EngagementService = new EngagementServices();

export default EngagementService;
