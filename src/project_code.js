
/*
 A simple function that multiplies the input by 2
 */
function doubleMultiplier( multiplicand ) {
  return multiplicand * 2;
}

function KeyLogger( target ) {
  this.target = target;
  this.log = [];

  var that = this;
  this.target.off( "keydown" ).on( "keydown", function( event ) {
    that.log.push( event.keyCode );
  });
}

