/* ==========================================================================
   CULLPRO - ONBOARDING JAVASCRIPT
   Handles onboarding flow, navigation, and user selections
   ========================================================================== */

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
const onboardingState = {
  currentStep: 1,
  totalSteps: 4,
  selections: {
    photographyTypes: [],
    ratingSystem: null,
    experienceLevel: null,
    filters: []
  }
};

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
const elements = {
  progressBar: document.getElementById('progressBar'),
  stepContainers: document.querySelectorAll('.step-container'),
  backBtn: document.getElementById('backBtn'),
  continueBtn: document.getElementById('continueBtn'),
  stepIndicator: document.getElementById('stepIndicator')
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
function initOnboarding() {
  // Get data from URL parameters if any
  const urlParams = new URLSearchParams(window.location.search);
  
  // Initialize event listeners
  initNavigationButtons();
  initOptionCards();
  initRatingCards();
  initPrimaryButtons();
  
  // Update UI to initial state
  updateProgressBar();
  updateNavigationState();
}

// ==========================================================================
// EVENT LISTENERS SETUP
// ==========================================================================

/**
 * Initialize navigation button event listeners
 */
function initNavigationButtons() {
  // Back button
  if (elements.backBtn) {
    elements.backBtn.addEventListener('click', goToPreviousStep);
  }
  
  // Continue button
  if (elements.continueBtn) {
    elements.continueBtn.addEventListener('click', goToNextStep);
  }
}

/**
 * Initialize option card event listeners (multi-select)
 */
function initOptionCards() {
  const optionCards = document.querySelectorAll('.option-card');
  optionCards.forEach(card => {
    card.addEventListener('click', function() {
      toggleMultiSelect(this);
    });
    
    // Add keyboard support
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMultiSelect(this);
      }
    });
  });
}

/**
 * Initialize rating card event listeners (single-select)
 */
function initRatingCards() {
  const ratingCards = document.querySelectorAll('.rating-card');
  ratingCards.forEach(card => {
    card.addEventListener('click', function() {
      selectSingleOption(this);
    });
    
    // Add keyboard support
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectSingleOption(this);
      }
    });
  });
}

/**
 * Initialize primary action buttons
 */
function initPrimaryButtons() {
  // Get Started button (Step 1)
  const getStartedBtn = document.querySelector('[data-step="1"] .btn--primary');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function() {
      goToStep(2);
    });
  }
  
  // Start Culling button (Final step)
  const startCullingBtn = document.querySelector('[data-step="4"] .btn--primary');
  if (startCullingBtn) {
    startCullingBtn.addEventListener('click', finishOnboarding);
  }
}

// ==========================================================================
// NAVIGATION FUNCTIONS
// ==========================================================================

/**
 * Navigate to a specific onboarding step
 * @param {number} stepNumber - The step number to navigate to
 */
function goToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > onboardingState.totalSteps) return;
  
  // Hide current step
  const currentStepEl = document.querySelector('.step-container.active');
  if (currentStepEl) {
    currentStepEl.classList.remove('active');
  }
  
  // Show new step
  const newStepEl = document.querySelector(`[data-step="${stepNumber}"]`);
  if (newStepEl) {
    newStepEl.classList.add('active');
  }
  
  // Update state
  onboardingState.currentStep = stepNumber;
  
  // Update UI
  updateProgressBar();
  updateNavigationState();
  updateSummary();
}

/**
 * Navigate to the next step
 */
function goToNextStep() {
  goToStep(onboardingState.currentStep + 1);
}

/**
 * Navigate to the previous step
 */
function goToPreviousStep() {
  goToStep(onboardingState.currentStep - 1);
}

/**
 * Complete onboarding and navigate to main app
 */
function finishOnboarding() {
  // Save preferences to localStorage
  localStorage.setItem('onboardingComplete', 'true');
  localStorage.setItem('userPreferences', JSON.stringify(onboardingState.selections));
  
  // Navigate to home
  window.location.href = 'home.html';
}

// ==========================================================================
// SELECTION FUNCTIONS
// ==========================================================================

/**
 * Toggle multi-select option cards
 * @param {HTMLElement} element - The clicked option card
 */
function toggleMultiSelect(element) {
  element.classList.toggle('selected');
  
  // Update state
  const value = element.textContent.trim();
  const index = onboardingState.selections.photographyTypes.indexOf(value);
  
  if (index === -1) {
    onboardingState.selections.photographyTypes.push(value);
  } else {
    onboardingState.selections.photographyTypes.splice(index, 1);
  }
  
  // Update ARIA
  const isSelected = element.classList.contains('selected');
  element.setAttribute('aria-pressed', isSelected);
}

/**
 * Select a single option from a group (radio-like behavior)
 * @param {HTMLElement} element - The clicked option card
 */
function selectSingleOption(element) {
  // Remove selected from all siblings
  const parent = element.parentElement;
  const siblings = parent.querySelectorAll('.rating-card');
  
  siblings.forEach(card => {
    card.classList.remove('selected');
    card.setAttribute('aria-checked', 'false');
  });
  
  // Add selected to clicked element
  element.classList.add('selected');
  element.setAttribute('aria-checked', 'true');
  
  // Update state
  const label = element.querySelector('.rating-label');
  if (label) {
    onboardingState.selections.ratingSystem = label.textContent.trim();
  }
}

// ==========================================================================
// UI UPDATE FUNCTIONS
// ==========================================================================

/**
 * Update the progress bar based on current step
 */
function updateProgressBar() {
  const progress = ((onboardingState.currentStep - 1) / (onboardingState.totalSteps - 1)) * 100;
  
  if (elements.progressBar) {
    elements.progressBar.style.width = `${progress}%`;
    elements.progressBar.setAttribute('aria-valuenow', progress);
  }
}

/**
 * Update navigation buttons and step indicator
 */
function updateNavigationState() {
  const stepNames = ['Welcome', 'Photography', 'Rating', 'Complete'];
  
  // Update step indicator
  if (elements.stepIndicator) {
    elements.stepIndicator.textContent = stepNames[onboardingState.currentStep - 1] || '';
  }
  
  // Update back button visibility
  if (elements.backBtn) {
    elements.backBtn.style.visibility = onboardingState.currentStep === 1 ? 'hidden' : 'visible';
  }
  
  // Update continue button
  if (elements.continueBtn) {
    if (onboardingState.currentStep === onboardingState.totalSteps) {
      elements.continueBtn.style.visibility = 'hidden';
    } else {
      elements.continueBtn.style.visibility = 'visible';
    }
  }
}

/**
 * Update the summary page with selections
 */
function updateSummary() {
  if (onboardingState.currentStep !== onboardingState.totalSteps) return;
  
  // Photography types
  const summaryPhoto = document.getElementById('summaryPhotography');
  const photographyTags = document.getElementById('photographyTags');
  
  if (summaryPhoto && onboardingState.selections.photographyTypes.length > 0) {
    summaryPhoto.textContent = onboardingState.selections.photographyTypes.join(', ');
  }
  
  if (photographyTags) {
    photographyTags.innerHTML = onboardingState.selections.photographyTypes
      .map(type => `<span class="tag">${type}</span>`)
      .join('');
  }
  
  // Rating system
  const summaryRating = document.getElementById('summaryRating');
  if (summaryRating && onboardingState.selections.ratingSystem) {
    summaryRating.textContent = onboardingState.selections.ratingSystem;
  }
}

// ==========================================================================
// INITIALIZE ON DOM READY
// ==========================================================================
document.addEventListener('DOMContentLoaded', initOnboarding);
