/*
 * Copyright (c) 2015. American Registry for Internet Numbers
 */

/**
 * This file contains functions for manipulating the web page.
 * Created by anewton on 2/6/15.
 */

/*
 * makes the #progressBarContainer div and inserts it after #querycontainer
 * returns the #progressBarContainer div node
 */
function makeProgressBarDiv() {
  var $container = $('#template > .progressBarContainer' ).clone().attr( "id", "progressBarContainer" );
  $container.find( '.progress' ).attr( "id", "progressBar" ).show();
  $('#dynamicContainers' ).append( $container );
  return $container;
}

/*
 * Creates the protocol information div.
 * Input: protocolMsgs is an array of strings
 * Output: a JQuery div element containing the table
 */
function makeProtocolAccordian( protocolMsgs )
{
  var $tbody = $('<tbody>');
  $.each( protocolMsgs, function( e ){
    $tbody.append(  $('<tr>' )
                      .append( $('<td>' )
                                 .text( protocolMsgs[ e ] ) ) );
  });
  var retval = $('#template > .protoAccordianDivIdClass').clone();
  retval.find('table').append( $tbody );
  retval.show();
  convertClassToId( retval );
  return retval;
}

/*
 * Creates a div with a table for result Objectclasses such as
 * Entities, name servers, domains, IP networks, etc...
 * Input: ocData as described by OBJECTCLASS
 * Output: a JQuery div
 */
function makeOCTable( ocData )
{
  var $tbody = $('<tbody>');
  if( ocData.tableData )
  {
    $.each( ocData.tableData, function( e ){
      $tbody.append(  $('<tr>' )
                        .append( $('<td>' )
                                   .text( ocData.tableData[ e ][ 0 ] )
                                   .addClass( "isDataLabel" )
                                   .addClass( "hasChildData" )
                      )
                        .append( $('<td>' )
                                   .text( ocData.tableData[ e ][ 1 ] )
                      )
      );
    });
  }
  if( ocData.events )
  {
    $.each( ocData.events, function( e ){
      $tbody.append(  $('<tr>' )
                        .append( $('<td>' )
                                   .text( capitalize( ocData.events[ e ].eventAction || "Event" ) )
                                   .addClass( "isDataLabel" )
                                   .addClass( "hasChildData" )
                      )
                        .append( $('<td>' )
                                   .text( formatEventDateAndActor( ocData.events[ e ].eventDate, ocData.events[ e ].eventActor ) )
                      )
      );
    });
  }
  if( ocData.links ) {
    $.each( ocData.links, function( e ) {
      $tbody.append(  $('<tr>' )
                        .append( $('<td>' )
                                   .text( capitalize( ocData.links[ e ].rel || ocData.links[ e ].type ) )
                                   .addClass( "isDataLabel" )
                                   .addClass( "hasChildData" )
                      )
                        .append( $('<td>' )
                                   .append( getJQueryForLink( ocData.links[ e ] ) )
                      )
      );
    });
  }
  if( ocData.remarks ) {
    $.each( ocData.remarks, function( e ) {
      $tbody.append(  $('<tr>' )
                        .append( $('<td>' )
                                   .text( "Remarks" + (ocData.remarks[e].type ? "(" + capitalize( ocData.remarks[ e ].type ) + ")" : "") )
                                   .addClass( "isDataLabel" )
                                   .addClass( "hasChildData" )
                      )
                        .append( $('<td>' )
                                   .append( getJQueryForRemarks( ocData.remarks[ e ] ) )
                      )
      );
    });
  }
  return $('#template > .ocTablePanel' ).clone().show().find('table' )
    .append( $tbody )
    .find('th:first-child')
      .text( ocData.typeName )
      .end()
    .find('th:last-child')
      .text( ocData.id )
      .end()
    .end();
}

function getJQueryForRemarks( remark ) {
  var $retval = $('<div>');
  if( remark.description ) {
    for( var i = 0; i < remark.description.length; i++ ) {
      $retval.append( $('<p>' ).text( remark.description[ i ] ) );
    }
  }
  if( remark.links ) {
    for( var i = 0; i < remark.links.length; i++ ) {
      $retval.append(
        $('<p>' ).append( getJQueryForLink( remark.links[ i ] ) )
      );
    }
  }
  return $retval;
}

function formatEventDateAndActor( eventDate, eventActor ) {
  var retval = "";
  if( eventDate ) {
    var date = new Date( Date.parse( eventDate ) );
    retval = retval + date.toUTCString() + " (" + date.toDateString() + " local time) ";
  }
  if( eventActor ) {
    retval = retval + "by " + eventActor;
  }
  return retval.trim();
}

/*
 * Creates the Notices (note the plural) panel.
 */
function makeNoticesPanel()
{
  return convertClassToId( $('#template > .noticePanel' ).clone().show() );
}

/*
 * Creates a div panel for RDAP notice.
 * Input: title - string
 *        paragraphs - an array of strings
 *        links - an array of arrays, each inner array being strings of link type name and the link
 *        type - a string of the notice type
 * Output: a JQuery div
 */
function addNoticeAccordian( noticesPanel, count, title, paragraphs, links, type )
{
  var $noticeGroup = convertClassToId( $('#template > .noticeGroup' ).clone() , count );
  $noticeGroup.find( '#noticeHeading' + count )
    .find( "a" ).attr( 'href', '#noticeData' + count ).attr( 'aria-controls', 'noticeData' + count ).text( title );
  var $table = $noticeGroup.find( '#noticeData' + count ).attr( 'aria-labelledby', 'noticeHeading' + count )
    .find( "table" );
  var $tbody = $( '<tbody>' );
  if( paragraphs ) {
    $tbody.append(
      $( '<tr>' ).append(
        $( '<td>' ).attr( "colspan", "2" )
          .append( function ()
                   {
                     var ps = [];
                     $.each( paragraphs, function ( e )
                     {
                       ps.push( $( '<p>' ).text( paragraphs[e] ) );
                     } );
                     return ps;
                   }
        )
      )
    );
  }
  if( links ) {
    $.each( links, function ( e )
    {
      $tbody.append( $( '<tr>' )
                       .append( $( '<td>' )
                                  .text( capitalize( links[e][ "rel" ] ) || links[e][ "type" ] )
                                  .addClass( "isDataLabel" )
                                  .addClass( "hasChildData" )
                     )
                       .append( $( '<td>' )
                                  .append( getJQueryForLink( links[e] ) )
                     )
      );
    } );
  }
  if( type ) {
    $tbody.append( $( '<tr>' )
                     .append( $( '<td>' )
                                .text( "Notice Type" )
                                .addClass( "isDataLabel" )
                                .addClass( "hasChildData" )
                   )
                     .append( $( '<td>' )
                                .text( type )
                   )
    );
  }
  $table.append( $tbody );
  noticesPanel.find( "#notices" ).append( $noticeGroup );
}

/*
 * Creates the divs for the tree and data views.
 * Output: a JQuery div containing bootstrap row and two divs, one for the tree and the other for the data
 */
function makeTreeDataViews() {
  var $div = $('#template > .dataTreeViewRow' ).clone();
  $div.find( ".treeViewClass" ).attr( "id", "treeview" );
  $div.find( ".dataViewClass" ).attr( "id", "dataview" );
  $div.show();
  return $div;
}

/*
 * Appends the results container
 */
function makeResultsContainer(){
  var $resultsContainer = $('#template > .resultsContainer' ).clone().attr( "id", "results" ).show();
  $('#dynamicContainers' ).append( $resultsContainer );
  return $resultsContainer
}

/*
 * Appends the clear container
 */
function makeClearContainer(){
  var $clearContainer = convertClassToId( $('#template > .clearIdClass' ).clone() ).show();
  $('#dynamicContainers' ).append( $clearContainer );
  $('#clearBtn' ).click( function() {
    clearDivs();
  });
  $('#qlink' ).attr( "href", window.location.href.split( '?' )[0] + "?q=" + encodeURIComponent( $('#queryText' ).val().trim() ) );
  return $clearContainer
}

/*
 * Appends the ooops container
 */
function makeOoopsContainer( errorMsgs ){
  var $oopsContainer = $('#template > .oopsContainer' ).clone().attr( "id", "oops" ).show();
  var $panelBody = $oopsContainer.find( '.panel-body' );
  $.each( errorMsgs, function( i ) {
    $panelBody.append( $('<p>' ).text( errorMsgs[ i ] ) );
  });
  $('#dynamicContainers' ).append( $oopsContainer );
  return $oopsContainer;
}

function clearDivs()
{
  $( '#dynamicContainers > div' ).remove();
}

var tsvFile = null;

$(document).ready( function() {

  $('#queryform').submit( function() {
    clearDivs();
    var queryText = $('#queryText' ).val().trim();
    var queryType = getQueryType(queryText);
    prepareForNewQuery( queryText, queryType.description );
    makeProgressBarDiv();
    doNewQuery( queryType.url( queryText ) );
    return false;
  } );

  var q = getParam( "q" );
  if( q ) {
    $('#queryText' ).val( decodeURIComponent( q ) );
    $('#queryform' ).trigger( "submit" );
  }

  var url = getParam( "url" );
  if( url ) {
    $('#queryText' ).val( decodeURIComponent( url ) );
    $('#queryform' ).trigger( "submit" );
  }

});

/**
 * Where a link is the RDAP link structure
 * @param link
 */
function getJQueryForLink( link ) {
  if( link.type == "text/html" || link.type == "application/xhtml+xml" ) {
    return $("<a>" ).text( link.href ).attr( "href", link.href );
  }
  else if( link.type == "application/rdap+json" ) {
    return $("<a>" ).text( link.href ).attr( "href", window.location.href.split( '?' )[ 0 ] + "?url=" + encodeURIComponent( link.href ) );
  }
  //else
  protocolMessages.push( "link to " + link.href + " has no given media type");
  return $("<span>" ).text( link.href );
}

// this should go away
function makeTestResults() {

  /*
  makeResultsContainer();
  makeClearContainer();
  */

  if (tsvFile !== null) {
    window.URL.revokeObjectURL(tsvFile);
  }
  var data = new Blob( makeTsvData(),{type: "text/plain"});
  tsvFile = window.URL.createObjectURL(data);
  $('#download').attr( "href", tsvFile );


  /*
  var $noticesPanel = makeNoticesPanel();
  addNoticeAccordian( $noticesPanel,  1, "Terms of Use",
                                         [
                                           "Bacon ipsum dolor amet turducken kielbasa sirloin tail. Swine cow porchetta doner ham hock turkey. Chicken ham fatback shankle venison turducken tongue biltong short loin beef rump pork belly swine. Shank kielbasa pork picanha beef ribs meatball ground round beef ribeye tri-tip tail meatloaf. Meatball ham hock strip steak landjaeger kevin, venison sausage picanha porchetta. Rump spare ribs bresaola pork chop bacon, hamburger ground round cupim tenderloin ham hock chuck brisket capicola shoulder meatball.",
                                           "Filet mignon porchetta capicola cow, shank strip steak pancetta boudin tongue venison rump salami kevin. Ham hock shoulder beef boudin capicola pork meatball corned beef flank rump landjaeger. Strip steak doner brisket, short ribs andouille chuck landjaeger sirloin. Ball tip strip steak ham bresaola, meatball jowl ham hock venison pork belly short loin frankfurter ground round hamburger meatloaf rump. Tongue andouille ham hock tenderloin ham short ribs sausage strip steak spare ribs meatloaf prosciutto pork loin.",
                                         ],
                                         [ [ "Name", "Andy Newton" ], [ "Email", "andy@arin.net" ], [ "Handle", "ALN-ARIN" ] ],
                                             "Results truncated");
  addNoticeAccordian( $noticesPanel, 2, "Some Restrictions Apply",
                                        [
                                          "Leberkas flank alcatra frankfurter chuck cow venison. Ball tip tongue venison ham hock frankfurter andouille ground round. Jerky cow turducken, sirloin spare ribs beef ribs kielbasa bresaola short ribs capicola doner tenderloin porchetta. Pork turducken meatball sausage pork chop beef ribs beef frankfurter. Salami pastrami doner shoulder shank prosciutto turkey t-bone pork brisket chicken. Cow kielbasa cupim andouille shank flank brisket prosciutto.",
                                          "Doner short loin shank corned beef shankle boudin pastrami leberkas chuck landjaeger tongue. Pancetta pork chop meatball ham hock turkey ribeye. Spare ribs salami ham hock, meatloaf rump frankfurter tri-tip hamburger turkey shankle turducken. Cupim meatloaf pork loin alcatra tenderloin pastrami, landjaeger corned beef shoulder. Cow fatback t-bone ham hock, boudin biltong shoulder. Jerky meatloaf venison beef ribeye jowl strip steak short loin brisket prosciutto.",
                                        ],
                                        [ [ "Name", "Andy Newton" ], [ "Email", "andy@arin.net" ], [ "Handle", "ALN-ARIN" ] ],
                                             "Results truncated");
  addNoticeAccordian( $noticesPanel, 3, "Frankfurters Are Free",
                                        [
                                          "Ribeye shank frankfurter flank rump venison brisket drumstick shoulder pork loin ham hock tenderloin chuck ham. Kevin shoulder ball tip pork loin capicola short ribs. Ham meatball picanha, tenderloin tongue alcatra kielbasa jerky. Shank ground round jerky cow. Porchetta cow venison cupim tri-tip pork loin jowl pancetta ball tip frankfurter beef corned beef picanha ribeye pork. Ground round capicola salami, drumstick hamburger pancetta rump pork loin."
                                        ],
                                        [ [ "Name", "Andy Newton" ], [ "Email", "andy@arin.net" ], [ "Handle", "ALN-ARIN" ] ],
                                             "Results truncated");
  $('#results' ).append( $noticesPanel );
  */


  /*
  var defaultData = [
    {
      text: 'Parent 1',
      ocData: { handle: "p1" },
      href: '#parent1',
      tags: ['4','A'],
      nodes: [
        {
          text: 'Child 1',
          ocData: { handle: "c1" },
          href: '#child1',
          tags: ['2'],
          nodes: [
            {
              text: 'Grandchild 1',
              ocData: { handle: "gc1" },
              href: '#grandchild1',
              tags: ['0']
            },
            {
              text: 'Grandchild 2',
              ocData: { handle: "gc2" },
              href: '#grandchild2',
              tags: ['0']
            }
          ]
        },
        {
          text: 'Child 2',
          ocData: { handle: "c2" },
          href: '#child2',
          tags: ['0']
        }
      ]
    },
    {
      text: 'Parent 2',
      ocData: { handle: "p2" },
      href: '#parent2',
      tags: ['0']
    },
    {
      text: 'Parent 3',
      ocData: { handle: "p3" },
      href: '#parent3',
      tags: ['0']
    },
    {
      text: 'Parent 4',
      ocData: { handle: "p4" },
      href: '#parent4',
      tags: ['0']
    },
    {
      text: 'Parent 5',
      ocData: { handle: "p5" },
      href: '#parent5'  ,
      tags: ['0']
    }
  ];

  $('#results' ).append( makeTreeDataViews() );

  //test of the method... remove later
  $('#treeview').treeview({
                            color: "#428bca",
                            expandIcon: "glyphicon glyphicon-stop",
                            collapseIcon: "glyphicon glyphicon-unchecked",
                            nodeIcon: "glyphicon glyphicon-user",
                            showTags: true,
                            data: defaultData
                          });


  //test of the method... remove later
  $('#treeview' ).on('nodeSelected', function( event, node ) {
    console.log( node.ocData );
    $('#dataview > div' ).remove();
    $('#dataview' ).append( makeOCTable( "Entity", "ALN-ARIN",
                                         [ [ "Name", "Andy Newton" ], [ "Email", "andy@arin.net" ], [ "Handle", "ALN-ARIN" ] ] ) );
  });
  */

}

