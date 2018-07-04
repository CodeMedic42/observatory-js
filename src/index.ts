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
import IsIndex = require('lodash/_isIndex');
import ForEach = require('lodash/forEach');
import IsEqual = require('lodash/isEqual');
import ForOwn = require('lodash/forOwn');
import Clone = require('lodash/clone');
import events = require('events');
import Symbol = require('es6-symbol');

const procSym = Symbol('procSym');

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
            unsub = source.listen('change', (context, value, from) => {
                this.callback(value, from);
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
    private ref: simpleTypes;
    private clean: simpleArray;
    private updateContexts: {};

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
        this.ref = null;
        this.clean = [];
        this.updateContexts = {};

        this.setContent(Symbol('procSym'), value);

        this.changePending = false;
    }

    private send(updateContext: any, value: simpleTypes, from: string, force?: boolean) {
        if (this.isUpdating && !force) {
            return;
        }

        if (this.changePending) {
            this.changePending = false;

            // Deep change
            this.emit('change', updateContext, value, from);
        }
    }

    private linkSource(name, source) {
        const content = this.content[name];
        content.source = source;

        this.value[name] = content.source.value;

        this.changePending = true;

        // The purpose of this listener is to update the source when a child changes.
        let changeListener = (updateContext, value, from) => {
            if (this.updateContexts[updateContext] != null) {
                return;
            }

            this.updateContexts[updateContext] = true;

            this.value[name] = content.source.value;

            this.changePending = true;

            const fromChild = from.length === 0 ? name : `${name}.${from}`;

            this.send(updateContext, this.value, fromChild);

            delete this.updateContexts[updateContext];
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

    private setupObjectItem(updateContext, item, name) {
        let content = this.content[name];

        if (content == null) {
            content = this.content[name] = {};

            let source;

            if (item != null && item.source instanceof Source) {
                source = item.source;
            } else {
                try {
                    if (item != null && item[procSym] != null) {
                        // This is where we handle circular links
                        source = item[procSym];
                    } else {
                        source = new Source(item);
                    }
                } catch (err) {
                    err.message = `${err.message} @ ${name}`;

                    throw err;
                }
            }

            this.linkSource(name, source);
        } else if (item != null) {
            if (item.source instanceof Source) {
                content.source._set(updateContext, item.source);
            } else if (item[procSym] == null) {
                content.source._set(updateContext, item);
            } else if (item[procSym] !== content.source) {
                // This is where we handle circular links
                // We do not want to call set or we will be in a loop
                this.linkSource(name, item[procSym]);
            } else {
                throw new Error('Technically this should never happen');
            }
        } else {
            content.source._set(updateContext, item);
        }
    }

    private setAsObject(updateContext, newData) {
        ForOwn(this.content, (existingItem: any, name) => {
            if (newData[name] != null) {
                return;
            }

            existingItem.disenguage();

            delete this.content[name];
            delete this.value[name];
        });

        ForOwn(newData, (item, name) => {
            this.setupObjectItem(updateContext, item, name);
        });
    }

    private setAsArray(updateContext, newData) {
        const contentArray = this.content as contentArrayType;

        while (contentArray.length > newData.length) {
            contentArray.pop().disenguage();
            (this.value as simpleArray).pop();
        }

        ForOwn(newData, (item, name) => {
            this.setupObjectItem(updateContext, item, name);
        });
    }

    private setAsSimple(newData) {
        if (IsEqual(newData, this.content)) {
            return;
        }

        this.content = newData;
        this.value = newData;
        this.ref = newData;
        this.changePending = true;
    }

    private disengaugeCurrent() {
        if (this.type === 'simple') {
            return;
        }

        ForEach(this.content, (item: any) => {
            item.disenguage();
        });
    }

    private setContent(updateContext, newData) {
        if (IsPlainObject(newData)) {
            if (newData[procSym]) {
                throw new Error('Should not be processing processed data');
            }

            newData[procSym] = this;
            this.clean.push(newData);

            if (this.type !== 'object') {
                this.disengaugeCurrent();

                this.content = {};
                this.value = {};
                this.type = 'object';
                this.ref = undefined;
            }

            this.setAsObject(updateContext, newData);
        } else if (IsArray(newData)) {
            if (newData[procSym]) {
                throw new Error('Should not be processing processed data');
            }

            newData[procSym] = this;
            this.clean.push(newData);

            if (this.type !== 'array') {
                this.disengaugeCurrent();

                this.content = [];
                this.value = [];
                this.type = 'array';
                this.ref = undefined;
            }

            this.setAsArray(updateContext, newData);
        } else if (!IsObject(newData) || IsDate(newData) || newData === null) {
            if (this.type !== 'simple') {
                this.disengaugeCurrent();

                this.content = undefined;
                this.type = 'simple';
                this.value = undefined;
                this.ref = undefined;
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

    private _set(updateContext: any, value: simpleTypes | Source) {
        if (value === this) {
            return;
        }

        this.isUpdating = true;

        const replace = value instanceof Source;
        const newData = replace ? (value as Source).content : value;

        this.setContent(updateContext, newData);

        // emit before replacing to keep incoming controls from firing.
        this.send(updateContext, this.value, '', true);

        if (replace) {
            (value as Source).emit('replace', this);
        }

        this.isUpdating = false;
    }

    private cleanUp() {
        ForEach(this.clean, (item) => {
            delete item[procSym];
        });
    }

    public set(value: simpleTypes, path: string[]): Source {
        const source: Source = this._get(path, true);

        source._set(Symbol('procSym'), value);

        this.cleanUp();

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
        // todo: clean up all created watches when this source is destroyed.
        const watch = new Watch(path, this, callback);

        return () => {
            watch.dispose();
        }
    }

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
}