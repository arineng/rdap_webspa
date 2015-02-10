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
  $('#results' ).append( makeProtocolTable( [ "Query URL: http://rdap.arin.net/bootstrap",
    "Server supports rdap_level_0", "Server URL: https://rdap.arin.net/registry" ] ) );
});
