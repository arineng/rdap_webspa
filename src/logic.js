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
BASEURL = "http://rdap.apnic.net/";

// IPv4 and IPv6 regular expressions are credited to Mike Poulson and are found here:
//   http://blogs.msdn.com/b/mpoulson/archive/2005/01/10/350037.aspx
IPV4_REGEX = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
IPV6_REGEX = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
IPV6_HEXCOMPRESS_REGEX = /^((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)::((?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4})*)?)$/;

CIDR4_LENGTH_REGEX = /^3[0-2]|[0-2]?\d$/;
CIDR6_LENGTH_REGEX = /^12[0-8]|1[0-1]\d|\d?\d$/;

AUTNUM_REGEX = /((a|A)(s|S))?[0-9]{1,10}/;

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
      return IPV4_REGEX.test( queryterm );
    },
    url : function ( queryterm ) {
      return BASEURL + "ip/" + queryterm;
    }
  },
  IP6 : {
    description : "an IPv6 Address",
    match : function ( queryterm ) {
      // IPv4 and IPv6 regular expressions are credited to Mike Poulson and are found here:
      //   http://blogs.msdn.com/b/mpoulson/archive/2005/01/10/350037.aspx
      if( IPV6_REGEX.test( queryterm ) ) {
        return true;
      } else if( IPV6_HEXCOMPRESS_REGEX.test( queryterm ) ) {
        return true;
      }
      //else
      return false;
    },
    url : function ( queryterm ) {
      return BASEURL + "ip/" + queryterm;
    }
  },
  CIDR4 : {
    description : "an IPv4 Network",
    match : function ( queryterm ) {
      var parts = queryterm.split( "/" );
      if( parts.length == 2 &&
          IPV4_REGEX.test(parts[0].trim()) &&
          CIDR4_LENGTH_REGEX.test(parts[1].trim()) ) {
        return true;
      }
      //else
      return false;
    },
    url : function ( queryterm ) {
      var parts = queryterm.split( "/" );
      return BASEURL + "ip/" + parts[0].trim() + "/" + parts[1].trim();
    }
  },
  CIDR6 : {
    description : "an IPv6 Network",
    match : function ( queryterm ) {
      var parts = queryterm.split( "/" );
      if( parts.length == 2 &&
          ( IPV6_REGEX.test(parts[0].trim()) ||
            IPV6_HEXCOMPRESS_REGEX.test(parts[0].trim()) ) &&
          CIDR6_LENGTH_REGEX.test(parts[1].trim()) ) {
        return true;
      }
      //else
      return false;
    },
    url : function ( queryterm ) {
      var parts = queryterm.split( "/" );
      return BASEURL + "ip/" + parts[0].trim() + "/" + parts[1].trim();
    }
  },
  AUTNUM : {
    description : "an Autonomous System Number",
    match : function ( queryterm ) {
      return AUTNUM_REGEX.test(queryterm);
    },
    url : function ( queryterm ) {
      return BASEURL + "autnum/" + queryterm.replace(/(a|A)(s|S)/,"");
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

function makeTsvData() {
  return [ "line1", "line2" ];
}

var protocolMessages = null;

function prepareForNewQuery( queryText, queryTypeDescription )
{
  protocolMessages = new Array();
  protocolMessages.push( "Query term is '" + queryText + "'" );
  protocolMessages.push( "Query type is " + queryTypeDescription );
}

/*
 * Prepares a new query.
 * Input: the URL of the new query.
 */
function doNewQuery( url ) {
  protocolMessages.push( "Query URL: " + url );
  $.ajax({
           headers: {
             Accept: "application/rdap+json"
           },
           dataType: "json",
           url: url,
           type: "GET"
         })
    .done( querySuccess )
    .fail( queryError )
    .always( queryComplete );
}

function querySuccess( data, textStatus, jqXHR ) {
  makeTestResults();
  if( jqXHR.responseURL ){
    protocolMessages.push( "Response URL: " + jqXHR.responseURL );
  }
  $('#results' ).append( makeProtocolAccordian( protocolMessages ) );
}

function queryError() {
  makeOoopsContainer( [ "Unable to connect to server." ] );
}

function queryComplete() {
  $('#progressBar' ).hide();
}

function convertClassToId( $jquery, uniquifier ) {
  var elems = {};
  $jquery.each( function() {
    var target = $(this);
    var classes = target.attr( "class" );
    if( classes ) {
      var arr = classes.split( " " );
      $.each( arr, function( index, value ) {
        if( matches = value.match( /^(.*)IdClass$/ ) ) {
          elems[ matches[ 1 ] ] = target;
        }
      });
    }
    convertClassToId( target.children(), uniquifier );
  });
  $.each( elems, function( id, element ) {
    var targetId = id;
    if( typeof uniquifier != "undefined" ){
      targetId = id + uniquifier;
    }
    element.attr( "id", targetId );
  });
  return $jquery;
}