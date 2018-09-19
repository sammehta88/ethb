import { ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { map, switchMap } from 'rxjs/operators';
import { timer, merge } from 'rxjs';

// Actions
export const FETCH_PRICES = 'eth-btc/prices/FETCH_PRICES';
export const FETCH_PRICES_FULFILLED = 'eth-btc/prices/FETCH_PRICES_FULFILLED';

// Reducer
export default function reducer(state = {}, action = {}) {
    switch (action.type) {
        case FETCH_PRICES_FULFILLED:
            return {
                ...state,
                [action.payload.coin]: action.payload.response,
            }
        default: return state;
    }
}

const ONE_MINUTE_MS = 60000;
const COINBASE_BASE_URL = 'https://api.pro.coinbase.com';

// // Returns observable that will emit value of the response of the get request
// const fetchBtcPrice$ = getJSON(`${COINBASE_BASE_URL}/products/BTC-USD/ticker`);
// const fetchEthPrice$ = getJSON(`${COINBASE_BASE_URL}/products/ETH-USD/ticker`);

// Map to stream of fulfilled actions for the coin passed in
const mapToFulfilled$ = coin => map(response => fetchPriceFulfilled({ response, coin }));

// For each dispatch of FETCH_PRICES, stop any previous polling/requests
// and start a new poll to hit coinbase APIs every 60 seconds. A immediate
// request will be triggered.
export const pricesEpic = (action$, state$, { getJSON }) => action$.pipe(
    ofType(FETCH_PRICES),
    switchMap(action => 
        timer(0, ONE_MINUTE_MS).pipe(
            switchMap(action =>
                merge(
                    getJSON(`${COINBASE_BASE_URL}/products/BTC-USD/ticker`).pipe(mapToFulfilled$('BTC')),
                    getJSON(`${COINBASE_BASE_URL}/products/ETH-USD/ticker`).pipe(mapToFulfilled$('ETH')),
                ),
            ), // add catch here
        )
    )
);

export const fetchPrices = () => {
    return {
        type: FETCH_PRICES,
    }
};

export const fetchPriceFulfilled = (payload) => {
    return {
        type: FETCH_PRICES_FULFILLED,
        payload,
    }
};
