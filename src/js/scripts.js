$(document).ready(function(){

  var productsAPI = 'http://interviews-env.b8amvayt6w.eu-west-1.elasticbeanstalk.com/products';

  var searchCall = 'http://interviews-env.b8amvayt6w.eu-west-1.elasticbeanstalk.com/products?search=';

  var allproductsJSONData;

  var templateSourceHandlebars;

  var locationProductsShop = $('.wrapper-articles');

  /*JSON get Products*/
  $.getJSON( productsAPI, function( data ) {
    allproductsJSONData = data;
    showNumberOfItems( allproductsJSONData.length );
    templateSourceHandlebars = $("#product-template").html();
    insertDataHandlebars( allproductsJSONData, templateSourceHandlebars, locationProductsShop );

  }).always( () => $('.loading').fadeOut(1000) );

  function showNumberOfItems( itemNumber ) {
    $('.item-count').text(itemNumber);
  }

  /*Handlebars*/

  function insertDataHandlebars( dataJSON, source, locationToInsert ) {

    Handlebars.registerHelper('roundDiscount', function(str){
      return Math.abs( parseInt( str ) );
    });

    Handlebars.registerHelper('isdefined', function (value) {
      return value !== undefined;
    });

    // Grab the template script
    var theTemplateScript = source;

    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);

    // Pass our data to the template
    var theCompiledHtml = theTemplate(dataJSON);

    // Add the compiled html to the page
    locationToInsert.append(theCompiledHtml);
  }

  function changeGrid( cellNumber ) {

    let articles = document.querySelector('.wrapper-articles').children;

    for (let i = 0; i < articles.length; i++) {
      if (cellNumber === 3 ) {
        articles[i].classList.add('col-lg-4');
        articles[i].classList.remove('col-lg-3');
      } else if ( cellNumber === 4) {
        articles[i].classList.add('col-lg-3');
        articles[i].classList.remove('col-lg-4');
      }
    }
  }

  /*Search*/
  // function createSearchHTMLStructure (linkProduct,
  //   productTitle,
  //   imageProduct,
  //   currencySymbol,
  //   normalPrice,
  //   discountedPrice) {
  //   let elementSearch ='<a class="link-product" href="'+linkProduct+'">'+
  //   '<img class="image-product" src="'+imageProduct+'" alt="'+productTitle+'">'+
  //   '<div class="wrap-data"><h2 class="article-title">'+productTitle+'</h2>'+
  //   '<p class="price"><span class="normal-price">'+
  //   currencySymbol+' '+normalPrice+'</span>'+currencySymbol+' '+discountedPrice+'</p></div></a>';
  //   return elementSearch;
  // }

  function getSearchInfo( searchValue ) {
    let searchString = searchCall+searchValue;

    $.getJSON( searchString, function( data ) {

      let searchStructure = $( '.search-result' );

      /*Reset div content*/
      searchStructure.empty();

      if ( data.length === 0 ) {
        let pElement = document.createElement( 'p' );
        pElement.classList.add('alert-light', 'text-center');
        pElement.appendChild( document.createTextNode("Nothing found...") );
        searchStructure.append( pElement );
      } else {
         let templateSourceHandlebarsSearch = $("#search-template").html();
        insertDataHandlebars( data, templateSourceHandlebarsSearch, searchStructure);
      }//End Else
    });
  }

  /*Clicks*/

  $( '#search-form-header button' ).on( 'click', function( event ) {
    let searchInput = $('#search-term');
    getSearchInfo( searchInput.val() );
    event.preventDefault();
  });

  $( '#mobile-button' ).on( 'click', function( event ) {
    $('.mobile-menu').toggleClass('open-element');
    event.preventDefault();
  });

  $( '.language-button' ).on( 'click', function( event ) {
    $('.language-selector').toggleClass('show');
    event.preventDefault();
  });

  $(document).on('click', function (e) {
    if ($(e.target).closest('.language-button').length === 0) {
      $('.language-selector').removeClass('show');
    }
  });

  $( '.shipping-button' ).on( 'click', function( event ) {
    $('.country-selector').toggleClass('show');
    event.preventDefault();
  });

  $(document).on('click', function (e) {
    if ($(e.target).closest('.shipping-button').length === 0) {
      $('.country-selector').removeClass('show');
    }
  });

  $( '#button-search' ).on( 'click', function( event ) {
    $('.search').toggleClass('open-element');
    event.preventDefault();
  });

  $( '.search-close' ).on( 'click', function( event ) {
    $('.search').removeClass('open-element');
    event.preventDefault();
  });

  $( '.four-elements' ).on( 'click', function( event ) {
    if( !$(this).hasClass( 'active' ) ) {
      changeGrid(4);
      $(this).addClass('active');
      $( '.three-elements' ).removeClass('active');
    }
    event.preventDefault();
  });

  $( '.three-elements' ).on( 'click', function( event ) {
    if( !$(this).hasClass( 'active' ) ) {
      changeGrid(3);
      $(this).addClass('active');
      $( '.four-elements' ).removeClass('active');
    }
    event.preventDefault();
  });

  $( '.select-sort' ).on( 'click', function( event ) {
    $('.sort-submenu').toggleClass( 'show' );
    event.preventDefault();
  });

  $(document).on('click', function (e) {
    if ($(e.target).closest('.select-sort').length === 0) {
      $('.sort-submenu').removeClass('show');
    }
  });

  $( '.sort-name-asc' ).on( 'click', function( event ) {
    if( allproductsJSONData ) {
      $('.wrapper-articles').empty();
      allproductsJSONData.sort( (a, b) => a.name.localeCompare(b.name) );
      insertDataHandlebars(allproductsJSONData, templateSourceHandlebars, locationProductsShop);
    }
    event.preventDefault();
  });

  $( '.sort-name-desc' ).on( 'click', function( event ) {
    if( allproductsJSONData ) {
      $('.wrapper-articles').empty();
      allproductsJSONData.sort( (a, b) => b.name.localeCompare(a.name) );
      insertDataHandlebars(allproductsJSONData, templateSourceHandlebars, locationProductsShop);
    }
    event.preventDefault();
  });

  $( '.sort-price-high' ).on( 'click', function( event ) {
    if( allproductsJSONData ) {
      $('.wrapper-articles').empty();
      allproductsJSONData.sort( (a, b) => b.price.sell - a.price.sell );
      insertDataHandlebars(allproductsJSONData, templateSourceHandlebars, locationProductsShop);
    }
    event.preventDefault();
  });

  $( '.sort-price-low' ).on( 'click', function( event ) {
    if( allproductsJSONData ) {
      $('.wrapper-articles').empty();
      allproductsJSONData.sort( (a, b) => a.price.sell - b.price.sell );
      insertDataHandlebars(allproductsJSONData, templateSourceHandlebars);
    }
    event.preventDefault();
  });

  /*Scrolling*/

  $(document).scroll(function () {
    var scrollYSize = $(this).scrollTop();

    if (scrollYSize > 100) {
      $('.anchor-up').show();
    } else {
      $('.anchor-up').hide();
    }
  });

  $( '.anchor-up' ).on( 'click', function( event ) {

    $('html, body').animate({
      scrollTop: $('body').offset().top
    }, 1200);

    event.preventDefault();
  });

});