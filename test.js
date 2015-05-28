var assert = require( 'assert' );
var forward = require( './forward' );

describe( 'forward( receiver, methods, provider )', function() {
  var calc;

  before(function() {
    var __slice = [].slice;
    calc = {
      _addition: {
        add: function(a,b) { return a + b },
        sum: function( _args ) {
          var args = __slice.call( arguments, 0 );
          return args.reduce( this.add, 0 );
        }
      },

      _multiplication: {
        multiply: function( a, b ) { return a * b },
        product: function( _args ) {
          var args = __slice.call( arguments, 0 );
          return args.reduce( this.multiply, 1 );
        }
      },

      _counter: []
    };
  });

  it( 'passes properties to the provider', function() {
    assert.equal( calc.add, undefined );

    forward( calc, ['add', 'sum'], '_addition' );

    assert.equal( calc.add( 10, 10 ), 20 );
    assert.equal( calc.sum( 1,2,3,4,5 ), 15 );
  });

  it( 'transforms properties into dynamic methods', function() {
    assert.strictEqual( calc.length, undefined );

    forward( calc, ['length'], '_counter' );

    assert.strictEqual( calc.length(), 0 );
    calc._counter.push( 2 );
    assert.strictEqual( calc.length(), 1 );
  });
});