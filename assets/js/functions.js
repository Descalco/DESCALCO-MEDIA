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

  // Function to handle outer navigation 
  // This function is used to toggle the outer navigation menu
  // when the user clicks on the header navigation toggle button

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

  // Function for the contact form labels
  function transitionLabels() {
    $(".work-request--information input").focusout(function () {
      var t = $(this).val();
      "" === t ? $(this).removeClass("has-value") : $(this).addClass("has-value"), window.scrollTo(0, 0)
    })
  }

  // Function to handle form submission
  function handleFormSubmission() {
    const form = document.querySelector('.work-request');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state
      const submitBtn = form.querySelector('input[type="submit"]');
      const originalText = submitBtn.value;
      submitBtn.value = 'Sending...';
      submitBtn.disabled = true;

      // Get form data
      const formData = new FormData(form);
      
      // Submit to Netlify
      fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        // Show success overlay
        showSuccessOverlay();
        // Reset form
        form.reset();
        // Remove has-value classes from inputs
        $('.work-request--information input').removeClass('has-value');
      })
      .catch((error) => {
        console.error('Error:', error);
        showErrorOverlay();
      })
      .finally(() => {
        // Reset button
        submitBtn.value = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  // Function to show success overlay
  function showSuccessOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'form-overlay success-overlay';
    overlay.innerHTML = `
      <div class="overlay-content">
        <div class="overlay-icon success-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <h3>Thank You!</h3>
        <p>Your message has been successfully sent! I'll get back to you as soon as possible, usually within 24 hours.</p>
        <button class="overlay-close-btn" onclick="closeOverlay()">Close</button>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Auto close after 5 seconds
    setTimeout(() => {
      if (overlay.parentNode) {
        closeOverlay();
      }
    }, 5000);
  }

  // Function to show error overlay
  function showErrorOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'form-overlay error-overlay';
    overlay.innerHTML = `
      <div class="overlay-content">
        <div class="overlay-icon error-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </div>
        <h3>Oops! Something went wrong</h3>
        <p>There was an error sending your message. Please try again or contact me directly at pedromdcostau@gmail.com</p>
        <button class="overlay-close-btn" onclick="closeOverlay()">Close</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Initialize functions
  outerNav();
  transitionLabels(); // This function is now needed for the hire form
  handleFormSubmission(); // Initialize form submission handling

});

// --- Showreel Toggle Logic ---
// SET THIS VARIABLE TO TRUE TO SHOW "IN THE MAKING" AND HIDE VIDEO
// SET THIS VARIABLE TO FALSE TO SHOW VIDEO AND HIDE "IN THE MAKING"
const showreelInTheMaking = true; // Change to 'false' when video is ready

const showreelVideoContainer = document.getElementById('showreelContainer');
const showreelPlaceholder = document.getElementById('showreelPlaceholder');
const myShowreelVideo = document.getElementById('myShowreelVideo');

if (showreelInTheMaking) {
    if (showreelVideoContainer) showreelVideoContainer.classList.add('hidden');
    if (myShowreelVideo) {
        myShowreelVideo.pause(); // Pause video if it's currently playing
        myShowreelVideo.removeAttribute('autoplay'); // Remove autoplay when hidden
    }
    if (showreelPlaceholder) showreelPlaceholder.classList.remove('hidden');
} else {
    if (showreelVideoContainer) showreelVideoContainer.classList.remove('hidden');
    if (myShowreelVideo) myShowreelVideo.setAttribute('autoplay', ''); // Re-add autoplay when visible
    if (showreelPlaceholder) showreelPlaceholder.classList.add('hidden');
}

// --- Home Section Navigation Logic ---
function goToHomeSection() {
  // Simulate clicking the "Home" nav item
  document.querySelectorAll('.side-nav li')[0].click();
}

// --- Global function to close overlay ---
function closeOverlay() {
  const overlay = document.querySelector('.form-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 300);
  }
}

// --- Logo Animation Video Logic ---

    document.addEventListener('DOMContentLoaded', function () {
      const logoOverlay = document.getElementById('logoAnimationOverlay');
      const logoVideo = document.getElementById('logoAnimationVideo');
      const mainContent = document.querySelector('.perspective');
      const loadingIndicator = document.getElementById('videoLoading');

      console.log('Script loaded');
      console.log('Video element:', logoVideo);
      console.log('Video src:', logoVideo.currentSrc || 'No source set');

      // Ensure main content is hidden initially
      mainContent.style.opacity = '0';

      // Test if video file exists by trying to load it
      fetch('assets/video/OPENER.mp4')
        .then(response => {
          console.log('Video file response:', response.status, response.statusText);
          if (!response.ok) {
            throw new Error('Video file not found');
          }
          return response;
        })
        .catch(error => {
          console.error('Video file fetch error:', error);
          loadingIndicator.innerHTML = '<p style="color: white;">Video file not found. Check the path.</p>';
          setTimeout(showMainContent, 2000);
        });

      // Video event listeners
      logoVideo.addEventListener('loadstart', function () {
        console.log('Video: loadstart event fired');
      });

      logoVideo.addEventListener('loadedmetadata', function () {
        console.log('Video: metadata loaded');
        console.log('Video duration:', logoVideo.duration);
        console.log('Video dimensions:', logoVideo.videoWidth, 'x', logoVideo.videoHeight);
      });

      logoVideo.addEventListener('loadeddata', function () {
        console.log('Video: data loaded');
        loadingIndicator.style.display = 'none';

        // Try to play the video
        logoVideo.play().then(function () {
          console.log('Video: playing successfully');
          // Remove controls once it starts playing
          logoVideo.removeAttribute('controls');
        }).catch(function (error) {
          console.error('Video: play error:', error);
          showMainContent();
        });
      });

      logoVideo.addEventListener('canplay', function () {
        console.log('Video: can play');
      });

      logoVideo.addEventListener('playing', function () {
        console.log('Video: playing event fired');
      });

      logoVideo.addEventListener('ended', function () {
        console.log('Video: ended');
        showMainContent();
      });

      logoVideo.addEventListener('error', function (e) {
        console.error('Video: error event:', e);
        console.error('Video error details:', logoVideo.error);
        loadingIndicator.innerHTML = '<p style="color: white;">Video failed to load. Error: ' + (logoVideo.error ? logoVideo.error.message : 'Unknown') + '</p>';
        setTimeout(showMainContent, 3000);
      });

      // Function to show main content
      function showMainContent() {
        console.log('Showing main content');
        logoOverlay.style.opacity = '0';

        setTimeout(function () {
          logoOverlay.style.display = 'none';
          mainContent.style.transition = 'opacity 1s ease-in-out';
          mainContent.style.opacity = '1';
        }, 500);
      }

      // Fallback timeout
      setTimeout(function () {
        if (logoOverlay.style.display !== 'none') {
          console.log('Timeout reached, showing main content');
          showMainContent();
        }
      }, 15000);
    });

    logoVideo.addEventListener('canplay', function () {
      // Force play with multiple attempts
      const playPromise = logoVideo.play();

      if (playPromise !== undefined) {
        playPromise.then(function () {
          // Autoplay started
          playOverlay.style.display = 'none';
        }).catch(function (error) {
          // Autoplay failed, try again after a short delay
          setTimeout(function () {
            logoVideo.play().catch(function () {
              // Still failed, show play button
              playOverlay.style.display = 'flex';
            });
          }, 100);
        });
      }
    });