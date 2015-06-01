var assert = require( 'assert' );
var forward = require( './index' );

describe( 'forward( receiver, methods, provider )', function() {
  var calc;
  var _multiplication;

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

      _counter: []
    };

    _multiplication = {
      multiply: function( a, b ) { return a * b },
      product: function( _args ) {
        var args = __slice.call( arguments, 0 );
        return args.reduce( this.multiply, 1 );
      }
    };
  });

  describe( 'when given a string as the provider', function() {

    it( 'passes properties to the provider', function() {
      assert.equal( calc.add, undefined );

      forward( calc, ['add', 'sum'], '_addition' );

      assert.equal( calc.add( 10, 10 ), 20 );
      assert.equal( calc.sum( 1,2,3,4,5 ), 15 );
    });

    it( 'defers calls until calltime', function() {
      // This means that we can dynamically switch out implementations
      var Bob = {
        mouth: {
          sayHi: function() { return 'Howdy'; }
        }
      };

      var anotherMouth = {
        sayHi: function() { return 'Hello there!'; }
      };

      forward( Bob, ['sayHi'], 'mouth' );
      assert.equal( Bob.sayHi(), 'Howdy' );

      // Switch mouths
      Bob.mouth = anotherMouth;
      assert.equal( Bob.sayHi(), 'Hello there!' );
    });
  });

  it( 'transforms properties into dynamic methods', function() {
    assert.strictEqual( calc.length, undefined );

    forward( calc, ['length'], '_counter' );

    assert.strictEqual( calc.length(), 0 );
    calc._counter.push( 2 );
    assert.strictEqual( calc.length(), 1 );
  });

  it( 'throws when properties don\'t exist' );

  describe( 'when given an object as a provider', function() {

    it( 'forwards props to the object', function() {
      forward( calc, ['multiply', 'product'], _multiplication );

      assert.equal( calc.multiply(5, 5), 25 );
      assert.equal( calc.product(1,2,3,4,5), 120 );
    });

  });
});