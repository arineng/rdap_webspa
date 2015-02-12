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
  return $('<div class="panel panel-default">')
          .append( $('<div class="panel-body">')
                  .append( $('<table class="table table-condensed">')
                          .append( $('<thead>' )
                                  .append( $('<tr>')
                                          .append( $('<th>' )
                                                  .text( typeName )
                                                 )
                                          .append( $('<th>' )
                                                  .append( $('<a>' )
                                                          .text( id )
                                                          .attr( "id", id )
                                                          .attr( "href", "#" + id )
                                                         )
                                                 )
                                          )
                                  )
                          .append( $tbody )
                          )
                  );
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
  return $( '<div class="panel panel-default">' )
          .append( $( '<div class="panel-body">' )
                  .append( $( '<table class="table table-condensed">' )
                          .append( $( '<thead>' )
                                  .append( $( '<tr>' )
                                          .append( $( '<th>' )
                                                  .text( "Notice" )
                                                  .attr( "colspan", "2" )
                                  )
                          )
                  )
                          .append( $tbody )
          )
  );
}

/*
 * Creates a div panel for a results summary.
 * Input: an array of SummaryObjects
 * Output: a JQuery div containing the summary
 */
function makeSummaryTable( arrSummObjs ){
  var $tbody = $('<tbody>');
  $.each( arrSummObjs, function( i ){
    var arrStack = new Array();
    var indStack = new Array();
    arrStack.push( arrSummObjs[i].children );
    indStack.push( 0 );
    var $tr = $('<tr>');
    $tr.append( makeSummaryCell( arrSummObjs[i] ) );
    while( arrStack.length > 0 ){
      var arr = arrStack[arrStack.length-1];
      var ind = indStack[indStack.length-1];
      if( ind == arr.length ) {
        arrStack.pop();
        indStack.pop();
      } else {
        var summaryObj = arr[ind];
        $tr.append( makeSummaryCell( summaryObj ) );
        ind++;
        indStack[indStack.length-1] = ind;
        if( summaryObj.children.length > 0 ) {
          arrStack.push( summaryObj.children );
          indStack.push( 0 );
        } else {
          $tbody.append( $tr );
          $tr = $('<tr>');
        }
      }
    }
  });
  return $('<div class="panel panel-default">')
    .append( $('<div class="panel-body">')
               .append( $('<table class="table table-condensed">')
                          .append( $('<thead>' )
                                     .append( $('<tr>')
                                                .append( $('<th>' )
                                                           .text( "Summary" )
                                                           .attr( "colspan", "100" )
                                              )
                                   )
                        )
                          .append( $tbody )
             )
  );
}

/*
 * Creates a table cell for a summary object
 * Input: summary object
 * Output: a JQuery <td>
 */
function makeSummaryCell( summaryObject ) {
  var $td = $('<td>' ).attr( "rowspan", calculateRowSpan( summaryObject ) );
  if( summaryObject.children.length > 0 ) {
    $td.addClass( "hasChildData" );
  } else {
    $td.attr( "colspan", "100" );
  }
  $td.append( summaryObject.nameType + ": " );
  if( summaryObject.linkable ){
    $td.append( $('<a>' ).text( summaryObject.name ).attr( "href", summaryObject.name ) );
  } else {
    $td.append( summaryObject.name );
  }
  if( summaryObject.description )
  {
    $td.append( "<br>" );
    $td.append( "(" + summaryObject.description + ")" );
  }
  return $td;
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
  var net = new SummaryObject();
  net.nameType="Network";
  net.name="NET-125-0-0-0-1";
  net.description="125.0.0.0 - 125.255.255.255";
  var contact1 = new SummaryObject();
  contact1.nameType="Entity";
  contact1.name="contact1-info";
  contact1.description="Alexander	Graham";
  net.children.push( contact1 );
  var contact2 = new SummaryObject();
  contact2.nameType="Entity";
  contact2.name="contact2-info";
  contact2.description="Grace Alsop";
  net.children.push( contact2 );
  var contact11 = new SummaryObject();
  contact11.nameType="Entity";
  contact11.name="contact11-info";
  contact11.description="Sophie	Oliver";
  net.children.push( contact11 );
  var ns1 = new SummaryObject();
  ns1.nameType="Nameserver";
  ns1.name="ns1.dnsservice.info";
  net.children.push( ns1 );
  var contact3 = new SummaryObject();
  contact3.nameType="Entity";
  contact3.name="contact3-info";
  contact3.description="Leonard	Newman";
  ns1.children.push( contact3 );
  var contact7 = new SummaryObject();
  contact7.nameType="Entity";
  contact7.name="contact7-info";
  contact7.description="Edward	Howard";
  contact3.children.push( contact7 );
  var contact8 = new SummaryObject();
  contact8.nameType="Entity";
  contact8.name="contact8-info";
  contact8.description="Carol	Berry";
  contact3.children.push( contact8 );
  var contact4 = new SummaryObject();
  contact4.nameType="Entity";
  contact4.name="contact4-info";
  contact4.description="Lisa	Grant";
  ns1.children.push( contact4 );
  var ns2 = new SummaryObject();
  ns2.nameType="Nameserver";
  ns2.name="ns2.dnsservice.info";
  net.children.push( ns2 );
  var contact5 = new SummaryObject();
  contact5.nameType="Entity";
  contact5.name="contact5-info";
  contact5.description="Joshua	Turner";
  ns2.children.push( contact5 );
  var contact6 = new SummaryObject();
  contact6.nameType="Entity";
  contact6.name="contact6-info";
  contact6.description="Sophie	Wright";
  ns2.children.push( contact6 );
  var contact9 = new SummaryObject();
  contact9.nameType="Entity";
  contact9.name="contact9-info";
  contact9.description="Donna	Mackenzie";
  contact6.children.push( contact9 );
  var contact10 = new SummaryObject();
  contact10.nameType="Entity";
  contact10.name="contact10-info";
  contact10.description="Elizabeth	Lawrence";
  contact6.children.push( contact10 );
  $('#results' ).append( makeSummaryTable( [ net ] ) );

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
