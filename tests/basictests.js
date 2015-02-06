/**
 *
 * Created by andy on 1/28/15.
 */
module("Basic Tests");

test("truthy", function() {
  ok(true, "true is truthy");
  equal(1, true, "1 is truthy");
  notEqual(0, true, "0 is NOT truthy");
});

test( "tests doubleMultiplier function", function() {
  equal( doubleMultiplier( 1 ), 2, "1 * 2 = 2")
  equal( doubleMultiplier( 2 ), 4, "2 * 2 = 4")
  equal( doubleMultiplier( 3 ), 6, "3 * 2 = 6")
});

test( "keylogger api behavior", function( assert ) {
  var doc = $( document ),
          keys = new KeyLogger( doc );

  // Trigger the key event
  doc.trigger( $.Event( "keydown", { keyCode: 9 } ) );

  // Verify expected behavior
  deepEqual( keys.log, [ 9 ], "correct key was logged" );
});

