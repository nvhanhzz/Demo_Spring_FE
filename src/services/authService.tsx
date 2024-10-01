import { get, postJson } from "../utils/request";

const PREFIX_AUTH: string = import.meta.env.VITE_PREFIX_AUTH as string;

export const getCurrentAdmin = async (token: string): Promise<Response> => {
    try {
        const result = await get(`${PREFIX_AUTH}/information`, token);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postLogin = async (option: Record<string, any>): Promise<Response> => {
    try {
        const result = await postJson(`${PREFIX_AUTH}/login`, option);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};