$(document).ready(function(){

  var productsAPI = 'http://interviews-env.b8amvayt6w.eu-west-1.elasticbeanstalk.com/products';

  var searchCall = 'http://interviews-env.b8amvayt6w.eu-west-1.elasticbeanstalk.com/products?search=';

  var allproductsJSONData;

  var templateSourceHandlebars;

  var locationProductsShop = $('.wrapper-articles');

  /*JSON get Products*/
  $.getJSON(productsAPI, function(data) {
    allproductsJSONData = data;
    showNumberOfItems(allproductsJSONData.length);
    templateSourceHandlebars = $("#product-template").html();
    insertDataHandlebars(allproductsJSONData, templateSourceHandlebars, locationProductsShop);

  }).always(() => $('.loading').fadeOut(1000));

  function showNumberOfItems(itemNumber) {
    $('.item-count').text(itemNumber);
  }

  function insertDataHandlebars(dataJSON, source, locationToInsert) {

    Handlebars.registerHelper('roundDiscount', function(str){
      return Math.abs(parseInt( str ));
    });

    Handlebars.registerHelper('isdefined', function (value) {
      return value !== undefined;
    });

    let theTemplateScript = source;

    let theTemplate = Handlebars.compile(theTemplateScript);

    let theCompiledHtml = theTemplate(dataJSON);

    locationToInsert.append(theCompiledHtml);
  }

  function changeGrid(cellNumber) {

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

  function getSearchInfo(searchValue) {
    let searchString = searchCall+searchValue;

    $.getJSON(searchString, function(data) {

      let searchStructure = $('.search-result');

      /*Reset div content*/
      searchStructure.empty();

      if (data.length === 0) {
        let pElement = document.createElement('p');
        pElement.classList.add('alert-light', 'text-center');
        pElement.appendChild(document.createTextNode("Nothing found..."));
        searchStructure.append(pElement);
      } else {
         let templateSourceHandlebarsSearch = $("#search-template").html();
        insertDataHandlebars(data, templateSourceHandlebarsSearch, searchStructure);
      }
    });
  }

  /*Clicks*/

  $('#search-form-header button').on('click', function(event) {
    let searchInput = $('#search-term');
    getSearchInfo(searchInput.val());
    event.preventDefault();
  });

  $( '#mobile-button' ).on('click', function(event) {
    $('.mobile-menu').toggleClass('open-element');
    $('#mobile-button i').toggleClass('fa-times');
    $('#mobile-button i').toggleClass('fa-bars');
    event.preventDefault();
  });

  /*Menu mobile open submenu*/
  $('.have-submenu a').on('click', function (event) {
    $('.have-submenu .submenu-dropdown' ).removeClass('show');
    let getParentEvent = $( event.target ).parent();
    if(getParentEvent.hasClass('have-submenu')) {
      let getSubmenu = getParentEvent.find('.submenu-dropdown');
      getSubmenu.addClass('show');
    }
    event.preventDefault();
  });

  $(document).on('click', function (event) {
    if ($(event.target).closest('.mobile-menu').length === 0 && $(event.target).parent().attr('id') !=='mobile-button') {
      $('.mobile-menu').removeClass('open-element');
    }
  });

  $('.language-button').on('click', function(event) {
    $('.language-selector').toggleClass('show');
    event.preventDefault();
  });

  $(document).on('click', function (event) {
    if ($(event.target).closest('.language-button').length === 0) {
      $('.language-selector').removeClass('show');
    }
    event.preventDefault();
  });

  $('.shipping-button').on('click', function(event) {
    $('.country-selector').toggleClass('show');
    event.preventDefault();
  });

  $(document).on('click', function (event) {
    if ($(event.target).closest('.shipping-button').length === 0) {
      $('.country-selector').removeClass('show');
    }
    event.preventDefault();
  });

  $('#button-search').on('click', function(event) {
    $('.search').toggleClass('open-element');
    event.preventDefault();
  });

  $('.search-close').on('click', function(event) {
    $('.search').removeClass('open-element');
    event.preventDefault();
  });

  $(document).on('click', function (event) {
    if ($(event.target).closest('.search').length === 0 && $(event.target).parent().attr('id') !=='button-search') {
      $('.search').removeClass('open-element');
    }
    event.preventDefault();
  });

  $('.four-elements').on('click', function(event) {
    if(!$(this).hasClass('active')) {
      changeGrid(4);
      $(this).addClass('active');
      $('.three-elements' ).removeClass('active');
    }
    event.preventDefault();
  });

  $('.three-elements').on('click', function(event) {
    if( !$(this).hasClass('active')) {
      changeGrid(3);
      $(this).addClass('active');
      $('.four-elements').removeClass('active');
    }
    event.preventDefault();
  });

  $('.select-sort').on( 'click', function(event) {
    $('.sort-submenu').toggleClass('show');
    event.preventDefault();
  });

  $(document).on('click', function (event) {
    if ($(event.target).closest('.select-sort').length === 0) {
      $('.sort-submenu').removeClass('show');
    }
    event.preventDefault();
  });

  $('.sort-name-asc').on('click', function(event) {
    if(allproductsJSONData) {
      $('.wrapper-articles').empty();
      allproductsJSONData.sort((a, b) => a.name.localeCompare(b.name));
      insertDataHandlebars(allproductsJSONData, templateSourceHandlebars, locationProductsShop);
    }
    event.preventDefault();
  });

  $('.sort-name-desc').on('click', function(event) {
    if( allproductsJSONData ) {
      $('.wrapper-articles').empty();
      allproductsJSONData.sort((a, b) => b.name.localeCompare(a.name));
      insertDataHandlebars(allproductsJSONData, templateSourceHandlebars, locationProductsShop);
    }
    event.preventDefault();
  });

  $('.sort-price-high').on('click', function(event) {
    if( allproductsJSONData ) {
      $('.wrapper-articles').empty();
      allproductsJSONData.sort((a, b) => b.price.sell - a.price.sell);
      insertDataHandlebars(allproductsJSONData, templateSourceHandlebars, locationProductsShop);
    }
    event.preventDefault();
  });

  $('.sort-price-low').on('click', function(event) {
    if( allproductsJSONData ) {
      $('.wrapper-articles').empty();
      allproductsJSONData.sort( (a, b) => a.price.sell - b.price.sell );
      insertDataHandlebars(allproductsJSONData, templateSourceHandlebars, locationProductsShop);
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

  $('.anchor-up').on('click', function(event) {

    $('html, body').animate({
      scrollTop: $('body').offset().top
    }, 1200);

    event.preventDefault();
  });

});