export const SET_CURRENT_ACCOUNT = 'SET_CURRENT_ACCOUNT';

export interface Account {
    _id: string,
    username: string,
    email: string,
    status: string,
    roleId: string
}

export const setCurrentAccount = (account: Account | null) => ({
    type: SET_CURRENT_ACCOUNT,
    account: account
});