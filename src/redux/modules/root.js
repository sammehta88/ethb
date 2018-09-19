import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';
import pricesReducer, { pricesEpic } from './prices';

export const rootEpic = combineEpics(
    pricesEpic,
);

export const rootReducer = combineReducers({
    pricesReducer,
});
