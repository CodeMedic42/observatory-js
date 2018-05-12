import Chai = require('chai');
import Sinon = require('sinon');
import cloneDeep = require('lodash/cloneDeep');
import set = require('lodash/set');
import reduce = require('lodash/reduce');

import Observable from '../src/index';

import { basicObject, basicArray } from './artifacts';

const expect = Chai.expect;

function testf(context, ...args) {
    let value = true;

    reduce(args, (next, arg) => {
        value = value && next.title === arg;

        return next.parent;
    }, context.test);

    return value;
}

describe('watch(Function) >> ', () => {
    function test(initalValue, target, newValue) {
        return function () {
            const t = testf(this, 'to array', 'from array >> ', 'direct change >> ', 'watch(Function) >> ');

            const ob = new Observable(initalValue);

            const spy = Sinon.spy();

            const stop = ob.watch(spy);

            ob.set(target, newValue);

            let expectedValue = target.length > 0 ? set(initalValue, target, newValue) : newValue;

            expect(spy.callCount).to.equal(1);
            expect(spy.args[0][0]).to.deep.equal(expectedValue);
            expect(spy.args[0][1]).to.equal(target);

            spy.resetHistory();

            stop();

            ob.set('hello');

            expect(spy.callCount).to.equal(0);
        };
    }

    describe('direct change >> ', () => {
        describe('from scalar >> ', () => {
            it('to scalar', test(true, '', 42));
            it('to object', test(true, '', { foo: 'bar' }));
            it('to array', test(true, '', [42, null, 'test']));
        });

        describe('from object >> ', () => {
            it('to scalar', test(basicObject, '', 42));
            it('to object', test(basicObject, '', { foo: 'bar' }));
            it('to array', test(basicObject, '', [42, null, 'test']));
        });

        describe('from array >> ', () => {
            it('to scalar', test(basicArray, '', 42));
            it('to object', test(basicArray, '', { foo: 'bar' }));
            it('to array', test(basicArray, '', [42, null, 'test']));
        });
    });

    describe('indirect change >>', () => {
        describe('through object change >>', () => {
            describe('from scalar >> ', () => {
                it('to scalar', test(basicObject, 'str', 42));
                it('to object', test(basicObject, 'str', { foo: 'bar' }));
                it('to array', test(basicObject, 'str', [42, null, 'test']));
            });

            describe('from object >> ', () => {
                it('to scalar', test(basicObject, 'obj', 42));
                it('to object', test(basicObject, 'obj', { foo: 'bar' }));
                it('to array', test(basicObject, 'obj', [42, null, 'test']));
            });

            describe('from arrary >> ', () => {
                it('to scalar', test(basicObject, 'arr', 42));
                it('to object', test(basicObject, 'arr', { foo: 'bar' }));
                it('to array', test(basicObject, 'arr', [42, null, 'test']));
            });
        });

        describe('through array change >>', () => {
            describe('from scalar >> ', () => {
                it('to scalar', test(basicArray, '0', 42));
                it('to object', test(basicArray, '0', { foo: 'bar' }));
                it('to array', test(basicArray, '0', [42, null, 'test']));
            });

            describe('from object >> ', () => {
                it('to scalar', test(basicArray, '5', 42));
                it('to object', test(basicArray, '5', { foo: 'bar' }));
                it('to array', test(basicArray, '5', [42, null, 'test']));
            });

            describe('from arrary >> ', () => {
                it('to scalar', test(basicArray, '6', 42));
                it('to object', test(basicArray, '6', { foo: 'bar' }));
                it('to array', test(basicArray, '6', [42, null, 'test']));
            });
        });
    });
});


describe('watch(path, callback) >> ', () => {
    it('scalar', () => {
        const ob = new Observable(basicObject);

        const spy = Sinon.spy();

        const stop = ob.watch('num', spy);

        ob.set('num', 42);

        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal(42);
        expect(spy.args[0][1]).to.equal('');

        spy.resetHistory();

        stop();

        ob.set('num', 'hello');

        expect(spy.callCount).to.equal(0);
    });
});
