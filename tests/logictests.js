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
  equal( getQueryType( "192.149.136.136/28" ), QUERYTYPE.CIDR4, "is CIDR4" );
  equal( getQueryType( "192.149.136.136/32" ), QUERYTYPE.CIDR4, "is CIDR4" );
  equal( getQueryType( "192.149.136.136/16" ), QUERYTYPE.CIDR4, "is CIDR4" );
  equal( getQueryType( "192.149.136.136/8" ), QUERYTYPE.CIDR4, "is CIDR4" );
  equal( getQueryType( "192.149.136.136 /8" ), QUERYTYPE.CIDR4, "is CIDR4" );
  equal( getQueryType( "192.149.136.136/ 8" ), QUERYTYPE.CIDR4, "is CIDR4" );
  equal( getQueryType( "2001:500:13::/128" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13::/118" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13::/108" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13::/98" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13::/9" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13:FFFF:FFFF:FFFF:FFFF:FFFF/128" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13:FFFF:FFFF:FFFF:FFFF:FFFF/118" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13:FFFF:FFFF:FFFF:FFFF:FFFF/108" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13:FFFF:FFFF:FFFF:FFFF:FFFF/98" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13:FFFF:FFFF:FFFF:FFFF:FFFF/8" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13:FFFF:FFFF:FFFF:FFFF:FFFF /8" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "2001:500:13:FFFF:FFFF:FFFF:FFFF:FFFF / 8" ), QUERYTYPE.CIDR6, "is CIDR6" );
  equal( getQueryType( "10204" ), QUERYTYPE.AUTNUM, "is AUTNUM" );
  equal( getQueryType( "as10204" ), QUERYTYPE.AUTNUM, "is AUTNUM" );
  equal( getQueryType( "As10204" ), QUERYTYPE.AUTNUM, "is AUTNUM" );
  equal( getQueryType( "AS10204" ), QUERYTYPE.AUTNUM, "is AUTNUM" );
});

test("queryTest URL tests", function() {
  equal( QUERYTYPE.IP4.url( "192.149.136.136" ), BASEURL + "ip/192.149.136.136", "IP4 query URL" );
  equal( QUERYTYPE.IP6.url( "2001:500:13::" ), BASEURL + "ip/2001:500:13::", "IP6 query URL" );
  equal( QUERYTYPE.CIDR4.url( "192.149.136.136/32" ), BASEURL + "ip/192.149.136.136/32", "CIDR4 query URL" );
  equal( QUERYTYPE.CIDR4.url( "192.149.136.136 /32" ), BASEURL + "ip/192.149.136.136/32", "CIDR4 query URL" );
  equal( QUERYTYPE.CIDR4.url( "192.149.136.136/ 32" ), BASEURL + "ip/192.149.136.136/32", "CIDR4 query URL" );
  equal( QUERYTYPE.CIDR6.url( "2001:500:13::/ 32" ), BASEURL + "ip/2001:500:13::/32", "CIDR6 query URL" );
  equal( QUERYTYPE.CIDR6.url( "2001:500:13:: / 32" ), BASEURL + "ip/2001:500:13::/32", "CIDR6 query URL" );
  equal( QUERYTYPE.AUTNUM.url( "10204" ), BASEURL + "autnum/10204", "AUTNUM query URL" );
  equal( QUERYTYPE.AUTNUM.url( "as10204" ), BASEURL + "autnum/10204", "AUTNUM query URL" );
  equal( QUERYTYPE.AUTNUM.url( "As10204" ), BASEURL + "autnum/10204", "AUTNUM query URL" );
  equal( QUERYTYPE.AUTNUM.url( "AS10204" ), BASEURL + "autnum/10204", "AUTNUM query URL" );
});

test("QUERYTYPEs have descriptions", function() {
  ok( QUERYTYPE.IP4.description, "IP4 description")
  ok( QUERYTYPE.IP6.description, "IP6 description")
  ok( QUERYTYPE.CIDR4.description, "CIDR4 description")
  ok( QUERYTYPE.CIDR6.description, "CIDR6 description")
  ok( QUERYTYPE.AUTNUM.description, "AUTNUM description")
});

test("Convert Class to ID" , function() {
  var target = $( '#testConvertClassToID' );
  convertClassToId( target );
  ok( target.find( '#cute' ).length == 1 );
  ok( target.find( '#veryCute' ).length == 1 );
  ok( target.find( '#evenCuter' ).length == 1 );
  ok( target.find( '#notCute' ).length == 0 );
  ok( target.find( '#notCuteAtAll' ).length == 0 );
});

