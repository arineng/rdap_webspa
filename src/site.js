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

function clearDivs()
{
  $( '#querycontainer ~ div' ).remove();
}

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

  $('#clear' ).click( function() {
    clearDivs();
  });

});
