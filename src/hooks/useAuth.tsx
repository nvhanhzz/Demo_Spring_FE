import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux';
import { setCurrentAccountHelper } from '../helpers/Account';
import { setCurrentAccount } from '../redux/actions/account';

export const useAuth = () => {
    const currentAccount = useSelector((state: RootState) => state.currentAccount);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const account = await setCurrentAccountHelper();

                dispatch(setCurrentAccount(account));
            } catch (error) {
                console.error("Error checking logged in status:", error);
                dispatch(setCurrentAccount(null));
            }
        };

        checkLoggedIn();
    }, [dispatch]);

    return currentAccount && currentAccount.account !== null;
};