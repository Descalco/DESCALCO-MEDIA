/* ==========================================================================
   CULLPRO - CULLING APP JAVASCRIPT
   Refactored with Modern ES6+ Patterns
   ========================================================================== */

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
const state = {
  currentView: 'grid',
  currentPhotoIndex: 0,
  compareIndex: 0,
  surveyStartIndex: 0,
  photos: [],
  selectedSurveyItems: new Set()
};

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
const elements = {
  // Views
  gridView: document.getElementById('grid-view'),
  detailView: document.getElementById('detail-view'),
  compareView: document.getElementById('compare-view'),
  surveyView: document.getElementById('survey-view'),
  
  // View mode buttons
  viewModeBtns: document.querySelectorAll('.btn--view'),
  
  // Grid View
  photoCards: document.querySelectorAll('.photo-card'),
  photoGrid: document.getElementById('photo-grid'),
  gridSidebar: document.getElementById('grid-sidebar'),
  gridSidebarToggle: document.getElementById('grid-sidebar-toggle'),
  gridSizeSlider: document.getElementById('grid-size-slider'),
  gridSizeLabel: document.getElementById('grid-size-label'),
  
  // Detail View
  detailImage: document.getElementById('detail-image'),
  detailFilename: document.getElementById('detail-filename'),
  bottomFilename: document.getElementById('bottom-filename'),
  detailNavCount: document.getElementById('detail-nav-count'),
  filmstripList: document.getElementById('filmstrip-list'),
  detailSidebar: document.getElementById('detail-sidebar'),
  detailSidebarToggle: document.getElementById('detail-sidebar-toggle'),
  detailPrevBtn: document.getElementById('detail-prev-photo'),
  detailNextBtn: document.getElementById('detail-next-photo'),
  
  // Compare View
  compareImageLeft: document.getElementById('compare-image-left'),
  compareImageRight: document.getElementById('compare-image-right'),
  compareNavCount: document.getElementById('compare-nav-count'),
  comparePrevBtn: document.getElementById('compare-prev'),
  compareNextBtn: document.getElementById('compare-next'),
  
  // Survey View
  surveyGrid: document.getElementById('survey-grid'),
  surveyNavCount: document.getElementById('survey-nav-count'),
  surveyPrevBtn: document.getElementById('survey-prev'),
  surveyNextBtn: document.getElementById('survey-next'),
  surveySelectionCount: document.getElementById('survey-selection-count'),
  
  // Dropdowns
  dropdowns: document.querySelectorAll('.dropdown')
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
function init() {
  // Populate photos array from photo cards
  state.photos = Array.from(elements.photoCards).map(card => ({
    src: card.querySelector('.photo-card__image').src,
    index: parseInt(card.dataset.index || 0),
    filename: card.querySelector('.photo-card__filename')?.textContent || 'photo.jpg'
  }));
  
  // Initialize event listeners
  initViewModeButtons();
  initPhotoCards();
  initDropdowns();
  initStarRatings();
  initGridControls();
  initDetailViewControls();
  initCompareViewControls();
  initSurveyViewControls();
  initKeyboardNavigation();
  initTabs();
}

// ==========================================================================
// VIEW SWITCHING
// ==========================================================================
function switchView(viewName) {
  state.currentView = viewName;
  
  // Update all view mode buttons across all views
  elements.viewModeBtns.forEach(btn => {
    const isActive = btn.dataset.view === viewName;
    btn.classList.toggle('btn--view-active', isActive);
  });
  
  // Hide all views
  elements.gridView?.classList.remove('view--active');
  elements.detailView?.classList.remove('view--active');
  elements.compareView?.classList.remove('view--active');
  elements.surveyView?.classList.remove('view--active');
  
  // Show selected view
  switch(viewName) {
    case 'grid':
      elements.gridView?.classList.add('view--active');
      break;
    case 'loupe':
      elements.detailView?.classList.add('view--active');
      updateDetailView();
      populateFilmstrip();
      break;
    case 'compare':
      elements.compareView?.classList.add('view--active');
      updateCompareView();
      break;
    case 'survey':
      elements.surveyView?.classList.add('view--active');
      updateSurveyView();
      break;
  }
}

function initViewModeButtons() {
  elements.viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
    });
  });
}

// ==========================================================================
// GRID VIEW
// ==========================================================================
function initPhotoCards() {
  elements.photoCards.forEach(card => {
    card.addEventListener('dblclick', () => {
      state.currentPhotoIndex = parseInt(card.dataset.index || 0);
      switchView('loupe');
    });
  });
}

function initGridControls() {
  // Sidebar toggle
  elements.gridSidebarToggle?.addEventListener('click', () => {
    elements.gridSidebar?.classList.toggle('sidebar--visible');
  });
  
  // Grid size slider
  elements.gridSizeSlider?.addEventListener('input', (e) => {
    const cols = e.target.value;
    if (elements.gridSizeLabel) {
      elements.gridSizeLabel.textContent = cols;
    }
    if (elements.photoGrid) {
      elements.photoGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    }
  });
}

// ==========================================================================
// DETAIL VIEW (LOUPE)
// ==========================================================================
function updateDetailView() {
  const photo = state.photos[state.currentPhotoIndex];
  if (!photo) return;
  
  // Update main image
  if (elements.detailImage) {
    elements.detailImage.src = photo.src;
  }
  
  // Update navigation count
  if (elements.detailNavCount) {
    elements.detailNavCount.textContent = `${state.currentPhotoIndex + 1} / ${state.photos.length}`;
  }
  
  // Update filename
  const filename = photo.filename || `photo_${state.currentPhotoIndex + 1}.jpg`;
  if (elements.detailFilename) {
    elements.detailFilename.textContent = filename;
  }
  if (elements.bottomFilename) {
    elements.bottomFilename.textContent = filename;
  }
  
  // Update filmstrip selection
  document.querySelectorAll('.filmstrip__item').forEach((item, idx) => {
    item.classList.toggle('filmstrip__item--active', idx === state.currentPhotoIndex);
  });
}

function populateFilmstrip() {
  if (!elements.filmstripList) return;
  
  elements.filmstripList.innerHTML = '';
  const totalPhotos = state.photos.length;
  
  state.photos.forEach((photo, idx) => {
    const item = document.createElement('div');
    const photoNum = idx + 1;
    const similarCount = Math.floor(Math.random() * 5); // Demo: random similar count
    const status = photo.status || 'default'; // 'default', 'approved', 'rejected'
    
    let statusClass = '';
    if (idx === state.currentPhotoIndex) {
      statusClass = 'filmstrip__item--active';
    } else if (status === 'approved') {
      statusClass = 'filmstrip__item--approved';
    } else if (status === 'rejected') {
      statusClass = 'filmstrip__item--rejected';
    }
    
    item.className = `filmstrip__item ${statusClass}`;
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Foto ${photoNum} de ${totalPhotos}`);
    
    // Determine similar badge color and label
    let badgeClass = 'filmstrip__similar-badge--yellow';
    let badgeLabel = 'similar';
    if (similarCount === 0) badgeClass = '';
    else if (similarCount === 1) {
      badgeClass = 'filmstrip__similar-badge--green';
      badgeLabel = 'única';
    } else if (similarCount >= 3) {
      badgeClass = 'filmstrip__similar-badge--red';
      badgeLabel = 'muitas similares';
    }
    
    item.innerHTML = `
      <div class="filmstrip__image-container">
        <img src="${photo.src}" alt="Foto ${photoNum} - ${photo.filename || 'sem nome'}" class="filmstrip__image">
        <div class="filmstrip__overlay">
          <span class="filmstrip__photo-number">${photoNum} / ${totalPhotos}</span>
          <div class="filmstrip__overlay-right">
            <button class="filmstrip__icon-btn filmstrip__icon-btn--trash" aria-label="Eliminar foto ${photoNum}" title="Eliminar">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
              </svg>
            </button>
            <button class="filmstrip__icon-btn filmstrip__icon-btn--seen" aria-label="Marcar como vista" title="Vista">
              <svg viewBox="0 0 24 24" fill="#fff">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </button>
            ${similarCount > 0 ? `<span class="filmstrip__similar-badge ${badgeClass}" title="${similarCount} fotos ${badgeLabel}">${similarCount}+</span>` : ''}
          </div>
        </div>
      </div>
      <span class="filmstrip__name" title="${photo.filename || `${photoNum.toString().padStart(4, '0')}_NomeFoto.jpg`}">${photo.filename || `${photoNum.toString().padStart(4, '0')}_NomeFoto.jpg`}</span>
      <div class="filmstrip__bottom-row">
        <div class="filmstrip__stars" data-rating="0" role="group" aria-label="Avaliação por estrelas">
          <button class="rating__star" data-star="1" aria-label="Avaliar 1 estrela" title="1 estrela">
            <img src="styles/icons/star.svg" alt="">
          </button>
          <button class="rating__star" data-star="2" aria-label="Avaliar 2 estrelas" title="2 estrelas">
            <img src="styles/icons/star.svg" alt="">
          </button>
          <button class="rating__star" data-star="3" aria-label="Avaliar 3 estrelas" title="3 estrelas">
            <img src="styles/icons/star.svg" alt="">
          </button>
          <button class="rating__star" data-star="4" aria-label="Avaliar 4 estrelas" title="4 estrelas">
            <img src="styles/icons/star.svg" alt="">
          </button>
          <button class="rating__star" data-star="5" aria-label="Avaliar 5 estrelas" title="5 estrelas">
            <img src="styles/icons/star.svg" alt="">
          </button>
        </div>
        <button class="filmstrip__flag" aria-label="Estado da foto: Aprovada" title="Alterar estado">
          <svg class="filmstrip__flag-icon filmstrip__flag-icon--approved" viewBox="0 0 24 24" fill="#2a7231">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <svg class="filmstrip__flag-arrow" viewBox="0 0 24 24" fill="#999">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
      </div>
    `;
    
    // Click to select
    item.addEventListener('click', (e) => {
      // Don't select if clicking on action buttons
      if (e.target.closest('.filmstrip__icon-btn') || 
          e.target.closest('.rating__star') || 
          e.target.closest('.filmstrip__flag')) {
        return;
      }
      state.currentPhotoIndex = idx;
      updateDetailView();
    });
    
    // Keyboard navigation
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        state.currentPhotoIndex = idx;
        updateDetailView();
      }
    });
    
    elements.filmstripList.appendChild(item);
  });
  
  // Re-initialize star ratings for new filmstrip items
  initStarRatings();
}

function initDetailViewControls() {
  // Sidebar toggle
  elements.detailSidebarToggle?.addEventListener('click', () => {
    elements.detailSidebar?.classList.toggle('detail-sidebar--hidden');
  });
  
  // Previous photo
  elements.detailPrevBtn?.addEventListener('click', () => {
    if (state.currentPhotoIndex > 0) {
      state.currentPhotoIndex--;
      updateDetailView();
    }
  });
  
  // Next photo
  elements.detailNextBtn?.addEventListener('click', () => {
    if (state.currentPhotoIndex < state.photos.length - 1) {
      state.currentPhotoIndex++;
      updateDetailView();
    }
  });
}

// ==========================================================================
// COMPARE VIEW
// ==========================================================================
function updateCompareView() {
  const leftPhoto = state.photos[state.compareIndex] || state.photos[0];
  const rightPhoto = state.photos[state.compareIndex + 1] || state.photos[1];
  
  if (elements.compareImageLeft && leftPhoto) {
    elements.compareImageLeft.src = leftPhoto.src;
  }
  
  if (elements.compareImageRight && rightPhoto) {
    elements.compareImageRight.src = rightPhoto.src;
  }
  
  if (elements.compareNavCount) {
    elements.compareNavCount.textContent = 
      `${state.compareIndex + 1}-${state.compareIndex + 2} / ${state.photos.length}`;
  }
}

function initCompareViewControls() {
  // Previous pair
  elements.comparePrevBtn?.addEventListener('click', () => {
    if (state.compareIndex > 0) {
      state.compareIndex -= 2;
      updateCompareView();
    }
  });
  
  // Next pair
  elements.compareNextBtn?.addEventListener('click', () => {
    if (state.compareIndex + 2 < state.photos.length - 1) {
      state.compareIndex += 2;
      updateCompareView();
    }
  });
}

// ==========================================================================
// SURVEY VIEW
// ==========================================================================
function updateSurveyView() {
  const surveyItems = document.querySelectorAll('.survey-item');
  
  surveyItems.forEach((item, idx) => {
    const photoIdx = state.surveyStartIndex + idx;
    const photo = state.photos[photoIdx];
    
    if (photo) {
      const img = item.querySelector('.survey-item__image');
      const badge = item.querySelector('.survey-item__badge');
      const filename = item.querySelector('.survey-item__filename');
      
      if (img) img.src = photo.src;
      if (badge) badge.textContent = photoIdx + 1;
      if (filename) filename.textContent = photo.filename || `Photo_${String(photoIdx + 1).padStart(3, '0')}.jpg`;
      
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  
  if (elements.surveyNavCount) {
    const endIndex = Math.min(state.surveyStartIndex + 6, state.photos.length);
    elements.surveyNavCount.textContent = 
      `${state.surveyStartIndex + 1}-${endIndex} / ${state.photos.length}`;
  }
}

function initSurveyViewControls() {
  // Previous group
  elements.surveyPrevBtn?.addEventListener('click', () => {
    if (state.surveyStartIndex > 0) {
      state.surveyStartIndex -= 6;
      updateSurveyView();
    }
  });
  
  // Next group
  elements.surveyNextBtn?.addEventListener('click', () => {
    if (state.surveyStartIndex + 6 < state.photos.length) {
      state.surveyStartIndex += 6;
      updateSurveyView();
    }
  });
  
  // Item selection
  document.querySelectorAll('.survey-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = item.dataset.index;
      item.classList.toggle('survey-item--selected');
      
      if (item.classList.contains('survey-item--selected')) {
        state.selectedSurveyItems.add(index);
      } else {
        state.selectedSurveyItems.delete(index);
      }
      
      // Update selection count
      if (elements.surveySelectionCount) {
        elements.surveySelectionCount.textContent = 
          `${state.selectedSurveyItems.size} selecionadas`;
      }
    });
  });
}

// ==========================================================================
// STAR RATINGS
// ==========================================================================
function initStarRatings() {
  const ratingContainers = document.querySelectorAll(
    '.rating, .detail-bottombar__stars, .compare-panel__stars, .survey-item__rating, .filmstrip__stars'
  );
  
  ratingContainers.forEach(container => {
    const stars = container.querySelectorAll('.rating__star');
    
    stars.forEach((star, index) => {
      // Hover effect
      star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => {
          s.classList.toggle('rating__star--hovered', i <= index);
        });
      });
      
      // Click to set rating
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        const rating = index + 1;
        container.dataset.rating = rating;
        
        stars.forEach((s, i) => {
          s.classList.toggle('rating__star--filled', i < rating);
        });
      });
    });
    
    // Reset hover state when leaving container
    container.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('rating__star--hovered'));
    });
  });
}

// ==========================================================================
// DROPDOWNS
// ==========================================================================
function initDropdowns() {
  elements.dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown__trigger');
    const items = dropdown.querySelectorAll('.dropdown__item');
    
    // Toggle dropdown
    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Close other dropdowns
      elements.dropdowns.forEach(d => {
        if (d !== dropdown) d.classList.remove('dropdown--open');
      });
      
      dropdown.classList.toggle('dropdown--open');
    });
    
    // Item selection
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const label = dropdown.querySelector('.dropdown__label');
        if (label) {
          label.textContent = item.textContent;
        }
        dropdown.classList.remove('dropdown--open');
        
        // Mark as selected
        items.forEach(i => i.classList.remove('dropdown__item--selected'));
        item.classList.add('dropdown__item--selected');
      });
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    elements.dropdowns.forEach(d => d.classList.remove('dropdown--open'));
  });
}

// ==========================================================================
// KEYBOARD NAVIGATION
// ==========================================================================
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (state.currentView === 'loupe') {
      if (e.key === 'ArrowLeft') {
        elements.detailPrevBtn?.click();
      } else if (e.key === 'ArrowRight') {
        elements.detailNextBtn?.click();
      } else if (e.key === 'Escape') {
        switchView('grid');
      }
    }
  });
}

// ==========================================================================
// TAB MANAGEMENT
// ==========================================================================
function initTabs() {
  const tabContainers = document.querySelectorAll('.header__tabs');
  let openTabs = JSON.parse(sessionStorage.getItem('openTabs') || '[]');
  let activeTab = sessionStorage.getItem('activeTab');
  
  // Initialize default tab if none exists
  if (openTabs.length === 0) {
    openTabs.push({
      name: 'Sarah & James Wedding',
      photoCount: '847',
      id: Date.now()
    });
    sessionStorage.setItem('openTabs', JSON.stringify(openTabs));
    sessionStorage.setItem('activeTab', 'Sarah & James Wedding');
    activeTab = 'Sarah & James Wedding';
  }
  
  // Render tabs
  tabContainers.forEach(tabsContainer => {
    // Remove existing project tabs
    const existingTabs = tabsContainer.querySelectorAll('.tab');
    existingTabs.forEach(tab => tab.remove());
    
    // Create tabs
    openTabs.forEach(tab => {
      const tabEl = document.createElement('div');
      tabEl.className = `tab ${tab.name === activeTab ? 'tab--active' : ''}`;
      tabEl.dataset.project = tab.name;
      tabEl.innerHTML = `
        <span class="tab__name">${tab.name}</span>
        <button class="tab__close" title="Fechar separador" aria-label="Fechar ${tab.name}">×</button>
      `;
      
      // Tab click
      tabEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab__close')) {
          setActiveTab(tab.name);
        }
      });
      
      // Close button
      tabEl.querySelector('.tab__close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(tab.name);
      });
      
      tabsContainer.appendChild(tabEl);
    });
  });
  
  // Update page title
  if (activeTab) {
    document.title = `AlbumTeller - ${activeTab}`;
  }
}

function setActiveTab(tabName) {
  sessionStorage.setItem('activeTab', tabName);
  
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('tab--active', tab.dataset.project === tabName);
  });
  
  document.title = `AlbumTeller - ${tabName}`;
}

function closeTab(tabName) {
  let openTabs = JSON.parse(sessionStorage.getItem('openTabs') || '[]');
  const activeTab = sessionStorage.getItem('activeTab');
  
  openTabs = openTabs.filter(tab => tab.name !== tabName);
  sessionStorage.setItem('openTabs', JSON.stringify(openTabs));
  
  if (activeTab === tabName) {
    if (openTabs.length > 0) {
      setActiveTab(openTabs[openTabs.length - 1].name);
      initTabs();
    } else {
      sessionStorage.removeItem('activeTab');
      window.location.href = 'home.html';
    }
  } else {
    initTabs();
  }
}

// ==========================================================================
// START APPLICATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', init);
