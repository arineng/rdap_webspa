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

test("queryTest URL tests", function() {
  equal( QUERYTYPE.IP4.url( "192.149.136.136" ), BASEURL + "ip/192.149.136.136", "IP4 query URL" );
  equal( QUERYTYPE.IP6.url( "2001:500:13::" ), BASEURL + "ip/2001:500:13::", "IP6 query URL" );
});

