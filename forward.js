module.exports = function( receiver, props, provider ) {
  props.forEach(function( prop ) {
    var leProvider = receiver[provider];

    if ( typeof leProvider[prop] === 'function' ) {
      receiver[prop] = function() {
        return leProvider[prop].apply( leProvider, arguments );
      }
    }
    else {
      receiver[prop] = function() {
        return leProvider[prop];
      }
    }
  });
};