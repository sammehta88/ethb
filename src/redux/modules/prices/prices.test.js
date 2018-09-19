// import { marbles } from 'rxjs-marbles/jest';
import { pricesEpic, FETCH_PRICES, FETCH_PRICES_FULFILLED } from './prices';
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';

describe('pricesEpic', () => {

    it('should dispatch a fetch fulfilled actions for both ETH and BTC immediately', (done) => {
        // const values = {
        //     a: { type: FETCH_PRICES },
        //     b: { type: 'NOT_FETCH_ACTION' },
        //     c: { type: FETCH_PRICES_FULFILLED },
        //     d: { type: FETCH_PRICES_FULFILLED },
        // };

        // const action$ = m.cold('-a-b-|', values);
        // const expected$ = m.cold('--cd|', values);

        const mockResponse = { price: 'fakeprice' };
        const action$ = ActionsObservable.of({ type: FETCH_PRICES});
        const state$ = null;
        const dependencies = {
            getJSON: url => of({ ...mockResponse, url }),
        };

        const result$ = pricesEpic(action$, state$, dependencies).pipe(
            toArray(),
        );
        // epic$
        //     .toArray()
        //     .subscribe(actual => {
        //         console.log(actual);
        //     });
        // m.expect(actual$).toBeObservable(expected$);
        result$.subscribe(actions => {
            console.log('woot woot');
            expect(actions).toBe(5);
            done();
        });
    });
});
