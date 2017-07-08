import EventEmitter from 'eventemitter3';
import Util from 'util';
import _ from 'lodash';
import Symbol from 'es6-symbol';
import ControlLoader from './control';

let _Observable;
let _unlinkControl;
let _linkControl;
let _Control;

const FIELDS = {
    status: Symbol('status'),
    control: Symbol('control'),
    listener: Symbol('listener')
};

function emitChange() {
    if (this[FIELDS.status] !== 'running') {
        return;
    }

    this.emit('change:deep');
}

function emitUpdate() {
    if (this[FIELDS.status] !== 'running') {
        return;
    }

    this.emit('change:shallow');
}

function emitReplace(replacement) {
    _unlinkControl.call(this);

    _linkControl.call(this, replacement);
}

_linkControl = function linkControl(control) {
    this[FIELDS.control] = control;

    control.on('change:deep', emitChange, this);
    control.on('replace', emitReplace, this);
    control.on('change:shallow', emitUpdate, this);

    this[FIELDS.listener] = () => {
        control.removeListener('change:deep', emitChange, this);
        control.removeListener('replace', emitReplace, this);
        control.removeListener('change:shallow', emitUpdate, this);

        this[FIELDS.control] = null;
        this[FIELDS.listener] = null;

        return control;
    };
};

_unlinkControl = function unlinkControl() {
    if (!_.isNil(this[FIELDS.listener])) {
        return this[FIELDS.listener]();
    }

    return null;
};

function _buildControl(item) {
    let control;

    if (item instanceof _Observable) {
        if (item.isDisposed()) {
            throw new Error('This observable has already been disposed.');
        }

        control = item[FIELDS.control];
    } else if (item instanceof _Control) {
        control = item;
    } else {
        control = _Control(item);
    }

    _linkControl.call(this, control);
}

_Observable = function Observable(...args) {
    if (!(this instanceof _Observable)) {
        return new _Observable(...args);
    }

    EventEmitter.call(this);

    this[FIELDS.status] = 'running';

    _buildControl.call(this, args[0]);
};

_Control = ControlLoader(_Observable, FIELDS.control);

Util.inherits(_Observable, EventEmitter);

_Observable.prototype.value = function value() {
    return this[FIELDS.control]._value;
};

_Observable.prototype.get = function get(id) {
    if (this.isDisposed()) {
        throw new Error('This object has been disposed');
    }

    if (_.isNil(id) || id === '') {
        return this;
    } else if (_.isString(id)) {
        const target = this[FIELDS.control].get(id);

        if (_.isNil(target)) {
            return target;
        }

        return _Observable(target);
    }

    throw new Error('Invalid Id');
};

_Observable.prototype.set = function set(...args) {
    if (this.isDisposed()) {
        throw new Error('This object has been disposed');
    }

    let id;
    let value;

    if (args.length <= 0) {
        return;
    } else if (args.length === 1) {
        value = args[0];
    } else {
        id = args[0];
        value = args[1];
    }

    if (value instanceof _Observable) {
        value = value[FIELDS.control];
    }

    this[FIELDS.control].set(id, value);
};

_Observable.prototype.delete = function delete_(id) {
    if (this.isDisposed()) {
        throw new Error('This object has been disposed');
    }

    this[FIELDS.control].delete(id);
};

_Observable.prototype.remove = function remove(cb) {
    if (this.isDisposed()) {
        throw new Error('This object has been disposed');
    }

    this[FIELDS.control].remove(cb);
};

_Observable.prototype.dispose = function dispose() {
    if (this.isDisposed()) {
        return;
    }

    _unlinkControl.call(this);

    this[FIELDS.status] = 'disposed';
};

_Observable.prototype.isDisposed = function isDisposed() {
    return this[FIELDS.status] === 'disposed';
};

_Observable.prototype.pause = function pause() {
    if (this.isDisposed()) {
        throw new Error('This object has been disposed');
    }

    this[FIELDS.status] = 'paused';
};

_Observable.prototype.run = function run() {
    if (this.isDisposed()) {
        throw new Error('This object has been disposed');
    }

    this[FIELDS.status] = 'running';
};

_Observable.prototype.push = function push(value) {
    if (this.isDisposed()) {
        throw new Error('This object has been disposed');
    }

    this[FIELDS.control].push(value);
};

const Observable = _Observable;

export default Observable;
