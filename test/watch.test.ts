import Chai = require('chai');
import Sinon = require('sinon');
import cloneDeep = require('lodash/cloneDeep');
import set = require('lodash/set');
import reduce = require('lodash/reduce');
import get = require('lodash/get');
import reduceRight = require('lodash/reduceRight');
import replace = require('lodash/replace');

import Observable from '../src/index';

import { basicObject, basicArray } from './artifacts';

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

function teststrap(initalValue, target, watchTarget, newValue) {
    return function test() {
        // debug(this, 'watch(Function)', 'indirect change', 'through object change', 'from scalar', 'to scalar');
        // debug(this, 'watch(Function)', 'direct change', 'from scalar', 'to scalar');
        const ob = new Observable(initalValue);

        const spy = Sinon.spy();

        const targetDiff = replace(target, watchTarget, '');

        const stop = watchTarget == null ? ob.watch(spy) : ob.watch(watchTarget, spy);
 
        set(initalValue, target, newValue);

        let watched = null;

        if (watchTarget.length > 0) {
            watched = get(initalValue, watchTarget);
        } else if (target.length > 0) {
            watched = initalValue;
        } else {
            watched = newValue;
        }

        // const expected = watchTarget.length > 0 ? get(initalValue, watchTarget) : newValue;

        ob.set(target, newValue);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.deep.equal(watched);
        expect(spy.args[0][1]).to.equal(targetDiff);

        spy.resetHistory();

        stop();

        ob.set('hello');

        expect(spy.callCount).to.equal(0);
    };
}

describe('watch(Function) >> ', () => {
    describe('direct change >> ', () => {
        describe('from scalar >> ', () => {
            it('to scalar >> ', teststrap(true, '', '', 42));
            it('to object >> ', teststrap(true, '', '', { foo: 'bar' }));
            it('to array >> ', teststrap(true, '', '', [42, null, 'test']));
        });

        describe('from object >> ', () => {
            it('to scalar >> ', teststrap((basicObject()), '', '', 42));
            it('to object >> ', teststrap(basicObject(), '', '', { foo: 'bar' }));
            it('to array >> ', teststrap(basicObject(), '', '', [42, null, 'test']));
        });

        describe('from array >> ', () => {
            it('to scalar >> ', teststrap(basicArray(), '', '', 42));
            it('to object >> ', teststrap(basicArray(), '', '', { foo: 'bar' }));
            it('to array with less items >> ', teststrap(basicArray(), '', '', [42, null, 'test']));
            it('to array with more items >> ', teststrap(basicArray(), '', '', [42, null, 'test', 42, null, 'test', 42, null, 'test']));
        });
    });

    describe('indirect change >> ', () => {
        describe('through object change >> ', () => {
            describe('from scalar >> ', () => {
                it('to scalar >> ', teststrap(basicObject(), 'str', '', 42));
                it('to object >> ', teststrap(basicObject(), 'str', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicObject(), 'str', '', [42, null, 'test']));
            });

            describe('from object >> ', () => {
                it('to scalar >> ', teststrap(basicObject(), 'obj', '', 42));
                it('to object >> ', teststrap(basicObject(), 'obj', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicObject(), 'obj', '', [42, null, 'test']));
            });

            describe('from arrary >> ', () => {
                it('to scalar >> ', teststrap(basicObject(), 'arr', '', 42));
                it('to object >> ', teststrap(basicObject(), 'arr', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicObject(), 'arr', '', [42, null, 'test']));
            });
        });

        describe('through array change >>', () => {
            describe('from scalar >> ', () => {
                it('to scalar >> ', teststrap(basicArray(), '0', '', 42));
                it('to object >> ', teststrap(basicArray(), '0', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicArray(), '0', '', [42, null, 'test']));
            });

            describe('from object >> ', () => {
                it('to scalar >> ', teststrap(basicArray(), '5', '', 42));
                it('to object >> ', teststrap(basicArray(), '5', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicArray(), '5', '', [42, null, 'test']));
            });

            describe('from arrary >> ', () => {
                it('to scalar >> ', teststrap(basicArray(), '6', '', 42));
                it('to object >> ', teststrap(basicArray(), '6', '', { foo: 'bar' }));
                it('to array >> ', teststrap(basicArray(), '6', '', [42, null, 'test']));
            });
        });
    });
});

describe('watch(path, callback) >> ', () => {
    it('scalar >> ', teststrap(basicObject(), 'num', 'num', 42));
});
