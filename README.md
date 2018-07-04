# Observatory-JS

Observatory-JS is a Javascript library which atempts to provide a simple and easy to use API for watching data changes. Being able to respond to changes in your data allows for a more robust system. This library is an attempt to solve a few issues which I feel have not been answered well.

1. I want to be able to use any structure of data I want.
    - This generally means one minute I am observing an object and the next an array. No type checking. There is a limit in this library to simple objects, arrays, and scalar values, ... for now.
2. I want to be able to observe the changes to data from any particular point.
    - Basiclly if I have a complex tree of data I want to be able to observe the changes of a child from the viewpoint of another child who is at least parent to the first. We will see examples of this later.
3. CIRCULAR REFERENCES
    - When creating an observable and setting data I want reference structrure to be maintained. Yes circular references are gennerally bad. I am hard pressed to to really think of a use case where this is ok or possibly expected. But who am I to COMPLETELY say one does not exist. Plus it's a good challenge. Also I would have to check for it anyway or try to prevent it. Why write code to stop something when you can roll with it. FEATURE! Oh and yes events do not circle.

## Development in this project

If you want to build this repo or run tests just install the packages _(one time only)_

```bash
npm install
```

If you want to build...

```bash
npm run build
```

If you want to test...

```bash
npm run test
```

## Development with this project

### Installation

To use this library just run

```bash
npm install observatory-js --save
```

... or yarn or whatever you prefer of course.

### Usage

To use this library you only need to import a simple class

```js
// es 6
import Observable from 'observatory-js';

// es 5
var Observable = require('observatory-js');
```

The rest of this read me are some common examples of usage. 

## Examples

Here is exampe data which will be used to illustrate the following examples.
```js
const manager = {
    person: {
        firstName: 'John',
        lastName: 'Doe',
        level: 1
    },
    directs: [{
        firstName: 'Steve',
        lastName: 'Smith',
        level: 3
    }, {
        firstName: 'Jennifer',
        lastName: 'Talos',
        level: 2
    }]
};

const observed = new Observable(manager);
```

#### Setting a Value

Setting a new value is easy. 

Here are a few examples of updating the root value.

```js
observed.set(42); // This is short hand for observed.set('', 42);
observed.set('New Value');
observed.set(true);
observed.set(new Date());
observed.set({});
observed.set([]);
```

Here are a few examples of updating a sub value.

```js
observed.set('directs.0.firstName', 42);
observed.set('directs.0.firstName', 'New Value');
observed.set('directs.0.firstName', true);
observed.set('directs.0.firstName', new Date());
observed.set('directs.0.firstName', {});
observed.set('directs.0.firstName', []);
```

#### Getting a Value

Getting an existing value is also very easy. When any value is returned it is returned in another Observable object.

Here is an example of getting the root value.

```js
const newObserved = observed.get(); // This is short hand for observed.get('');

// newObserved !== observed;
// This is useful if you want a quick new version of the Observable.
```

Her are some examples of getting subValues.

```js
const observedPerson = observed.get('person');
const observedFirstName = observed.get('person.firstName');
const observedDirectFirstNameA = observed.get('directs.0.firstName');
const observedDirectFirstNameB = observed.get('directs.0.firstName');

// observedDirectFirstNameA !== observedDirectFirstNameB
```
#### toJS

Ok so you know how to set a value and get a value. But those only deal in Observable objects.

How in the heck to you get the actual value?

```js
const actualValue = observed.toJS(); // This is shorthand for observed.toJS('');
// AND!
const actualPersonValue = observed.toJS('person');
```

Please not that changing the data returned from toJS will NOT reflect back into the observable and will NOT result in events being called.
Conversly after getting data from toJS and the calling observable.set(...) will not update the data you already have. You will have to call toJS again. I am cloning inside to prevent this. Sorry.

#### Watching

##### Simple callback and change

```js
// This is shorthand for observed.watch('', () => {});
// disposeWatch is a function. Calling it, disposeWatch(), will dispose of the watch.
const disposeWatch = observed.watch((newValue, changedPath) => {
    // newValue: This is a result of the change and is exactly what is being observed, which in this case is manager.
    //      - This is NOT an observable. Any changes to this data will NOT reflect in 
    //              what is managed by the observable and will NOT result in additional events being fired.
    // changedPath: This a dot notated path to the item that chaged.
});

// When the watch callback is called 
//      - the first argument will be the value being passed to set
//      - the second argument will be an empty string since the path that changed was the root.
observed.set(42);

// When the watch callback is called 
//      - the first argument will be the manager value after the change has been made
//      - the second argument will be 'directs.0.firstName'. This is the value has caused the callback to happen.
observed.set('directs.0.firstName', 42);

```

##### Pathed callback

```js
// This will watch from the perspective of the directs property
const disposeWatch = observed.watch('directs', (newValue, changedPath) => {});

// When the watch callback is called 
//      - the first argument will be the manager.directs value after the change has been made
//      - the second argument will be '0.firstName'. This is the value has caused the callback to happen.
observed.set('directs.0.firstName', 42);
```

