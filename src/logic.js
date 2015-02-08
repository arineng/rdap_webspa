/*
 * Copyright (c) 2015. American Registry for Internet Numbers
 */

/**
 * This file contains functions for logic that is testable separate from page manipulation.
 * Created by anewton on 2/7/15.
 */

/*
 * This is the Base URL of the location where queries will be sent.
 * Always make sure it ends in a '/' character.
 */
BASEURL = "http://rdap-pilot.arin.net/rdapbootstrap/";

/*
 * This is an object that describes the query terms.
 * Each member of the object is an object, each with
 * the following members:
 *   description - a string describing the term
 *   match - a function that returns true if the queryterm is a match
 *   url - a function that returns the URL for the queryterm
 */
QUERYTYPE = {
  IP4 : {
    description : "an IPv4 Address",
    match : function ( queryterm ) {
      // IPv4 and IPv6 regular expressions are credited to Mike Poulson and are found here:
      //   http://blogs.msdn.com/b/mpoulson/archive/2005/01/10/350037.aspx
      return queryterm.match(/^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/);
    },
    url : function ( queryterm ) {
      return BASEURL + "ip/" + queryterm.trim();
    }
  },
  IP6 : {
    description : "an IPv6 Address",
    match : function ( queryterm ) {
      if( queryterm.match( /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/ ) ) {
        return true;
      } else if( queryterm.match( /^((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)::((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)$/) ) {
        return true;
      }
      //else
      return false;
    },
    url : function ( queryterm ) {
      return BASEURL + "ip/" + queryterm.trim();
    }
  },
  CIDR4 : {
    descritpion : "an IPv4 Network",
    match : function ( queryterm ) {
      return false;
    },
    url : function ( queryterm ) {
      return BASEURL + "ip/" + queryterm.trim();
    }
  },
  CIDR6 : {
    description : "an IPv6 Network",
    match : function ( queryterm ) {
      return false;
    },
    url : function ( queryterm ) {
      return BASEURL;
    }
  },
  AUTNUM : {
    description : "an Autonomous System Number",
    match : function ( queryterm ) {
      return false;
    },
    url : function ( queryterm ) {
      return BASEURL;
    }
  },
  NS : {
    description : "a Nameserver",
    match : function ( queryterm ) {
      return false;
    },
    url : function ( queryterm ) {
      return BASEURL;
    }
  },
  DOMAIN : {
    description : "a Domain Name",
    match : function ( queryterm ) {
      return false;
    },
    url : function ( queryterm ) {
      return BASEURL;
    }
  },
  RDOMAIN : {
    description : "a Reverse DNS Delegation",
    match : function ( queryterm ) {
      return false;
    },
    url : function ( queryterm ) {
      return BASEURL;
    }
  },
  ENTITY : {
    description : "an Entity",
    match : function ( queryterm ) {
      return false;
    },
    url : function ( queryterm ) {
      return BASEURL;
    }
  }
};

function getQueryType( queryterm ) {
  var qtObj;
  $.each( QUERYTYPE, function(key, value) {
    if( value.match( queryterm ) )
    {
      qtObj = value;
      return false;
    }
    //else, i.e. keep iterating
    return true;
  });
  return qtObj;
}


