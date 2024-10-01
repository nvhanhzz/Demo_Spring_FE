import { getCookie } from "../utils/cookies";
import { get, patchJson, postJson } from "../utils/request";

// Hàm lấy danh sách tài khoản
export const getListAccount = async (
    page: number, size: number, sortBy = 'id', sortDirection = 'ASC', token?: string
): Promise<Response> => {
    const path = `user?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    try {
        const response = await get(path, token);
        return response; // Trả về toàn bộ Response để xử lý tại nơi gọi hàm
    } catch (error) {
        console.error('Failed to get list of accounts:', error);
        throw error;
    }
};

// Hàm cập nhật trạng thái tài khoản
export const updateAccountStatus = async (id: string, newStatus: string): Promise<Response> => {
    const token = getCookie("token") as string;
    const path = `user/${id}/status/${newStatus}`;
    try {
        const response = await patchJson(path, {}, token);
        return response; // Trả về toàn bộ Response
    } catch (error) {
        console.error('Error updating account status:', error);
        throw error;
    }
};

// Hàm lấy thông tin chi tiết tài khoản
export const getAccountDetails = async (id: string): Promise<Response> => {
    const token = getCookie("token") as string;
    const path = `user/${id}`;
    try {
        const response = await get(path, token);
        return response; // Trả về toàn bộ Response
    } catch (error) {
        console.error('Error fetching account details:', error);
        throw error;
    }
};

// Hàm cập nhật chi tiết tài khoản
export const updateAccountDetails = async (id: string, data: Record<string, any>): Promise<Response> => {
    const token = getCookie("token") as string;
    const path = `user/${id}`;
    try {
        const response = await patchJson(path, data, token);
        return response; // Trả về toàn bộ Response
    } catch (error) {
        console.error('Error updating account:', error);
        throw error;
    }
};

// Hàm tạo mới tài khoản
export const createAccount = async (data: Record<string, any>): Promise<Response> => {
    const token = getCookie("token") as string;
    const path = `user`;
    try {
        const response = await postJson(path, data, token);
        return response; // Trả về toàn bộ Response
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};
