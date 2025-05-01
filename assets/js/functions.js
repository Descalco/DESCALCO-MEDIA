// @codekit-prepend "/vendor/hammer-2.0.8.js";

$(document).ready(function () {

  // DOMMouseScroll included for firefox support
  var canScroll = true,
    scrollController = null;
  $(this).on('mousewheel DOMMouseScroll', function (e) {

    if (!($('.outer-nav').hasClass('is-vis'))) {

      e.preventDefault();

      var delta = (e.originalEvent.wheelDelta) ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20;

      if (delta > 50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function () {
          canScroll = true;
        }, 800);
        updateHelper(1);
      }
      else if (delta < -50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function () {
          canScroll = true;
        }, 800);
        updateHelper(-1);
      }

    }

  });

  $('.side-nav li, .outer-nav li').click(function () {

    if (!($(this).hasClass('is-active'))) {

      var $this = $(this),
        curActive = $this.parent().find('.is-active'),
        curPos = $this.parent().children().index(curActive),
        nextPos = $this.parent().children().index($this),
        lastItem = $(this).parent().children().length - 1;

      updateNavs(nextPos);
      updateContent(curPos, nextPos, lastItem);

    }

  });

  $('.cta').click(function () {

    var curActive = $('.side-nav').find('.is-active'),
      curPos = $('.side-nav').children().index(curActive),
      lastItem = $('.side-nav').children().length - 1,
      nextPos = lastItem;

    updateNavs(lastItem);
    updateContent(curPos, nextPos, lastItem);

  });

  // swipe support for touch devices
  var targetElement = document.getElementById('viewport'),
    mc = new Hammer(targetElement);
  mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
  mc.on('swipeup swipedown', function (e) {

    updateHelper(e);

  });

  $(document).keyup(function (e) {

    if (!($('.outer-nav').hasClass('is-vis'))) {
      e.preventDefault();
      updateHelper(e);
    }

  });

  // determine scroll, swipe, and arrow key direction
  function updateHelper(param) {

    var curActive = $('.side-nav').find('.is-active'),
      curPos = $('.side-nav').children().index(curActive),
      lastItem = $('.side-nav').children().length - 1,
      nextPos = 0;

    if (param.type === "swipeup" || param.keyCode === 40 || param > 0) {
      if (curPos !== lastItem) {
        nextPos = curPos + 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
      else {
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }
    else if (param.type === "swipedown" || param.keyCode === 38 || param < 0) {
      if (curPos !== 0) {
        nextPos = curPos - 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
      else {
        nextPos = lastItem;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }

  }

  // sync side and outer navigations
  function updateNavs(nextPos) {

    $('.side-nav, .outer-nav').children().removeClass('is-active');
    $('.side-nav').children().eq(nextPos).addClass('is-active');
    $('.outer-nav').children().eq(nextPos).addClass('is-active');

  }

  // update main content area
  function updateContent(curPos, nextPos, lastItem) {

    $('.main-content').children().removeClass('section--is-active');
    $('.main-content').children().eq(nextPos).addClass('section--is-active');
    $('.main-content .section').children().removeClass('section--next section--prev');

    if (curPos === lastItem && nextPos === 0 || curPos === 0 && nextPos === lastItem) {
      $('.main-content .section').children().removeClass('section--next section--prev');
    }
    else if (curPos < nextPos) {
      $('.main-content').children().eq(curPos).children().addClass('section--next');
    }
    else {
      $('.main-content').children().eq(curPos).children().addClass('section--prev');
    }

    if (nextPos !== 0 && nextPos !== lastItem) {
      $('.header--cta').addClass('is-active');
    }
    else {
      $('.header--cta').removeClass('is-active');
    }

  }

  function outerNav() {

    $('.header--nav-toggle').click(function () {

      $('.perspective').addClass('perspective--modalview');
      setTimeout(function () {
        $('.perspective').addClass('effect-rotate-left--animate');
      }, 25);
      $('.outer-nav, .outer-nav li, .outer-nav--return').addClass('is-vis');

    });

    $('.outer-nav--return, .outer-nav li').click(function () {

      $('.perspective').removeClass('effect-rotate-left--animate');
      setTimeout(function () {
        $('.perspective').removeClass('perspective--modalview');
      }, 400);
      $('.outer-nav, .outer-nav li, .outer-nav--return').removeClass('is-vis');

    });

  }

  function workSlider() {
    // Store related elements
    const $slider = $('.slider');
    const $sliderItems = $slider.find('.slider--item');
    const $sliderNav = $('.slider--prev, .slider--next');
    
    // Initial setup - hide items temporarily to prevent flickering
    $sliderItems.css('opacity', 0);
    
    // Force browser to calculate layouts before proceeding
    setTimeout(function() {
      // Clear any existing position classes
      $sliderItems.removeClass('slider--item-left slider--item-center slider--item-right');
      
      // Initialize slider positions
      initializeSliderPositions();
      
      // Fade items back in with properly applied positions
      $sliderItems.animate({opacity: 1}, 300);
    }, 50);
    
    // Function to set proper positions
    function initializeSliderPositions() {
      const total = $sliderItems.length;
      
      if (total < 3) {
        // Handle case with fewer than 3 items
        if (total === 1) {
          $sliderItems.eq(0).addClass('slider--item-center');
        } else if (total === 2) {
          $sliderItems.eq(0).addClass('slider--item-left');
          $sliderItems.eq(1).addClass('slider--item-center');
        }
        return;
      }
      
      // Set initial positions for 3+ items
      $sliderItems.eq(0).addClass('slider--item-left');
      $sliderItems.eq(1).addClass('slider--item-center');
      $sliderItems.eq(2).addClass('slider--item-right');
    }
    
    // Handle click events for slider navigation
    $sliderNav.on('click', function() {
      const $this = $(this);
      const $curLeft = $slider.find('.slider--item-left');
      const $curCenter = $slider.find('.slider--item-center');
      const $curRight = $slider.find('.slider--item-right');
      
      const total = $sliderItems.length;
      const curLeftIndex = $sliderItems.index($curLeft);
      const curCenterIndex = $sliderItems.index($curCenter);
      const curRightIndex = $sliderItems.index($curRight);
      
      // Remove current position classes
      $sliderItems.removeClass('slider--item-left slider--item-center slider--item-right');
      
      // Calculate new positions based on navigation direction
      let newLeftIndex, newCenterIndex, newRightIndex;
      
      if ($this.hasClass('slider--prev')) {
        // Previous button clicked
        newLeftIndex = (curLeftIndex - 1 + total) % total;
        newCenterIndex = curLeftIndex;
        newRightIndex = curCenterIndex;
      } else {
        // Next button clicked
        newLeftIndex = curCenterIndex;
        newCenterIndex = curRightIndex;
        newRightIndex = (curRightIndex + 1) % total;
      }
      
      // Apply new position classes
      $sliderItems.eq(newLeftIndex).addClass('slider--item-left');
      $sliderItems.eq(newCenterIndex).addClass('slider--item-center');
      $sliderItems.eq(newRightIndex).addClass('slider--item-right');
    });
  }
  
  // Ensure proper initialization under various conditions
  $(document).ready(function() {
    // Initialize on document ready
    workSlider();
    
    // Also initialize on window load for better reliability
    $(window).on('load', function() {
      workSlider();
    });
    
    // Final fallback initialization with a longer delay
    setTimeout(workSlider, 500);
  });

  outerNav();
  workSlider();
  transitionLabels();

});
