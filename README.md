# forward-props
Forward a list of properties to providers for an object on the fly (late-binding). The main usage is to have an object that provides an interface to its internal object and lets them handle the details of each of the methods. This is really useful when you want an object to behave like very disparate objects, yet don't want to mix those into one object with mixins or inheritance.


### Install
```sh
$ npm install forward-props
```

### Usage
```js
var forward = require( 'forward-props' );

// calculator interface
var calc = Object.create( null );

// internal addition module
var _addition = {
  add: function(a,b) { return a + b },
  sum: function( _args ) {
    var args = __slice.call( arguments, 0 );
    return args.reduce( this.add, 0 );
  }
};

// internal multiplication module
var _multiplication = {
  multiply: function( a, b ) { return a * b },
  product: function( _args ) {
    var args = __slice.call( arguments, 0 );
    return args.reduce( this.multiply, 1 );
  }
};

// provide calc with addition properties
forward( calc, ['add', 'sum'], _addition );

// a little multiplication wouldn't hurt
forward( calc, ['multiply', 'product'], _multiplication );

calc.sum(1,2,3,4,5);      // 15
calc.product(1,2,3,4,5);  // 120
```