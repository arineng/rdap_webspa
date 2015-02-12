/*
 * Copyright (c) 2015. American Registry for Internet Numbers
 */

/**
 * This file contains functions for manipulating the web page.
 * Created by anewton on 2/6/15.
 */

/*
 * makes the #queryterm div and inserts it after #querycontainer
 * returns the #queryterm div node
 */
function makeQueryTermDiv( term, description ) {
  var $queryTerm = $('<div class="container" id="queryterm"/>' );
  $queryTerm.append( $('<p>Query term is "' + term + '".</p>') );
  $queryTerm.append( $('<p>Query type is ' + description + '.</p>') );
  $('<div class="progress" />' )
    .append( $('<div class="progress-bar progress-bar-striped active" />')
                  .attr("role","progressbar")
                  .attr("aria-valuenow","100")
                  .attr("aria-valuemin","0")
                  .attr("aria-valuemax","100")
                  .attr("style","width:100%"))
          .appendTo( $queryTerm );
  $('#querycontainer' ).after( $queryTerm );
  return $queryTerm;
}

/*
 * Creates the protocol information div.
 * Input: protocolMsgs is an array of strings
 * Output: a JQuery div element containing the table
 */
function makeProtocolTable( protocolMsgs )
{
  var $tbody = $('<tbody>');
  $.each( protocolMsgs, function( e ){
    $tbody.append(  $('<tr>' )
            .append( $('<td>' )
                    .text( protocolMsgs[ e ] ) ) );
  });
  return $('<div class="panel panel-default">')
          .append( $('<div class="panel-body">')
                  .append( $('<table class="table table-condensed">')
                          .append( $('<thead>' )
                                  .append( $('<tr>')
                                          .append( $('<th>' )
                                                  .text( "Protocol Information" )
                                  )
                          )
                  )
                          .append( $tbody )
          )
  );
}

/*
 * Creates a div with a table for result Objectclasses such as
 * Entities, name servers, domains, IP networks, etc...
 * Input: typeName is the name of the objectclass type
 *        id is the identifier for the particular instance
 *        data is an array or arrays, with the inner array containing
 *          two strings: data item name and the data item
 * Output: a JQuery div
 */
function makeOCTable( typeName, id, data )
{
  var $tbody = $('<tbody>');
  $.each( data, function( e ){
    $tbody.append(  $('<tr>' )
            .append( $('<td>' )
                    .text( data[ e ][ 0 ] )
                    .addClass( "isDataLabel" )
                    .addClass( "hasChildData" )
                   )
            .append( $('<td>' )
                    .text( data[ e ][ 1 ] )
                   )
                 );
  });
  return $('#template > .ocTablePanel' ).clone().show().find('table' )
    .append( $tbody )
    .find('th:first-child')
      .text( typeName )
      .end()
    .find('th:last-child')
      .text( id )
      .end()
    .end();
}

/*
 * Creates a div panel for RDAP notice.
 * Input: title - string
 *        paragraphs - an array of strings
 *        links - an array of arrays, each inner array being strings of link type name and the link
 *        type - a string of the notice type
 * Output: a JQuery div
 */
function makeNotice( title, paragraphs, links, type )
{
  var $tbody = $( '<tbody>' )
          .append( $( '<tr>' )
                  .append( $( '<td>' )
                          .attr( "colspan", "2" )
                          .text( title )
          )
  );
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
  $.each( links, function ( e )
  {
    $tbody.append( $( '<tr>' )
                    .append( $( '<td>' )
                            .text( links[e][0] )
                            .addClass( "isDataLabel" )
                            .addClass( "hasChildData" )
            )
                    .append( $( '<td>' )
                            .text( links[e][1] )
            )
    );
  } );
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
  return $('#template > .noticePanel' ).clone().show().find('table' ).append( $tbody ).end();
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

function clearDivs()
{
  $( '#querycontainer ~ div' ).remove();
}

var tsvFile = null;

$(document).ready( function() {

  $('#queryTypeRadios').hide();

  $('#queryform').submit( function() {
    clearDivs();
    var queryText = $('#queryText' ).val().trim();
    var queryType = getQueryType(queryText);
    makeQueryTermDiv( queryText, queryType.description );
    return false;
  } );

  $('#forceQType').change( function() {
    if($(this ).is(':checked') ) {
      $('#queryTypeRadios').show();
    } else {
      $('#queryTypeRadios').hide();
    }
  });

  $('#clear > button' ).click( function() {
    clearDivs();
  });

  if (tsvFile !== null) {
    window.URL.revokeObjectURL(tsvFile);
  }
  var data = new Blob( makeTsvData(),{type: "text/plain"});
  tsvFile = window.URL.createObjectURL(data);
  $('#clear > a').attr( "href", tsvFile );

  //test of the method... remove later
  $('#results' ).append( makeNotice( "Terms of Use",
          [
                  "Bacon ipsum dolor amet turducken kielbasa sirloin tail. Swine cow porchetta doner ham hock turkey. Chicken ham fatback shankle venison turducken tongue biltong short loin beef rump pork belly swine. Shank kielbasa pork picanha beef ribs meatball ground round beef ribeye tri-tip tail meatloaf. Meatball ham hock strip steak landjaeger kevin, venison sausage picanha porchetta. Rump spare ribs bresaola pork chop bacon, hamburger ground round cupim tenderloin ham hock chuck brisket capicola shoulder meatball.",
                  "Filet mignon porchetta capicola cow, shank strip steak pancetta boudin tongue venison rump salami kevin. Ham hock shoulder beef boudin capicola pork meatball corned beef flank rump landjaeger. Strip steak doner brisket, short ribs andouille chuck landjaeger sirloin. Ball tip strip steak ham bresaola, meatball jowl ham hock venison pork belly short loin frankfurter ground round hamburger meatloaf rump. Tongue andouille ham hock tenderloin ham short ribs sausage strip steak spare ribs meatloaf prosciutto pork loin.",
                  "Leberkas flank alcatra frankfurter chuck cow venison. Ball tip tongue venison ham hock frankfurter andouille ground round. Jerky cow turducken, sirloin spare ribs beef ribs kielbasa bresaola short ribs capicola doner tenderloin porchetta. Pork turducken meatball sausage pork chop beef ribs beef frankfurter. Salami pastrami doner shoulder shank prosciutto turkey t-bone pork brisket chicken. Cow kielbasa cupim andouille shank flank brisket prosciutto.",
                  "Doner short loin shank corned beef shankle boudin pastrami leberkas chuck landjaeger tongue. Pancetta pork chop meatball ham hock turkey ribeye. Spare ribs salami ham hock, meatloaf rump frankfurter tri-tip hamburger turkey shankle turducken. Cupim meatloaf pork loin alcatra tenderloin pastrami, landjaeger corned beef shoulder. Cow fatback t-bone ham hock, boudin biltong shoulder. Jerky meatloaf venison beef ribeye jowl strip steak short loin brisket prosciutto.",
                  "Ribeye shank frankfurter flank rump venison brisket drumstick shoulder pork loin ham hock tenderloin chuck ham. Kevin shoulder ball tip pork loin capicola short ribs. Ham meatball picanha, tenderloin tongue alcatra kielbasa jerky. Shank ground round jerky cow. Porchetta cow venison cupim tri-tip pork loin jowl pancetta ball tip frankfurter beef corned beef picanha ribeye pork. Ground round capicola salami, drumstick hamburger pancetta rump pork loin."
          ],
          [ [ "Name", "Andy Newton" ], [ "Email", "andy@arin.net" ], [ "Handle", "ALN-ARIN" ] ],
          "Results truncated") );

  var defaultData = [
    {
      text: 'Parent 1',
      href: '#parent1',
      tags: ['4'],
      nodes: [
        {
          text: 'Child 1',
          href: '#child1',
          tags: ['2'],
          nodes: [
            {
              text: 'Grandchild 1',
              href: '#grandchild1',
              tags: ['0']
            },
            {
              text: 'Grandchild 2',
              href: '#grandchild2',
              tags: ['0']
            }
          ]
        },
        {
          text: 'Child 2',
          href: '#child2',
          tags: ['0']
        }
      ]
    },
    {
      text: 'Parent 2',
      href: '#parent2',
      tags: ['0']
    },
    {
      text: 'Parent 3',
      href: '#parent3',
      tags: ['0']
    },
    {
      text: 'Parent 4',
      href: '#parent4',
      tags: ['0']
    },
    {
      text: 'Parent 5',
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
  $('#treeview' ).on('nodeSelected', function() {
    $('#dataview > div' ).remove();
    $('#dataview' ).append( makeOCTable( "Entity", "ALN-ARIN",
                                         [ [ "Name", "Andy Newton" ], [ "Email", "andy@arin.net" ], [ "Handle", "ALN-ARIN" ] ] ) );
  });

  //test of the method... remove later
  $('#results' ).append( makeOCTable( "Entity", "ALN-ARIN",
    [ [ "Name", "Andy Newton" ], [ "Email", "andy@arin.net" ], [ "Handle", "ALN-ARIN" ] ] ) );

  //test of the method... remove later
  $('#results' ).append( makeOCTable( "Entity", "NEWTO24-ARIN",
          [ [ "Name", "Andy Newton" ], [ "Email", "andy@arin.net" ], [ "Handle", "NEWTO24-ARIN" ] ] ) );

  //test of the method... remove later
  $('#results' ).append( makeOCTable( "Entity", "ANDY-ARIN",
          [ [ "Name", "Andy Newton" ], [ "Email", "andy@arin.net" ], [ "Handle", "ANDY-ARIN" ] ] ) );

  //test of the method... remove later
  $('#results' ).append( makeProtocolTable( [ "Query URL: http://rdap.arin.net/bootstrap",
    "Server supports rdap_level_0", "Server URL: https://rdap.arin.net/registry" ] ) );
});
