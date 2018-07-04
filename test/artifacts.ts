import cloneDeep = require('lodash/cloneDeep');
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

const _lev2Obj = buildObject();

const _lev1Obj = buildObject(_lev2Obj, buildArray());

const _basicArray = buildArray(buildObject(), buildArray());

const _basicObject = buildObject(_lev1Obj, _basicArray);

const basicObject = () => {
    return cloneDeep(_basicObject);
};

const basicArray = () => {
    return cloneDeep(_basicArray);
};

function buildCircularObject() {
    const circularObject = cloneDeep(_basicObject);

    circularObject.obj.obj.circ = circularObject;

    return circularObject;
}

export { basicObject, basicArray, buildObject, buildArray, buildCircularObject };