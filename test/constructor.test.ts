import Chai = require('chai');

import Observable from '../src/index';

import { basicObject, basicArray, buildCircularObject } from './artifacts';

const expect = Chai.expect;

describe('Constructor(value: any) >> ', () => {
  describe('Valid data >> ', () => {
    it('null', () => {
      const ob = new Observable(null);

      expect(ob.toJS()).to.equal(null);
    });

    it('number', () => {
      const ob = new Observable(42);

      expect(ob.toJS()).to.equal(42);
    });

    it('string', () => {
      const ob = new Observable('foo');

      expect(ob.toJS()).to.equal('foo');
    });

    it('object', () => {
      const inital = basicObject();
      const ob = new Observable(inital);

      expect(ob.toJS()).to.deep.equal(inital);
    });

    it('array', () => {
      const inital = basicArray();
      const ob = new Observable(inital);

      expect(ob.toJS()).to.deep.equal(inital);
    });
  });

  describe('Invalid data >> ', () => {
    describe('undefined >> ', () => {
      it('at root', () => {
        const t = undefined;

        expect(() => {
          new Observable(t);
        }).to.throw('Invalid value: "undefined" cannot be a "undefined"');
      });

      it('in object', () => {
        const t = {
          foo: undefined
        };

        expect(() => {
          try {
            new Observable(t);
          } catch (err) {
            throw err;
          }
        }).to.throw('Invalid value: "undefined" cannot be a "undefined" @ foo');
      });

      it('in array', () => {
        const t = [
          0,
          undefined,
          2
        ];

        expect(() => {
          try {
            new Observable(t);
          } catch (err) {
            throw err;
          }
        }).to.throw('Invalid value: "undefined" cannot be a "undefined" @ 1');
      });
    });

    describe('Function >> ', () => {
      it('at root', () => {
        const t: any = () => { };

        expect(() => {
          new Observable(t);
        }).to.throw('Invalid value: "() => { }" cannot be a "function"');
      });

      it('in object', () => {
        const t: any = {
          foo: () => { }
        };

        expect(() => {
          try {
            new Observable(t);
          } catch (err) {
            throw err;
          }
        }).to.throw('Invalid value: "() => { }" cannot be a "function" @ foo');
      });

      it('in array', () => {
        const t: any = [
          0,
          () => { },
          2
        ];

        expect(() => {
          try {
            new Observable(t);
          } catch (err) {
            throw err;
          }
        }).to.throw('Invalid value: "() => { }" cannot be a "function" @ 1');
      });
    });
  });

  describe('Circular data >> ', () => {
    it('object', () => {
      const inital = buildCircularObject();

      const ob = new Observable(inital);

      const value: any = ob.toJS();

      expect(value.obj.obj.circ === value).to.be.true;
    });
  })
});