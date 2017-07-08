/* eslint-disable import/no-extraneous-dependencies */

import Chai from 'chai';
import DirtyChai from 'dirty-chai';
import _ from 'lodash';
import Sinon from 'sinon';
import Observable from '../../src/observable';

Chai.use(DirtyChai);

const expect = Chai.expect;

const basicObject = {
    str: 'foo',
    num: 42,
    bool: true,
    date: new Date()
};

basicObject.obj = _.cloneDeep(basicObject);

const basicArray = [
    _.cloneDeep(basicObject),
    _.cloneDeep(basicObject)
];

basicObject.arr = _.cloneDeep(basicArray);

function createOnChangeSpy(targetOb) {
    const spy = Sinon.spy();

    targetOb.on('change:deep', spy);

    return spy;
}

// function buildSpy(name) {
//     const spy = Sinon.spy((...args) => {
//         if (spy.$calls.length <= spy.$counter) {
//             return undefined;
//         }
//
//         const callItem = spy.$calls[spy.$counter];
//
//         spy.$counter += 1;
//
//         if (_.isFunction(callItem.with)) {
//             callItem.with(...args);
//         }
//
//         return callItem.returns;
//     });
//
//     spy.$name = name;
//
//     spy.$counter = 0;
//
//     spy.$validate = (calls) => {
//         expect(spy.callCount).to.equal(calls.length);
//
//         _.forEach(calls, (call) => {
//             if (!_.isUndefined(call.on)) {
//                 expect(spy.calledOn(call.on)).to.be.true();
//             }
//
//             expect(spy.calledWith(...call.args)).to.be.true();
//             expect(spy.returned(call.returns)).to.be.true();
//         });
//     };
//
//     return spy;
// }

describe('Observable Tests :', () => {
    describe('Construction :', () => {
        it('initialize with no data', () => {
            const ob = Observable();

            expect(ob.value()).to.equal(undefined);
        });

        it('initialize with null', () => {
            const ob = Observable(null);

            expect(ob.value()).to.equal(null);
        });

        it('initialize with number', () => {
            const ob = Observable(42);

            expect(ob.value()).to.equal(42);
        });

        it('initialize with string', () => {
            const ob = Observable('foo');

            expect(ob.value()).to.equal('foo');
        });

        it('initialize with object', () => {
            const ob = Observable(basicObject);

            expect(ob.value()).to.deep.equal(basicObject);
        });

        it('initialize with array', () => {
            const ob = Observable(basicArray);

            expect(ob.value()).to.deep.equal(basicArray);
        });

        it('initialize with Observable number', () => {
            const testData = 42;

            const initWith = Observable(testData);

            const ob = Observable(initWith);

            expect(ob.value()).to.equal(42);
        });

        it('initialize with Observable object', () => {
            const initWith = Observable(basicObject);

            const ob = Observable(initWith);

            expect(ob.value()).to.deep.equal(basicObject);
        });
    });

    describe('Set :', () => {
        it('No id provided', () => {
            const ob = Observable(basicObject);

            ob.set(42);

            expect(ob.value()).to.equal(42);
        });

        it('Set id null', () => {
            const ob = Observable(basicObject);

            ob.set(null, 42);

            expect(ob.value()).to.equal(42);
        });

        it('Set id ""', () => {
            const ob = Observable(basicObject);

            ob.set('', 42);

            expect(ob.value()).to.equal(42);
        });

        it('Set id "str"', () => {
            const ob = Observable(basicObject);

            ob.set('str', 'bar');

            const clone = _.cloneDeep(basicObject);

            clone.str = 'bar';

            expect(ob.value()).to.deep.equal(clone);
        });

        it('Set id "dne"', () => {
            const ob = Observable(basicObject);

            ob.set('dne', 'bar');

            const clone = _.cloneDeep(basicObject);

            clone.dne = 'bar';

            expect(ob.value()).to.deep.equal(clone);
        });

        it('Set id "arr.1.num"', () => {
            const ob = Observable(basicObject);

            ob.set('arr.1.num', 43);

            const clone = _.cloneDeep(basicObject);

            clone.arr[1].num = 43;

            expect(ob.value()).to.deep.equal(clone);
        });

        it('Set id "arr.1.num" as observable', () => {
            const ob = Observable(basicObject);

            const obNum = Observable(43);

            ob.set('arr.1.num', obNum);

            const clone = _.cloneDeep(basicObject);

            clone.arr[1].num = 43;

            expect(ob.value()).to.deep.equal(clone);
        });
    });

    describe('on:change :', () => {
        it('No id provided', () => {
            const ob = Observable(basicObject);

            const spy = createOnChangeSpy(ob);

            ob.set(42);

            expect(spy.calledOnce).to.be.true();
        });

        it('set no id provided', () => {
            const obA = Observable();
            const obB = Observable(obA);

            const spyA = createOnChangeSpy(obA);
            const spyB = createOnChangeSpy(obB);

            obA.set(42);

            expect(spyA.calledOnce).to.be.true();
            expect(spyB.calledOnce).to.be.true();

            expect(obA.value()).to.equal(42);
            expect(obB.value()).to.equal(42);
        });
    });

    describe('Get :', () => {
        it('no id provided', () => {
            const ob = Observable();

            const newOb = ob.get();

            expect(newOb).to.equal(ob);
        });


        describe('no id provided', () => {


            // it('undefined value', () => {
            //     const ob = Observable({
            //
            //     });
            //
            //     const newOb = ob.get();
            //
            //     expect(newOb).to.equal(ob);
            // });
        });
    });

    xdescribe('toJS :', () => {

    });

    xdescribe('Pause :', () => {

    });

    xdescribe('Run :', () => {

    });

    // function buildTestObject() {
    //     return Observable({
    //         str: 'foo',
    //         num: 42,
    //         bool: true,
    //         obj: {
    //             str: 'foo',
    //             num: 42,
    //             bool: true,
    //             obj: {
    //                 str: 'foo',
    //                 num: 42,
    //                 bool: true
    //             },
    //             arr: [{
    //                 str: 'foo',
    //                 num: 42,
    //                 bool: true
    //             }, {
    //                 str: 'foo',
    //                 num: 42,
    //                 bool: true
    //             }]
    //         },
    //         arr: [{
    //             str: 'foo',
    //             num: 42,
    //             bool: true,
    //             obj: {
    //                 str: 'foo',
    //                 num: 42,
    //                 bool: true
    //             },
    //             arr: [{
    //                 str: 'foo',
    //                 num: 42,
    //                 bool: true
    //             }, {
    //                 str: 'foo',
    //                 num: 42,
    //                 bool: true
    //             }]
    //         }, {
    //             str: 'foo',
    //             num: 42,
    //             bool: true,
    //             obj: {
    //                 str: 'foo',
    //                 num: 42,
    //                 bool: true
    //             },
    //             arr: [{
    //                 str: 'foo',
    //                 num: 42,
    //                 bool: true
    //             }, {
    //                 str: 'foo',
    //                 num: 42,
    //                 bool: true
    //             }]
    //         }]
    //     });
    // }
    //
    // it('Build test object', () => {
    //     buildTestObject();
    // });
    //
    // describe('Run against test object', () => {
    //     beforeEach(function beforeEach() {
    //         this.mainObject = buildTestObject();
    //     });
    //
    //     describe('Set :', () => {
    //         it('No id provided', function test() {
    //             const ob = Observable();
    //
    //             ob.set(42);
    //
    //             expect(ob.value()).to.equal(42);
    //         });
    //     });
    //
    //     describe('on:change :', () => {
    //         it('set no id provided', () => {
    //             debugger;
    //
    //             const obA = Observable();
    //             const obB = Observable(obA);
    //
    //             const spyA = Sinon.spy();
    //             const spyB = Sinon.spy();
    //
    //             obA.on('change:deep', spyA);
    //             obB.on('change:deep', spyB);
    //
    //             obA.set(42);
    //
    //             expect(spyA.calledOnce).to.be.true();
    //             expect(spyB.calledOnce).to.be.true();
    //
    //             expect(obA.value()).to.equal(42);
    //             expect(obB.value()).to.equal(42);
    //         });
    //     });
    //
    //     describe('Get :', () => {
    //         it('no id provided', () => {
    //             const ob = Observable();
    //
    //             const newOb = ob.get();
    //
    //             expect(newOb).to.equal(ob);
    //         });
    //
    //
    //         describe('no id provided', () => {
    //
    //
    //             // it('undefined value', () => {
    //             //     const ob = Observable({
    //             //
    //             //     });
    //             //
    //             //     const newOb = ob.get();
    //             //
    //             //     expect(newOb).to.equal(ob);
    //             // });
    //         });
    //     });
    //
    //     describe('toJS :', () => {
    //
    //     });
    //
    //     describe('Pause :', () => {
    //
    //     });
    //
    //     describe('Unpause :', () => {
    //
    //     });
    // });

    describe('Heavy Tests', () => {
        it('other 1', () => {
            const ob = Observable({});

            ob.set('foo', false);

            expect(ob.value()).to.deep.equal({
                foo: false
            });

            ob.set('foo', {
                valid: true
            });

            expect(ob.value()).to.deep.equal({
                foo: {
                    valid: true
                }
            });
        });

        it('Merge 1', () => {
            // Verify that after two observables are merged the right events fire.

            const testDataA = _.cloneDeep(basicObject);
            const testDataB = _.cloneDeep(basicObject);

            const obA = Observable(testDataA);
            const obB = Observable(testDataB);

            const spyA = createOnChangeSpy(obA);
            const spyB = createOnChangeSpy(obB);

            obA.set(obB);

            // Nothing should have been called a nothing technicaly changed
            expect(spyA.called).to.be.false();
            expect(spyB.called).to.be.false();

            obB.set('str', 'bar');

            // Both should have fired their events once.
            expect(spyA.calledOnce).to.be.true();
            expect(spyB.calledOnce).to.be.true();

            testDataA.str = 'bar';

            expect(obA.value()).to.deep.equal(testDataA);
            expect(obB.value()).to.deep.equal(testDataA);
        });

        it('Merge 2', () => {
            // Verify that after two observables are merged the right events fire.

            const testDataA = _.cloneDeep(basicObject);
            const testDataB = _.cloneDeep(basicObject);

            const obA = Observable(testDataA);
            const obAObjNum = obA.get('obj.num');

            const obB = Observable(testDataB);
            const obBObj = obB.get('obj');
            const obBObjNum = obB.get('obj.num');

            const spyA = createOnChangeSpy(obA);
            const spyAObjNum = createOnChangeSpy(obAObjNum);
            const spyB = createOnChangeSpy(obB);
            const spyBObj = createOnChangeSpy(obBObj);
            const spyBObjNum = createOnChangeSpy(obBObjNum);

            obA.set('obj', obBObj);

            // Nothing should have been called a nothing technicaly changed
            expect(spyA.called).to.be.false();
            expect(spyAObjNum.called).to.be.false();
            expect(spyB.called).to.be.false();
            expect(spyBObj.called).to.be.false();
            expect(spyBObjNum.called).to.be.false();

            obB.set('obj.num', 24);

            // Both should have fired their events once.
            expect(spyA.calledOnce).to.be.true();
            expect(spyAObjNum.calledOnce).to.be.true();
            expect(spyB.calledOnce).to.be.true();
            expect(spyBObj.calledOnce).to.be.true();
            expect(spyBObjNum.calledOnce).to.be.true();

            testDataA.obj.num = 24;

            expect(obA.value()).to.deep.equal(testDataA);
            expect(obB.value()).to.deep.equal(testDataA);

            expect(obAObjNum.value()).to.deep.equal(testDataA.obj.num);
            expect(obBObj.value()).to.deep.equal(testDataA.obj);
            expect(obBObjNum.value()).to.deep.equal(testDataA.obj.num);
        });

        it('array test', () => {
            function checkForUnique(list, value, id) {
                const index = _.findIndex(list.value(), (content) => {
                    return content.value === value;
                });

                if (index <= -1) {
                    return 'dne';
                }

                const content = list.get(`${index}`);

                return content.value().owner === id ? 'owner' : 'fail';
            }

            const ob = Observable([]);

            let paused = false;

            const validate = (id) => {
                if (paused) {
                    return;
                }

                const ret = checkForUnique(ob, 'foo', id);

                if (ret === 'fail') {
                    // throw new Error('EXISTS!');
                } else if (ret === 'dne') {
                    paused = true;

                    ob.push({
                        value: 'foo',
                        owner: id
                    });

                    paused = false;
                }
            };

            validate('dudeA');

            ob.on('change:deep', validate);

            validate('dudeB');
        });
    });

    describe('Circular Ref', () => {
        xit('initialize with object', () => {
            const root = {
                levelA: {
                    levelB: {
                        levelC: {}
                    }
                }
            };

            // root.arrA.push(root.arrA[0]);
            // root.arrA.push(root.arrA[0]);
            // root.arrA.push(root.arrA[0]);
            // root.arrA.push(root.arrA[0]);

            root.levelA.levelB.levelC.refA = root.levelA;
            // root.levelA.levelB2 = root.levelA.levelB;

            // const ret = _.cloneDeep(root);
            //
            // expect(ret.levelA === ret.levelA.levelB.levelC.circ).to.be.true();
            // expect(ret.levelA.levelB === ret.levelA.levelB2).to.be.true();
            //
            // ret.arrA[0].item = 45;
            //
            // expect(ret.arrA[1].item).to.equal(45);
            // expect(ret.arrA[2].item).to.equal(45);
            // expect(ret.arrA[3].item).to.equal(45);
            // expect(ret.arrA[4].item).to.equal(45);
            //
            // ret.levelA.levelB.foo = 42;
            //
            // expect(ret.levelA.levelB2.foo).equal(42);
            // const rootOb = Observable(root);
            // const levelAOb = rootOb.get('levelA');
            // const levelBOb = levelAOb.get('levelB');
            // const levelCOb = levelBOb.get('levelC');
            // const refAOb = levelCOb.get('le');

            // rootOb.on('change:deep', )
        });

        function changeCallCountSpy(observable) {
            const shallowSpy = Sinon.spy();
            const deepSpy = Sinon.spy();

            observable.on('change:deep', deepSpy);
            observable.on('change:shallow', shallowSpy);

            return (shallowCallCount, deepCallCount) => {
                expect(shallowSpy.callCount).to.equal(shallowCallCount);
                expect(deepSpy.callCount).to.equal(deepCallCount);
            };
        }

        it('Add property with ref', () => {
            const root = {
                levelA: {
                    levelB: {
                        levelC: {}
                    }
                }
            };

            const rootOb = Observable(root);
            const levelAOb = rootOb.get('levelA');
            const levelBOb = levelAOb.get('levelB');
            const levelCOb = levelBOb.get('levelC');

            levelCOb.set('refA', levelAOb);

            const refAOb = levelCOb.get('refA');

            const rootCallCountSpy = changeCallCountSpy(rootOb);
            const levelACallCountSpy = changeCallCountSpy(levelAOb);
            const levelBCallCountSpy = changeCallCountSpy(levelBOb);
            const levelCCallCountSpy = changeCallCountSpy(levelCOb);
            const refACallCountSpy = changeCallCountSpy(refAOb);

            refAOb.set('foo', 42);

            rootCallCountSpy(0, 1);
            levelACallCountSpy(1, 1);
            levelBCallCountSpy(0, 1);
            levelCCallCountSpy(0, 1);
            refACallCountSpy(1, 1);
        });

        it('Replace existing object with refed object', () => {
            const root = {
                levelA: {
                    levelB: {
                        levelC: {}
                    }
                }
            };

            const rootOb = Observable(root);
            const levelAOb = rootOb.get('levelA');
            const levelBOb = levelAOb.get('levelB');
            const levelCOb = levelBOb.get('levelC');

            levelCOb.set(levelAOb);

            const rootCallCountSpy = changeCallCountSpy(rootOb);
            const levelACallCountSpy = changeCallCountSpy(levelAOb);
            const levelBCallCountSpy = changeCallCountSpy(levelBOb);
            const levelCCallCountSpy = changeCallCountSpy(levelCOb);

            levelBOb.set('foo', 42);

            rootCallCountSpy(0, 1);
            levelACallCountSpy(0, 1);
            levelBCallCountSpy(1, 1);
            levelCCallCountSpy(0, 1);
        });
    });
});
