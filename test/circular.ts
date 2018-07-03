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

xdescribe('watch(Function) >> ', () => {
    it('to scalar >> ', () => {
        const c = {
            a: {
                b: {
                    c: null
                }
            }
        };

        c.a.b.c = c;
        const a = c.a;
        const b = a.b;

        set(a, '', {

        });
    });
});