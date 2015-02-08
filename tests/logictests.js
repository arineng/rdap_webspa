/*
 * Copyright (c) 2015. Red Squirrel One
 */

/**
 * Tests the functions in logic.js
 * Created by andy on 1/28/15.
 */
module("Logic Tests");

test("getQueryType tests", function() {
  equal( getQueryType( "192.149.136.136" ), QUERYTYPE.IP4, "is IP4" );
  equal( getQueryType( "1.0.0.0" ), QUERYTYPE.IP4, "is IP4" );
  equal( getQueryType( "199.0.0.0" ), QUERYTYPE.IP4, "is IP4" );
  equal( getQueryType( "255.255.255.255" ), QUERYTYPE.IP4, "is IP4" );
  equal( getQueryType( "2001:500:13::" ), QUERYTYPE.IP6, "is IP6" );
  equal( getQueryType( "2001:500:13:FFFF:FFFF:FFFF:FFFF:FFFF" ), QUERYTYPE.IP6, "is IP6" );
});


