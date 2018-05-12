
// import Chai = require('chai');
// // import _ = require('lodash');
// // import Sinon = require('sinon');

// import Observable from '../src/index';

// const expect = Chai.expect;

// // function createOnChangeSpy(targetOb) {
// //   targetOb.on();

// //   const spy = Sinon.spy();

// //   targetOb.on('change', spy);

// //   return spy;
// // }

// describe('Observable Tests :', () => {
//   describe('Set :', () => {
//     //   it('No id provided', () => {
//     //     const ob = new Observable(basicObject);

//     //     ob.set(42);

//     //     expect(ob.toJS()).to.equal(42);
//     //   });

//     //   it('Set id null', () => {
//     //     const ob = new Observable(basicObject);

//     //     ob.set(42, null);

//     //     expect(ob.toJS()).to.equal(42);
//     //   });

//     //   it('Set id ""', () => {
//     //     const ob = new Observable(basicObject);

//     //     ob.set(42, '');

//     //     expect(ob.toJS()).to.equal(42);
//     //   });

//     //   it('Set id "str"', () => {
//     //     const ob = new Observable(basicObject);

//     //     ob.set('str', 'bar');

//     //     const clone = _.cloneDeep(basicObject);

//     //     clone.str = 'bar';

//     //     expect(ob.toJS()).to.deep.equal(clone);
//     //   });

//     //   it('Set id "dne"', () => {
//     //     const ob = new Observable(basicObject);

//     //     ob.set('dne', 'bar');

//     //     const clone = _.cloneDeep(basicObject);

//     //     clone.dne = 'bar';

//     //     expect(ob.toJS()).to.deep.equal(clone);
//     //   });

//     //   it('Set id "arr.1.num"', () => {
//     //     const ob = new Observable(basicObject);

//     //     ob.set(43, 'arr.1.num');

//     //     const clone = _.cloneDeep(basicObject);

//     //     clone.arr[1].num = 43;

//     //     expect(ob.toJS()).to.deep.equal(clone);
//     //   });

//     //   it('Set id "arr.1.num" as observable', () => {
//     //     const ob = new Observable(basicObject);

//     //     const obNum = new Observable(43);

//     //     ob.set(obNum, 'arr.1.num');

//     //     const clone = _.cloneDeep(basicObject);

//     //     clone.arr[1].num = 43;

//     //     expect(ob.toJS()).to.deep.equal(clone);
//     //   });
//   });

//   describe('on:change :', () => {
//     //   it('No id provided', () => {
//     //     const ob = new Observable(basicObject);

//     //     const spy = createOnChangeSpy(ob);

//     //     ob.set(42);

//     //     expect(spy.calledOnce).to.be.true;
//     //   });

//     //   it('set no id provided', () => {
//     //     const obA = new Observable(null);
//     //     const obB = new Observable(obA);

//     //     const spyA = createOnChangeSpy(obA);
//     //     const spyB = createOnChangeSpy(obB);

//     //     obA.set(42);

//     //     expect(spyA.calledOnce).to.be.true;
//     //     expect(spyB.calledOnce).to.be.true;

//     //     expect(obA.toJS()).to.equal(42);
//     //     expect(obB.toJS()).to.equal(42);
//     //   });
//   });

//   // function buildTestObject() {
//   //     return Observable({
//   //         str: 'foo',
//   //         num: 42,
//   //         bool: true,
//   //         obj: {
//   //             str: 'foo',
//   //             num: 42,
//   //             bool: true,
//   //             obj: {
//   //                 str: 'foo',
//   //                 num: 42,
//   //                 bool: true
//   //             },
//   //             arr: [{
//   //                 str: 'foo',
//   //                 num: 42,
//   //                 bool: true
//   //             }, {
//   //                 str: 'foo',
//   //                 num: 42,
//   //                 bool: true
//   //             }]
//   //         },
//   //         arr: [{
//   //             str: 'foo',
//   //             num: 42,
//   //             bool: true,
//   //             obj: {
//   //                 str: 'foo',
//   //                 num: 42,
//   //                 bool: true
//   //             },
//   //             arr: [{
//   //                 str: 'foo',
//   //                 num: 42,
//   //                 bool: true
//   //             }, {
//   //                 str: 'foo',
//   //                 num: 42,
//   //                 bool: true
//   //             }]
//   //         }, {
//   //             str: 'foo',
//   //             num: 42,
//   //             bool: true,
//   //             obj: {
//   //                 str: 'foo',
//   //                 num: 42,
//   //                 bool: true
//   //             },
//   //             arr: [{
//   //                 str: 'foo',
//   //                 num: 42,
//   //                 bool: true
//   //             }, {
//   //                 str: 'foo',
//   //                 num: 42,
//   //                 bool: true
//   //             }]
//   //         }]
//   //     });
//   // }
//   //
//   // it('Build test object', () => {
//   //     buildTestObject();
//   // });
//   //
//   describe('Run against test object', () => {
//     //     beforeEach(function beforeEach() {
//     //         this.mainObject = buildTestObject();
//     //     });
//     //
//     describe('Set :', () => {
//       //         it('No id provided', function test() {
//       //             const ob = new Observable(null);
//       //
//       //             ob.set(42);
//       //
//       //             expect(ob.toJS()).to.equal(42);
//       //         });
//     });
//     //
//     describe('on:change :', () => {
//       //         it('set no id provided', () => {
//       //             debugger;
//       //
//       //             const obA = new Observable(null);
//       //             const obB = new Observable(obA);
//       //
//       //             const spyA = Sinon.spy();
//       //             const spyB = Sinon.spy();
//       //
//       //             obA.on('change', spyA);
//       //             obB.on('change', spyB);
//       //
//       //             obA.set(42);
//       //
//       //             expect(spyA.calledOnce).to.be.true;
//       //             expect(spyB.calledOnce).to.be.true;
//       //
//       //             expect(obA.toJS()).to.equal(42);
//       //             expect(obB.toJS()).to.equal(42);
//       //         });
//     });

//     describe('Get :', () => {
//       //         it('no id provided', () => {
//       //             const ob = new Observable(null);
//       //
//       //             const newOb = ob.get();
//       //
//       //             expect(newOb).to.equal(ob);
//       //         });

//       describe('no id provided', () => {
//         // it('undefined value', () => {
//         //     const ob = new Observable({
//         //
//         //     });
//         //
//         //     const newOb = ob.get();
//         //
//         //     expect(newOb).to.equal(ob);
//         // });
//       });
//     });

//     describe('toJS :', () => {

//     });

//     describe('Pause :', () => {

//     });

//     describe('Unpause :', () => {

//     });
//   });

//   describe('Heavy Tests', () => {
//     //   it('other 1', () => {
//     //     const ob = new Observable({});

//     //     ob.set(false, 'foo');

//     //     expect(ob.toJS()).to.deep.equal({
//     //       foo: false
//     //     });

//     //     ob.set({
//     //       valid: true
//     //     }, 'foo');

//     //     expect(ob.toJS()).to.deep.equal({
//     //       foo: {
//     //         valid: true
//     //       }
//     //     });
//   });

//   //   it('Merge 1', () => {
//   //     // Verify that after two observables are merged the right events fire.

//   //     const testDataA = _.cloneDeep(basicObject);
//   //     const testDataB = _.cloneDeep(basicObject);

//   //     const obA = new Observable(testDataA);
//   //     const obB = new Observable(testDataB);

//   //     const spyA = createOnChangeSpy(obA);
//   //     const spyB = createOnChangeSpy(obB);

//   //     obA.set(obB);

//   //     // Nothing should have been called a nothing technicaly changed
//   //     expect(spyA.called).to.be.false;
//   //     expect(spyB.called).to.be.false;

//   //     obB.set('str', 'bar');

//   //     // Both should have fired their events once.
//   //     expect(spyA.calledOnce).to.be.true;
//   //     expect(spyB.calledOnce).to.be.true;

//   //     testDataA.str = 'bar';

//   //     expect(obA.toJS()).to.deep.equal(testDataA);
//   //     expect(obB.toJS()).to.deep.equal(testDataA);
//   //   });

//   //   it('Merge 2', () => {
//   //     // Verify that after two observables are merged the right events fire.

//   //     const testDataA = _.cloneDeep(basicObject);
//   //     const testDataB = _.cloneDeep(basicObject);

//   //     const obA = new Observable(testDataA);
//   //     const obAObjNum = obA.get('obj.num');

//   //     const obB = new Observable(testDataB);
//   //     const obBObj = obB.get('obj');
//   //     const obBObjNum = obB.get('obj.num');

//   //     const spyA = createOnChangeSpy(obA);
//   //     const spyAObjNum = createOnChangeSpy(obAObjNum);
//   //     const spyB = createOnChangeSpy(obB);
//   //     const spyBObj = createOnChangeSpy(obBObj);
//   //     const spyBObjNum = createOnChangeSpy(obBObjNum);

//   //     obA.set(obBObj, 'obj');

//   //     // Nothing should have been called a nothing technicaly changed
//   //     expect(spyA.called).to.be.false;
//   //     expect(spyAObjNum.called).to.be.false;
//   //     expect(spyB.called).to.be.false;
//   //     expect(spyBObj.called).to.be.false;
//   //     expect(spyBObjNum.called).to.be.false;

//   //     obB.set(24, 'obj.num');

//   //     // Both should have fired their events once.
//   //     expect(spyA.calledOnce).to.be.true;
//   //     expect(spyAObjNum.calledOnce).to.be.true;
//   //     expect(spyB.calledOnce).to.be.true;
//   //     expect(spyBObj.calledOnce).to.be.true;
//   //     expect(spyBObjNum.calledOnce).to.be.true;

//   //     testDataA.obj.num = 24;

//   //     expect(obA.toJS()).to.deep.equal(testDataA);
//   //     expect(obB.toJS()).to.deep.equal(testDataA);

//   //     expect(obAObjNum.toJS()).to.deep.equal(testDataA.obj.num);
//   //     expect(obBObj.toJS()).to.deep.equal(testDataA.obj);
//   //     expect(obBObjNum.toJS()).to.deep.equal(testDataA.obj.num);
//   //   });

//   // it('array test', () => {
//   //   function checkForUnique(list, value, id) {
//   //     const index = _.findIndex(list.toJS(), (content) => {
//   //       return content.value === value;
//   //     });

//   //     if (index <= -1) {
//   //       return 'dne';
//   //     }

//   //     const content = list.get(`${index}`);

//   //     return content.toJS().owner === id ? 'owner' : 'fail';
//   //   }

//   //   const ob = new Observable([]);

//   //   let paused = false;

//   //   const validate = (id) => {
//   //     if (paused) {
//   //       return;
//   //     }

//   //     const ret = checkForUnique(ob, 'foo', id);

//   //     if (ret === 'fail') {
//   //       // throw new Error('EXISTS!');
//   //     } else if (ret === 'dne') {
//   //       paused = true;

//   //       ob.push({
//   //         value: 'foo',
//   //         owner: id
//   //       });

//   //       paused = false;
//   //     }
//   //   };

//   //   validate('dudeA');

//   //   ob.watch([], validate);

//   //   validate('dudeB');
//   // });
//   // });
// });