import Sinon = require('sinon');
import _ = require('lodash');
import randomize = require('randomatic');
import seedrandom = require('seedrandom');

type objType = {
    str: string,
    num: number,
    bool: boolean,
    date: Date,
    nullValue: any,
    obj?: any,
    arr?: any
};

function buildObject(obj?: any, arr?: any[]): objType {
    const str: string = randomize('*', 10, null);
    const num: number = seedrandom(str)();
    const bool: boolean = (num % 2) === 0;

    const val: objType = {
        str,
        num,
        bool,
        date: new Date(),
        nullValue: null
    }

    if (obj != null) {
        val.obj = obj;
    }

    if (arr != null) {
        val.arr = arr;
    }

    return val;
}

function buildArray(obj?: any, arr?: any[]) {
    const str: string = randomize('*', 10, null);
    const num: number = seedrandom(str)();
    const bool: boolean = (num % 2) === 0;

    const val: any = [
        str,
        num,
        bool,
        new Date(),
        null
    ];

    if (obj != null) {
        val.push(obj);
    }

    if (arr != null) {
        val.push(arr);
    }

    return val;
}

const lev2Obj = buildObject();

const lev1Obj = buildObject(lev2Obj, buildArray());

const basicArray = buildArray(buildObject(), buildArray());

const basicObject = buildObject(lev1Obj, basicArray);

function createOnChangeSpy(targetOb) {
    targetOb.on();

    const spy = Sinon.spy();

    targetOb.on('change', spy);

    return spy;
}

export { basicObject, basicArray };