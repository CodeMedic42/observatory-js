import Chai = require('chai');

import Observable from '../src/index';

import { basicObject, basicArray } from './artifacts';

const expect = Chai.expect;

describe('Get(path: string | string[]) >> ', () => {
    describe('Level 0 >> ', () => {
        it('path: undefined', () => {
            const ob = new Observable(basicObject);

            const observed = ob.get();

            expect(observed instanceof Observable).to.be.true;
            expect(observed.toJS()).to.deep.equal(basicObject);
        });

        it('path: null', () => {
            const ob = new Observable(basicObject);

            expect(() => {
                ob.get(null);
            }).to.throw('Observable.get requires a string or string[] if a value is provided');
        });

        it('path: empty string', () => {
            const ob = new Observable(basicObject);

            const observed = ob.get('');

            expect(observed instanceof Observable).to.be.true;
            expect(observed.toJS()).to.deep.equal(basicObject);
        });

        it('path: empty array', () => {
            const ob = new Observable(basicObject);

            const observed = ob.get([]);

            expect(observed instanceof Observable).to.be.true;
            expect(observed.toJS()).to.deep.equal(basicObject);
        });
    });

    describe('Level 1 >> ', () => {
        describe('path: string', () => {
            it('returns scalar >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get('num');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.num);
            });

            it('returns object >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get('obj');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.obj);
            });

            it('returns array >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get('arr');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.arr);
            });
        });

        describe('path: array', () => {
            it('returns scalar >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get(['num']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.num);
            });

            it('returns object >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get(['obj']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.obj);
            });

            it('returns array >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get(['arr']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.arr);
            });
        });
    });

    describe('Level 2 >> ', () => {
        describe('path: string', () => {
            it('returns scalar >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get('obj.num');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.obj.num);
            });

            it('returns object >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get('obj.obj');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.obj.obj);
            });

            it('returns array item >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get('arr.2');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.arr[2]);
            });
        });

        describe('path: array', () => {
            it('returns scalar >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get(['obj', 'num']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.obj.num);
            });

            it('returns object >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get(['obj', 'obj']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.obj.obj);
            });

            it('returns array item >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get(['arr', '2']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.arr[2]);
            });
        });
    });

    describe('Level 3 >> ', () => {
        describe('path: string', () => {
            it('returns scalar >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get('obj.obj.num');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.obj.obj.num);
            });

            it('returns array item >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get('arr.5.num');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.arr[5].num);
            });
        });

        describe('path: array', () => {
            it('returns scalar >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get(['obj', 'obj', 'num']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.obj.obj.num);
            });

            it('returns array item >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get(['arr', '5', 'num']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.arr[5].num);
            });
        });
    });
});