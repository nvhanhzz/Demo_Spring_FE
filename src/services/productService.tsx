import { getCookie } from "../utils/cookies";
import { del, get, patchJson, postJson } from "../utils/request";

// Hàm lấy danh sách sản phẩm từ server
export const getListProduct = async (
    page: number, size: number, sortBy = 'id', sortDirection = 'ASC'
): Promise<Response> => {
    const token = getCookie("token") as string;
    const path = `product?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    try {
        const response = await get(path, token);
        return response; // Trả về toàn bộ Response để xử lý tại nơi gọi hàm
    } catch (error) {
        console.error('Failed to get list of products:', error);
        throw error;
    }
};

// Hàm cập nhật chi tiết sản phẩm
export const updateProductDetails = async (id: string, data: Record<string, any>): Promise<Response> => {
    const token = getCookie("token") as string;
    const path = `product/${id}`;
    try {
        const response = await patchJson(path, data, token);
        return response; // Trả về toàn bộ Response để xử lý tại nơi gọi hàm
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// Hàm xóa sản phẩm
export const deleteProduct = async (id: string): Promise<Response> => {
    const token = getCookie("token") as string;
    const path = `product/${id}`;
    try {
        const response = await del(path, token);
        return response; // Trả về toàn bộ Response để xử lý tại nơi gọi hàm
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// Hàm tạo sản phẩm mới
export const createProduct = async (data: Record<string, any>): Promise<Response> => {
    const token = getCookie("token") as string;
    const path = `product`;
    try {
        const response = await postJson(path, data, token);
        return response; // Trả về toàn bộ Response để xử lý tại nơi gọi hàm
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Hàm lấy chi tiết sản phẩm
export const getProductDetails = async (id: string): Promise<Response> => {
    const token = getCookie("token") as string;
    const path = `product/${id}`;
    try {
        const response = await get(path, token);
        return response; // Trả về toàn bộ Response để xử lý tại nơi gọi hàm
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};