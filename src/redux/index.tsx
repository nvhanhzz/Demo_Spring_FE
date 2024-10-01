import { combineReducers, createStore } from 'redux';
import accountReducer, { accountState } from './reducers/account';
import alertReducer, { AlertState } from './reducers/alert';

export interface RootState {
    currentAccount: accountState;
    alert: AlertState
}

const rootReducer = combineReducers({
    currentAccount: accountReducer,
    alert: alertReducer
});

const store = createStore(rootReducer);

export type AppDispatch = typeof store.dispatch;
export default store;