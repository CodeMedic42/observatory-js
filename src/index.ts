import IsArray = require('lodash/isArray');
import IsPlainObject = require('lodash/isPlainObject');
import IsObject = require('lodash/isObject');
import IsDate = require('lodash/isDate');
import IsFinite = require('lodash/isFinite');
import ToPath = require('lodash/toPath');
import IsString = require('lodash/isString');
import IsBoolean = require('lodash/isBoolean');
import StartsWith = require('lodash/startsWith');
import FindIndex = require('lodash/findIndex');
import IsMatch = require('lodash/isMatch');
import Initial = require('lodash/initial');
import Set = require('lodash/set');
import IsIndex = require('lodash/_isIndex');
import ForEach = require('lodash/forEach');
import IsEqual = require('lodash/isEqual');
import ForOwn = require('lodash/forOwn');
import Map = require('lodash/map');
import Reduce = require('lodash/reduce');
import Clone = require('lodash/clone');
import events = require('events');
import FaultLineJs = require('fault-line-js');

type simpleScalar = string | number | boolean | Date;

type simpleTypes = simpleScalar | simpleObject | simpleArray;

interface simpleObject {
    [key: string]: simpleTypes;
}

interface simpleArray extends Array<simpleTypes> { }

interface contentBaseType {
    disenguage: Function,
    source: Source
};

interface contentObjectType {
    [key: string]: contentBaseType;
}

interface contentArrayType extends Array<contentBaseType> { }

type contentType = contentBaseType | contentObjectType | contentArrayType;

class Watch {
    private path = null;
    private callback = null;
    private disposeCallback = null;
    private isDisposed = false;

    constructor(path: string[], source: Source, callback: Function) {
        this.path = Clone(path);
        this.callback = callback;

        this.disposeCallback = this.setup(source, 0);
    }

    private setup(source: Source, nextIndex: number): Function {
        let unsub = null;
        let childUnsub = null;

        if (this.path.length <= nextIndex) {
            unsub = source.listen('change', (...args) => {
                this.callback(...args);
            });
        } else {
            const nextId = this.path[nextIndex];
            let previous = undefined;

            unsub = source.listen('change', (value) => {
                const child = value[nextId];

                if (child === previous) {
                    return;
                }

                if (child !== undefined) {
                    if (previous === undefined) {
                        const childSource = source.get([nextId]);

                        childUnsub = this.setup(childSource, nextIndex + 1);
                    }
                } else {
                    childUnsub();
                    childUnsub = null;

                    this.callback(undefined);
                }
            });

            previous = source.toJS()[nextId];

            if (previous !== undefined) {
                const childSource = source.get([nextId]);

                childUnsub = this.setup(childSource, nextIndex + 1);
            }
        }

        return () => {
            unsub();
            unsub = null;

            if (childUnsub != null) {
                childUnsub();
                childUnsub = null;
            }
        };
    }

    public dispose() {
        if (this.isDisposed) {
            return;
        }

        this.disposeCallback();

        this.disposeCallback = null;
        this.callback == null;
        this.path == null;
        this.isDisposed = true;
    }
}

class Source extends events.EventEmitter {
    private changePending: boolean;
    private isUpdating: boolean;
    private type: string;
    private content: contentType;
    private value: simpleTypes;

    constructor(value: simpleTypes) {
        super();

        if (value !== null &&
            !IsString(value) &&
            !IsFinite(value) &&
            !IsDate(value) &&
            !IsBoolean(value) &&
            !IsArray(value) &&
            !IsPlainObject(value)) {
            throw new Error(`Invalid value: "${value}" cannot be a "${typeof value}"`);
        }

        this.changePending = false;
        this.isUpdating = false;
        this.type = 'simple'
        this.content = null
        this.value = null;

        this.setContent(value);

        this.changePending = false;
    }

    private send(value, from, force?: boolean) {
        if (this.isUpdating && !force) {
            return;
        }

        if (this.changePending) {
            this.changePending = false;

            // Deep change
            this.emit('change', value, from);
        }
    }

    private linkSource(name, source) {
        const content = this.content[name];
        content.source = source;

        this.value[name] = content.source.value;

        this.changePending = true;

        let changeListener = (value, from) => {
            this.value[name] = content.source.value;

            this.changePending = true;

            const fromChild = from.length === 0 ? name : `${name}.${from}`;

            this.send(this.value, fromChild);
        };

        let replaceListener = (replacement) => {
            content.disenguage();

            this.linkSource(name, replacement);
        };

        content.disenguage = () => {
            this.changePending = true;

            content.source.removeListener('change', changeListener);
            content.source.removeListener('replace', replaceListener);

            changeListener = null;
            replaceListener = null;
            content.disenguage = null;
            content.source = null;
        };

        content.source.on('change', changeListener);
        content.source.on('replace', replaceListener);
    }

    private setupObjectItem(item, name) {
        let content = this.content[name];

        if (content == null) {
            content = this.content[name] = {};

            let source;

            if (item != null && item.source instanceof Source) {
                source = item.source;
            } else {
                try {
                    source = new Source(item);
                } catch (err) {
                    err.message = `${err.message} @ ${name}`;

                    throw err;
                }
            }

            this.linkSource(name, source);
        } else {
            const updateWith = item != null && item.source instanceof Source ? item.source : item;

            content.source._set(updateWith);
        }
    }

    private setAsObject(newData) {
        ForOwn(this.content, (existingItem, name) => {
            if (newData[name] != null) {
                return;
            }

            existingItem.disenguage();

            delete this.content[name];
            delete this.value[name];
        });

        ForOwn(newData, (item, name) => {
            this.setupObjectItem(item, name);
        });
    }

    private setAsArray(newData) {
        const contentArray = this.content as contentArrayType;

        while (contentArray.length > newData.length) {
            contentArray.pop().disenguage();
            (this.value as simpleArray).pop();
        }

        ForOwn(newData, (item, name) => {
            this.setupObjectItem(item, name);
        });
    }

    private setAsSimple(newData) {
        if (IsEqual(newData, this.content)) {
            return;
        }

        this.content = newData;
        this.value = newData;
        this.changePending = true;
    }

    private disengaugeCurrent() {
        if (this.type === 'simple') {
            return;
        }

        ForEach(this.content, (item) => {
            item.disenguage();
        });
    }

    private setContent(newData) {
        if (IsPlainObject(newData)) {
            if (this.type !== 'object') {
                this.disengaugeCurrent();

                this.content = {};
                this.value = {};
                this.type = 'object';
            }

            this.setAsObject(newData);
        } else if (IsArray(newData)) {
            if (this.type !== 'array') {
                this.disengaugeCurrent();

                this.content = [];
                this.value = [];
                this.type = 'array';
            }

            this.setAsArray(newData);
        } else if (!IsObject(newData) || IsDate(newData) || newData === null) {
            if (this.type !== 'simple') {
                this.disengaugeCurrent();

                this.type = 'simple';
            }

            this.setAsSimple(newData);
        } else {
            throw new Error('Did not exepct this object.');
        }
    }

    private _get(pathArr: string[], create = false): Source {
        if (pathArr.length <= 0) {
            return this;
        }

        const length = pathArr.length;
        let index: number = -1;
        let current: Source = this;

        // eslint-disable-next-line no-plusplus
        while (++index < length) {
            let next: contentBaseType = null;
            let target: string | number = pathArr[index];

            const isLookup: boolean = StartsWith(target, '{');
            let lookup: object = null;

            if (isLookup) {
                lookup = JSON.parse(target);

                const foundIndex: number = FindIndex(current.value as any, (item) => {
                    return IsMatch(item, lookup);
                });

                next = current.content[foundIndex];
            } else {
                next = current.content[target];
            }

            if (next == null) {
                if (create !== true) {
                    current = null;

                    break;
                }

                let newPart: any = null;

                if (isLookup) {
                    newPart = lookup;
                    target = (current.content as contentArrayType).length;
                } else {
                    newPart = IsIndex(pathArr[index + 1]) || StartsWith(pathArr[index + 1], '{') ? [] : {};
                }

                current = current.set([target], newPart);
            } else {
                current = next.source;
            }
        }

        return current;
    }

    private _set(value: simpleTypes | Source) {
        if (value === this) {
            return;
        }

        this.isUpdating = true;

        const replace = value instanceof Source;
        const newData = replace ? (value as Source).content : value;

        this.setContent(newData);

        // emit before replacing to keep incoming controls from firing.
        this.send(this.value, '', true);

        if (replace) {
            (value as Source).emit('replace', this);
        }

        this.isUpdating = false;
    }

    public set(value: simpleTypes, path: string[]): Source {
        const source: Source = this._get(path, true);

        source._set(value);

        return source;
    }

    public get(path: string[]): Source {
        return this._get(path);
    }

    public listen(to, callback) {
        this.on(to, callback);

        return () => {
            this.removeListener(to, callback);
        };
    }

    public watch(path: string[], callback: Function): () => void {
        // todo: clean up all created watches when this source is destroied.
        const watch = new Watch(path, this, callback);

        return () => {
            watch.dispose();
        }
    }

    /*
    public watch2(path: string[], callback: Function): Function {
        const ownPath = Clone(path);

        const setWatch = (source: Source, nextIndex: number): Function => {
            let unsub = null;
            let childUnsub = null;

            if (ownPath.length <= nextIndex) {
                unsub = source._watch(callback);
            } else {
                const nextId = ownPath[nextIndex];
                let previous = undefined;

                unsub = source._watch((value) => {
                    const child = value[nextId];

                    if (child === previous) {
                        return;
                    }

                    if (child !== undefined) {
                        const childSource = source.get([nextId]);

                        childUnsub = setWatch(childSource, nextIndex + 1);
                    } else {
                        childUnsub();
                        childUnsub = null;
                    }
                });

                previous = source.value[nextId];

                if (previous !== undefined) {
                    const childSource = source.get([nextId]);

                    childUnsub = setWatch(childSource, nextIndex + 1);
                }
            }

            return () => {
                unsub();
                unsub = null;

                if (childUnsub != null) {
                    childUnsub();
                    childUnsub = null;
                }
            };
        };

        return setWatch(this, 0);
    }
    */

    public toJS(): simpleTypes {
        return this.value;
    }
}

export default class Observable {
    private source: Source;

    constructor(source: simpleTypes | Source) {
        if (source instanceof Source) {
            this.source = source;
        } else {
            try {
                this.source = new Source(source);
            } catch (err) {
                throw err;
            }
        }

        this.source.on('unbind', () => { });
    }

    private _get(path: string | string[] = []): Source {
        if (path == null) {
            throw new Error('Observable.get requires a string or string[] if a value is provided');
        }

        const pathArr: string[] = typeof path === "string" ? ToPath(path) : path;

        return this.source.get(pathArr);
    }

    public watch(callback: Function): () => void;
    public watch(path: string | string[], callback: Function): () => void;
    public watch(pathOrCallback: string | string[] | Function, callback?: Function): () => void {
        let cb: Function = callback;
        let path: string[] = null;

        if (typeof pathOrCallback === 'string') {
            path = ToPath(pathOrCallback);
        } else if (pathOrCallback instanceof Array) {
            path = pathOrCallback;
        } else {
            cb = pathOrCallback;
            path = [];
        }

        return this.source.watch(path, cb);
    }

    public set(value: simpleTypes): Observable
    public set(path: string | string[], value: simpleTypes): Observable
    public set(valueOrPath: simpleTypes, value?: simpleTypes): Observable {
        let val: simpleTypes;
        let path: string[];

        if (arguments.length > 1) {
            val = value;

            if (valueOrPath != null) {
                path = typeof valueOrPath === 'string' ? ToPath(valueOrPath as string) : valueOrPath as string[];
            } else {
                throw new Error('Observable.set requires a string or string[] if a value is provided');
            }

        } else {
            val = valueOrPath;
            path = []
        }

        const source = this.source.set(val, path);

        return new Observable(source);
    }

    public get(path?: string | string[]): Observable {
        const source: Source = this._get(path);

        return new Observable(source);
    }

    public toJS(path?: string | string[]): simpleTypes {
        const source: Source = this._get(path);

        return source.toJS();
    }

    /*

    public push(value: any) {

    }

    public manipulate(manipulator: (input: any) => any): Observable {
        const current: any = this.toJS();

        const result: any = manipulator(current);

        return this.set(current);
    }
    */
}