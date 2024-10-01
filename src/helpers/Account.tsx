import { getCurrentAdmin } from "../services/authService";
import { getCookie } from "../utils/cookies";
import { Account } from "../redux/actions/account";

export const setCurrentAccountHelper = async (): Promise<Account | null> => {
    const token = getCookie("token");
    if (!token) {
        return null;
    }

    const response = await getCurrentAdmin(token);

    if (response.status !== 200) {
        return null;
    }

    const result = await response.json();
    if (result.status !== 200) {
        return null;
    }

    return {
        _id: result.data._id,
        email: result.data.email,
        username: result.data.username,
        roleId: result.data.roleId,
        status: result.data.status
    };
};
