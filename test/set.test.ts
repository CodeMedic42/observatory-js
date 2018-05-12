import Chai = require('chai');

import Observable from '../src/index';

import { basicObject, basicArray } from './artifacts';

const expect = Chai.expect;

describe('Set(value: any, path: string | string[]) >> ', () => {
    describe('value: null', () => {
        describe('Level 0 >> ', () => {
            it('path: undefined', () => {
                const ob = new Observable(basicObject);

                const observed = ob.set(null);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.equal(null);
            });

            it('path: null', () => {
                const ob = new Observable(basicObject);

                expect(() => {
                    const observed = ob.set(null, null);
                }).to.throw('Observable.set requires a string or string[] if a value is provided');
            });

            it('path: empty string', () => {
                const ob = new Observable(basicObject);

                const observed = ob.set('', null);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(null);
            });

            it('path: empty array', () => {
                const ob = new Observable(basicObject);

                const observed = ob.set([], null);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(null);
            });
        });
    });

    describe('value: scalar', () => {
        describe('Level 1 >> ', () => {
            describe('path: array', () => {
                it('was null', () => {
                    const ob = new Observable(basicObject);

                    const observed = ob.set(['nullValue'], 42);

                    expect(observed instanceof Observable).to.be.true;
                    expect(observed.toJS()).to.deep.equal(42);
                    expect(ob.toJS('nullValue')).to.deep.equal(42);
                });

                it('was a scalar', () => {
                    const ob = new Observable(basicObject);

                    const observed = ob.set(['str'], 42);

                    expect(observed instanceof Observable).to.be.true;
                    expect(observed.toJS()).to.deep.equal(42);
                    expect(ob.toJS('str')).to.deep.equal(42);
                });

                it('was an object', () => {
                    const ob = new Observable(basicObject);

                    const observed = ob.set(['obj'], 42);

                    expect(observed instanceof Observable).to.be.true;
                    expect(observed.toJS()).to.deep.equal(42);
                    expect(ob.toJS('obj')).to.deep.equal(42);
                });

                it('was an array', () => {
                    const ob = new Observable(basicObject);

                    const observed = ob.set(['arr'], 42);

                    expect(observed instanceof Observable).to.be.true;
                    expect(observed.toJS()).to.deep.equal(42);
                    expect(ob.toJS('arr')).to.deep.equal(42);
                });
            });
        });

        describe('Level 2 >> ', () => {
            describe('path: array', () => {
                it('was null', () => {
                    const ob = new Observable(basicObject);

                    const observed = ob.set(['obj', 'nullValue'], 42);

                    expect(observed instanceof Observable).to.be.true;
                    expect(observed.toJS()).to.deep.equal(42);
                    expect(ob.toJS('obj.nullValue')).to.deep.equal(42);
                });

                it('was a scalar', () => {
                    const ob = new Observable(basicObject);

                    const observed = ob.set(['obj', 'str'], 42);

                    expect(observed instanceof Observable).to.be.true;
                    expect(observed.toJS()).to.deep.equal(42);
                    expect(ob.toJS('obj.str')).to.deep.equal(42);
                });

                it('was an object', () => {
                    const ob = new Observable(basicObject);

                    const observed = ob.set(['obj', 'obj'], 42);

                    expect(observed instanceof Observable).to.be.true;
                    expect(observed.toJS()).to.deep.equal(42);
                    expect(ob.toJS('obj.obj')).to.deep.equal(42);
                });

                it('was an array', () => {
                    const ob = new Observable(basicObject);

                    const observed = ob.set(['obj', 'arr'], 42);

                    expect(observed instanceof Observable).to.be.true;
                    expect(observed.toJS()).to.deep.equal(42);
                    expect(ob.toJS('obj.arr')).to.deep.equal(42);
                });
            });
        });
    });

    describe('value: object', () => { });

    describe('value: array', () => { });

    describe('Level 1 >> ', () => {
        xdescribe('path: string', () => {
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

        xdescribe('path: array', () => {
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
        xdescribe('path: string', () => {
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

        xdescribe('path: array', () => {
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
        xdescribe('path: string', () => {
            it('returns scalar >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get('obj.obj.num');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.obj.obj.num);
            });

            it('returns array item >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get('arr.2.num');

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.arr[2].num);
            });
        });

        xdescribe('path: array', () => {
            it('returns scalar >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get(['obj', 'obj', 'num']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.obj.obj.num);
            });

            it('returns array item >> ', () => {
                const ob = new Observable(basicObject);

                const observed = ob.get(['arr', '2', 'num']);

                expect(observed instanceof Observable).to.be.true;
                expect(observed.toJS()).to.deep.equal(basicObject.arr[2].num);
            });
        });
    });
});