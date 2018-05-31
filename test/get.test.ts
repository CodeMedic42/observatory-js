import Chai = require('chai');

import Observable from '../src/index';

import { basicObject, basicArray } from './artifacts';

const expect = Chai.expect;

describe('Get(path: string | string[]) >> ', () => {
    describe('Level 0 >> ', () => {
        it('path: undefined', () => {
            const inital = basicObject();
            const ob = new Observable(inital);

            const observed = ob.get();

            expect(observed instanceof Observable).to.be.true;
            expect(observed.toJS()).to.deep.equal(inital);
        });

        it('path: null', () => {
            const inital = basicObject();
            const ob = new Observable(inital);

            expect(() => {
                ob.get(null);
            }).to.throw('Observable.get requires a string or string[] if a value is provided');
        });

        it('path: empty string', () => {
            const inital = basicObject();
            const ob = new Observable(inital);

            const observed = ob.get('');

            expect(observed instanceof Observable).to.be.true;
            expect(observed.toJS()).to.deep.equal(inital);
        });

        it('path: empty array', () => {
            const inital = basicObject();
            const ob = new Observable(inital);

            const observed = ob.get([]);

            expect(observed instanceof Observable).to.be.true;
            expect(observed.toJS()).to.deep.equal(inital);
        });
    });

    describe('Level 1 >> ', () => {
        describe('path: string', () => {
            it('returns scalar >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get('num');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.num);
            });

            it('returns object >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get('obj');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.obj);
            });

            it('returns array >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get('arr');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.arr);
            });
        });

        describe('path: array', () => {
            it('returns scalar >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get(['num']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.num);
            });

            it('returns object >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get(['obj']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.obj);
            });

            it('returns array >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get(['arr']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.arr);
            });
        });
    });

    describe('Level 2 >> ', () => {
        describe('path: string', () => {
            it('returns scalar >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get('obj.num');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.obj.num);
            });

            it('returns object >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get('obj.obj');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.obj.obj);
            });

            it('returns array item >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get('arr.2');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.arr[2]);
            });
        });

        describe('path: array', () => {
            it('returns scalar >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get(['obj', 'num']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.obj.num);
            });

            it('returns object >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get(['obj', 'obj']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.obj.obj);
            });

            it('returns array item >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get(['arr', '2']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.arr[2]);
            });
        });
    });

    describe('Level 3 >> ', () => {
        describe('path: string', () => {
            it('returns scalar >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get('obj.obj.num');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.obj.obj.num);
            });

            it('returns array item >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get('arr.5.num');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.arr[5].num);
            });
        });

        describe('path: array', () => {
            it('returns scalar >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get(['obj', 'obj', 'num']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.obj.obj.num);
            });

            it('returns array item >> ', () => {
                const inital = basicObject();
                const ob = new Observable(inital);

                const observed = ob.get(['arr', '5', 'num']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(inital.arr[5].num);
            });
        });
    });
});