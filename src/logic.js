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

/**
 * This represents information about RDAP Object Classes
 * The members of each object class object are:
 * - className = the RDAP value in objectClasName
 * - typeName = the value passed into makeOCTable
 * - getId = a function to get the ID of an object to be passed into makeOCTable
 * - getTreeNode = gets a node object for the bootstrap tree
 * - getOCData = gets an ocData object for the object class
 *     the ocData object consists of:
 *       typeName  - string
 *       id        - string
 *       tableData - array of string arrays, [0]=column name, [1]=column value
 */
OBJECTCLASS = {
  IP : {
    className : "ip network",
    typeName : "IP Network",
    getId: function( data ) {
      return data[ "handle" ];
    },
    getTreeNode: function( data ) {
      return getStandardTreeNode( this, data );
    },
    getOCData: function( data ) {
      var ocData = {};
      ocData.typeName = this.typeName;
      ocData.id = this.getId( data );
      ocData.tableData = [];
      pushColumnData( data, ocData.tableData, [
        [ "handle", "Handle" ],
        [ "startAddress", "Start Address" ],
        [ "endAddress", "End Address" ],
        [ "name", "Name" ],
        [ "type", "Type" ],
        [ "parentHandle", "Parent Handle" ],
        [ "ipVersion", "IP Version" ]
      ]);
      return ocData;
    }
  },
  ENTITY : {
    className : "entity",
    typeName : "Entity",
    getId: function( data ) {
      return data[ "handle" ];
    },
    getTreeNode: function( data ) {
      return getStandardTreeNode( this, data );
    },
    getOCData: function( data ) {
      var ocData = {};
      ocData.typeName = this.typeName;
      ocData.id = this.getId( data );
      ocData.tableData = [];
      pushColumnData( data, ocData.tableData, [
        [ "handle", "Handle" ],
        [ "startAddress", "Start Address" ],
        [ "endAddress", "End Address" ]
      ]);
      return ocData;
    }
  }
};

/**
 * Convience method for pushing tableData.
 * data - the JSON data
 * tableData - the table data
 * nameArray - array of string arrays which are [0]=jsonName, [1]=columnName
 */
function pushColumnData( data, tableData, nameArray ) {
  $.each( nameArray, function( i, v ) {
    var columnValue = data[ v[0] ];
    if( columnValue ) {
      tableData.push( [ v[1], columnValue ] );
    }
  });
}

/**
 * Gets a standard tree node. Should work for most object classes.
 * @param data
 */
function getStandardTreeNode( objectClass, data ) {
  var treeNode = {};
  treeNode[ "text" ] = objectClass.getId( data );
  treeNode[ "href" ] = "#" + encodeURIComponent( objectClass.getId( data ) );
  if( data[ "entities" ] ) {
    var nodes = [];
    $.each( data[ "entities" ], function( i, v ){
      nodes.push( OBJECTCLASS.ENTITY.getTreeNode( v ) );
    });
    treeNode[ "nodes" ] = nodes;
  }
  treeNode.ocData = objectClass.getOCData( data );
  return treeNode;
}

function getObjectClass( data ) {
  var oc;
  var name = data[ "objectClassName" ];
  if( name ) {
    $.each( OBJECTCLASS, function(key,value) {
      if( value.className == name ) {
        oc = value;
        return false;
      }
      //else keep iterating
      return true;
    });
  }
  return oc;
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
  noteResponseInfo( data, textStatus, jqXHR );
  makeResultsContainer();
  makeClearContainer();
  processNotices( data );

  objectClass = getObjectClass( data );
  if( objectClass ) {

    $('#results' ).append( makeTreeDataViews() );

    var treeData = [];
    treeData.push( objectClass.getTreeNode( data ) );
    $('#treeview').treeview({
      color: "#428bca",
      expandIcon: "glyphicon glyphicon-stop",
      collapseIcon: "glyphicon glyphicon-unchecked",
      nodeIcon: "glyphicon glyphicon-user",
      showTags: true,
      data: treeData
    });

    $('#dataview' ).append( makeOCTable( treeData[0].ocData ) );

    $('#treeview' ).on('nodeSelected', function( event, node ) {
      $('#dataview > div' ).remove();
      $('#dataview' ).append( makeOCTable( node.ocData ) );
    });
  }

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

function noteResponseInfo( data, textStatus, jqXHR ) {
  protocolMessages.push( "Server status code: " + jqXHR.status );
  protocolMessages.push( "Server status: " + textStatus );
  var rdapConformance = data[ "rdapConformance" ];
  if( rdapConformance ) {
    protocolMessages.push( "Server supports: " + rdapConformance );
  }
}

function processNotices( data ) {
  var notices = data[ "notices" ];
  if( notices ) {
    var $noticesPanel = makeNoticesPanel();
    $.each( notices, function( index, value ) {
      addNoticeAccordian( $noticesPanel, index, value[ "title" ], value[ "description" ], value[ "links" ], value[ "type" ])
    });
    $('#results' ).append( $noticesPanel );
  }
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