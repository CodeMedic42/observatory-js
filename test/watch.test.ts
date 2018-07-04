import Chai = require('chai');
import Sinon = require('sinon');
import cloneDeep = require('lodash/cloneDeep');
import set = require('lodash/set');
import reduce = require('lodash/reduce');
import get = require('lodash/get');
import reduceRight = require('lodash/reduceRight');
import replace = require('lodash/replace');
import isPlainObject = require('lodash/isPlainObject');
import isArray = require('lodash/isArray');

import Observable from '../src/index';

import { basicObject, basicArray, buildCircularObject } from './artifacts';

const expect = Chai.expect;

function debug(context, ...args) {
    let value = true;

    reduceRight(args, (next, arg) => {
        value = value && next.title === `${arg} >> `;

        return next.parent;
    }, context.test);

    if (value === true) {
        // debugger;
    }
}

function teststrap(initalValue, target, watchTarget, newValue, from = null) {
    return function test() {
        // debug(this, 'watch(Function)', 'indirect change', 'through object change', 'from scalar', 'to scalar');
        // debug(this, 'watch(Function)', 'direct change', 'from scalar', 'to scalar');
        const ob = new Observable(initalValue);

        const spy = Sinon.spy();

        const targetDiff = from != null ? from : replace(target, watchTarget, '');

        const stop = watchTarget == null ? ob.watch(spy) : ob.watch(watchTarget, spy);

        const parentSpy = Sinon.spy();

        const stopParent = ob.watch(parentSpy);

        let finalRootValue = initalValue

        if (target.length <= 0) {
            finalRootValue = newValue;
        } else if (isPlainObject(initalValue) || isArray(initalValue)) {
            set(initalValue, target, newValue);
        } else {
            throw new Error('Cannot set a value to a path for a scalar.');
        }

        let watched = null;

        if (watchTarget.length > 0) {
            watched = get(initalValue, watchTarget);
        } else if (target.length > 0) {
            watched = initalValue;
        } else {
            watched = newValue;
        }

        ob.set(target, newValue);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.deep.equal(watched);
        expect(spy.args[0][1]).to.equal(targetDiff);

        expect(parentSpy.callCount).to.equal(1);
        expect(parentSpy.args[0][0]).to.deep.equal(finalRootValue);
        expect(parentSpy.args[0][1]).to.equal(from != null ? from : target);

        spy.resetHistory();
        parentSpy.resetHistory();

        stop();

        const finalNewValue = 'blathering blatherskite'

        if (target.length <= 0) {
            finalRootValue = finalNewValue;
        } else if (isPlainObject(initalValue) || isArray(initalValue)) {
            set(initalValue, target, finalNewValue);
        } else {
            throw new Error('Cannot set a value to a path for a scalar.');
        }

        ob.set(target, finalNewValue);

        expect(spy.callCount).to.equal(0);

        expect(parentSpy.callCount).to.equal(1);
        expect(parentSpy.args[0][0]).to.deep.equal(finalRootValue);
        expect(parentSpy.args[0][1]).to.equal(from != null ? from : target);
    };
}

xdescribe('watch(callback) >> ', () => {
    describe('direct change >> ', () => {
        describe('from scalar >> ', () => {
            it('to null >> ', teststrap(true, '', '', null));
            it('to scalar >> ', teststrap(true, '', '', 42));
            it('to object >> ', teststrap(true, '', '', { foo: 'bar' }));
            it('to array >> ', teststrap(true, '', '', [42, null, 'test']));
        });

        describe('from object >> ', () => {
            it('to null >> ', teststrap((basicObject()), '', '', null));
            it('to scalar >> ', teststrap((basicObject()), '', '', 42));
            it('to object >> ', teststrap(basicObject(), '', '', { foo: 'bar' }));
            it('to array >> ', teststrap(basicObject(), '', '', [42, null, 'test']));
        });

        describe('from array >> ', () => {
            it('to null >> ', teststrap(basicArray(), '', '', null));
            it('to scalar >> ', teststrap(basicArray(), '', '', 42));
            it('to object >> ', teststrap(basicArray(), '', '', { foo: 'bar' }));
            it('to array with less items >> ', teststrap(basicArray(), '', '', [42, null, 'test']));
            it('to array with more items >> ', teststrap(basicArray(), '', '', [42, null, 'test', 42, null, 'test', 42, null, 'test']));
        });
    });

    describe('indirect change >> ', () => {
        describe('through object change >> ', () => {
            describe('from scalar >> ', () => {
                it('to null >> ', teststrap(basicObject(), 'str', '', null));
                it('to scalar >> ', teststrap(basicObject(), 'str', '', 42));
                it('to object >> ', teststrap(basicObject(), 'str', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicObject(), 'str', '', [42, null, 'test']));
            });

            describe('from object >> ', () => {
                it('to null >> ', teststrap(basicObject(), 'obj', '', null));
                it('to scalar >> ', teststrap(basicObject(), 'obj', '', 42));
                it('to object >> ', teststrap(basicObject(), 'obj', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicObject(), 'obj', '', [42, null, 'test']));
            });

            describe('from arrary >> ', () => {
                it('to null >> ', teststrap(basicObject(), 'arr', '', null));
                it('to scalar >> ', teststrap(basicObject(), 'arr', '', 42));
                it('to object >> ', teststrap(basicObject(), 'arr', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicObject(), 'arr', '', [42, null, 'test']));
            });
        });

        describe('through array change >>', () => {
            describe('from scalar >> ', () => {
                it('to null >> ', teststrap(basicArray(), '0', '', null));
                it('to scalar >> ', teststrap(basicArray(), '0', '', 42));
                it('to object >> ', teststrap(basicArray(), '0', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicArray(), '0', '', [42, null, 'test']));
            });

            describe('from object >> ', () => {
                it('to null >> ', teststrap(basicArray(), '5', '', null));
                it('to scalar >> ', teststrap(basicArray(), '5', '', 42));
                it('to object >> ', teststrap(basicArray(), '5', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicArray(), '5', '', [42, null, 'test']));
            });

            describe('from arrary >> ', () => {
                it('to null >> ', teststrap(basicArray(), '6', '', null));
                it('to scalar >> ', teststrap(basicArray(), '6', '', 42));
                it('to object >> ', teststrap(basicArray(), '6', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicArray(), '6', '', [42, null, 'test']));
            });
        });
    });
});

describe('watch(path, callback) >> ', () => {
    xdescribe('direct change >> ', () => {
        describe('from scalar >> ', () => {
            it('to null >> ', teststrap(basicObject(), 'num', 'num', null));
            it('to scalar >> ', teststrap(basicObject(), 'num', 'num', 42));
            it('to object >> ', teststrap(basicObject(), 'num', 'num', { foo: 'bar' }));
            it('to array >> ', teststrap(basicObject(), 'num', 'num', [42, null, 'test']));
        });
    });

    describe('indirect change >> ', () => {
        describe('through circular obj >> ', () => {
            describe('from scalar >> ', () => {
                it('to scalar >> ', teststrap(buildCircularObject(), 'obj.obj.circ.num', '', 42, 'num'));
            });
        });
    });
});
