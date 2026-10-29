/**
 * LUMINA GALLERY - JAVASCRIPT APPLICATION LOGIC
 * Built for CodeAlpha Frontend Development Internship (Task 1)
 * Pure Vanilla JavaScript (ES6+)
 */

// ==========================================================================
// 1. Image Dataset (High Resolution, Curated Unsplash Photography)
// ==========================================================================
const GALLERY_DATA = [
  // NATURE
  {
    id: 1,
    title: "Alpine Lake Reflection",
    category: "nature",
    author: "Luca Bravo",
    description: "Serene glacial lake mirroring towering alpine peaks during early morning mist.",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Emerald Forest Canopy",
    category: "nature",
    author: "Jan Huber",
    description: "Sunlight piercing through a dense temperate rainforest in early spring.",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Mystic Northern Lights",
    category: "nature",
    author: "Vincent Guth",
    description: "Vibrant aurora borealis dancing across the Arctic night sky above snowfields.",
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Desert Dune Ripples",
    category: "nature",
    author: "Jeremy Bishop",
    description: "Golden hour shadows carving dramatic textures in the rolling desert sands.",
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Cascading Mountain Waterfall",
    category: "nature",
    author: "Thomas Bennie",
    description: "A thundering waterfall tumbling into a turquoise pool surrounded by mossy rocks.",
    url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80"
  },

  // ARCHITECTURE
  {
    id: 6,
    title: "Futuristic Glass Atrium",
    category: "architecture",
    author: "Danist Soh",
    description: "Sleek geometric curves and parametric skylights of modern urban architecture.",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    title: "Spiral Staircase Geometry",
    category: "architecture",
    author: "Ludwig Thalheimer",
    description: "Hypnotic overhead perspective of a continuous minimalist spiral staircase.",
    url: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    title: "Iconic Suspension Bridge",
    category: "architecture",
    author: "Joseph Barrientos",
    description: "Majestic suspension bridge framed against early evening skyline illumination.",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    title: "Historic Cathedral Arches",
    category: "architecture",
    author: "Simone Hutsch",
    description: "Gothic stone vaulting and intricate ribbed arches of European heritage.",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80"
  },

  // TRAVEL
  {
    id: 10,
    title: "Cappadocia Hot Air Balloons",
    category: "travel",
    author: "Yonatan Mirgoli",
    description: "Dozens of colorful hot air balloons rising over fairy chimney valleys at sunrise.",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 11,
    title: "Venetian Grand Canal",
    category: "travel",
    author: "Henrique Ferreira",
    description: "Gondolas gliding along historic pastel-colored palaces during sunset in Venice.",
    url: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 12,
    title: "Santorini Cliffside Haven",
    category: "travel",
    author: "Matthew Waring",
    description: "Whitewashed Aegean architecture and sapphire blue domes overlooking the caldera.",
    url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 13,
    title: "Kyoto Torii Gate Corridor",
    category: "travel",
    author: "Sora Sagano",
    description: "Infinite tunnel of vermilion torii gates winding through sacred Japanese hills.",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 14,
    title: "Amalfi Coast Serenade",
    category: "travel",
    author: "Will Truettner",
    description: "Picturesque Italian coastal village cascading down rugged Mediterranean cliffs.",
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
  },

  // ANIMALS
  {
    id: 15,
    title: "Majestic Lion Gaze",
    category: "animals",
    author: "Cramer Gallimore",
    description: "A close-up portrait of an African lion king surveying the golden savannah.",
    url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 16,
    title: "Red Fox in Winter Snow",
    category: "animals",
    author: "Ray Hennessy",
    description: "Intense golden eyes of a wild red fox foraging across freshly fallen powdered snow.",
    url: "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 17,
    title: "Soaring Bald Eagle",
    category: "animals",
    author: "Frank Busch",
    description: "Sharp profile of a predatory eagle gliding on atmospheric thermal currents.",
    url: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 18,
    title: "Bengal Tiger in the Wild",
    category: "animals",
    author: "Frida Bredesen",
    description: "Striking orange and black stripes moving silently through lush jungle foliage.",
    url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80"
  },

  // TECHNOLOGY
  {
    id: 19,
    title: "Cybernetic Microchip Architecture",
    category: "technology",
    author: "Alexandre Debiève",
    description: "Luminescent nanometer electronic circuitry and semiconductor bus traces.",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 20,
    title: "Futuristic Code Matrix",
    category: "technology",
    author: "Markus Spiske",
    description: "High-density algorithm streams and source syntax glowing across workstation displays.",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 21,
    title: "Robotic AI Manipulation",
    category: "technology",
    author: "Possessed Photography",
    description: "Precision articulated mechanical humanoid hand reaching out in digital space.",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 22,
    title: "Virtual Reality Immersion",
    category: "technology",
    author: "Stephan Henning",
    description: "User navigating spatial holographic interfaces via next-generation VR hardware.",
    url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 23,
    title: "Modern Developer Workspace",
    category: "technology",
    author: "Fotis Fotopoulos",
    description: "Ergonomic modern dual-monitor workstation with ambient indigo backlighting.",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 24,
    title: "Server Data Core Cluster",
    category: "technology",
    author: "Lars Kienle",
    description: "High-speed cloud computing infrastructure and blinking fiber optic routing racks.",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    thumb: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
  }
];

// Fallback SVG generator if network drops or an external image fails
function getFallbackImage(title) {
  const encodedTitle = encodeURIComponent(title || "Lumina Photo");
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="50%" stop-color="%23312e81"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><circle cx="400" cy="270" r="60" fill="%236366f1" opacity="0.4"/><polygon points="370,300 400,240 430,300" fill="%23ffffff" opacity="0.9"/><text x="400" y="380" fill="%23ffffff" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">${encodedTitle}</text><text x="400" y="420" fill="%2394a3b8" font-family="sans-serif" font-size="18" text-anchor="middle">Lumina Curated Collection</text></svg>`;
}

// ==========================================================================
// 2. Application State Management
// ==========================================================================
const AppState = {
  activeCategory: 'all',
  searchQuery: '',
  filteredImages: [...GALLERY_DATA],
  lightboxCurrentIndex: 0,
  isLightboxOpen: false,
  isZoomed: false,
  favorites: new Set(JSON.parse(localStorage.getItem('lumina_favorites') || '[]')),
  touchStartX: 0,
  touchEndX: 0
};

// ==========================================================================
// 3. DOM Elements
// ==========================================================================
const DOM = {
  // Navigation & Theme
  navbar: document.getElementById('navbar'),
  themeToggle: document.getElementById('themeToggle'),
  mobileToggle: document.getElementById('mobileToggle'),
  mobileDrawer: document.getElementById('mobileDrawer'),
  drawerOverlay: document.getElementById('drawerOverlay'),
  drawerClose: document.getElementById('drawerClose'),
  drawerLinks: document.querySelectorAll('.drawer-link'),
  scrollTopBtn: document.getElementById('scrollTopBtn'),

  // Controls & Filters
  searchInput: document.getElementById('searchInput'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  filterButtons: document.querySelectorAll('.filter-btn'),
  visibleCount: document.getElementById('visibleCount'),
  totalCount: document.getElementById('totalCount'),
  activeFilterLabel: document.getElementById('activeFilterLabel'),
  totalPhotosCount: document.getElementById('totalPhotosCount'),

  // Layout View Switchers
  viewGrid: document.getElementById('viewGrid'),
  viewMasonry: document.getElementById('viewMasonry'),

  // Gallery Grid & States
  galleryGrid: document.getElementById('galleryGrid'),
  noResults: document.getElementById('noResults'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),

  // Lightbox Modal
  lightboxModal: document.getElementById('lightboxModal'),
  lightboxBackdrop: document.getElementById('lightboxBackdrop'),
  lbCloseBtn: document.getElementById('lbCloseBtn'),
  lbPrevBtn: document.getElementById('lbPrevBtn'),
  lbNextBtn: document.getElementById('lbNextBtn'),
  lbImage: document.getElementById('lbImage'),
  lbSpinner: document.getElementById('lbSpinner'),
  lbCurrentIndex: document.getElementById('lbCurrentIndex'),
  lbTotalCount: document.getElementById('lbTotalCount'),
  lbCategory: document.getElementById('lbCategory'),
  lbTitle: document.getElementById('lbTitle'),
  lbDescription: document.getElementById('lbDescription'),
  lbAuthor: document.getElementById('lbAuthor'),
  lbZoomBtn: document.getElementById('lbZoomBtn'),
  lbDownloadBtn: document.getElementById('lbDownloadBtn'),
  lbMediaWrapper: document.getElementById('lbMediaWrapper'),

  // Category counts
  countAll: document.getElementById('countAll'),
  countNature: document.getElementById('countNature'),
  countArchitecture: document.getElementById('countArchitecture'),
  countTravel: document.getElementById('countTravel'),
  countAnimals: document.getElementById('countAnimals'),
  countTechnology: document.getElementById('countTechnology')
};

// ==========================================================================
// 4. Initial Setup & Event Listeners
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  calculateCategoryCounts();
  applyFilters();
  bindEvents();
});

function bindEvents() {
  // Theme Toggle
  DOM.themeToggle.addEventListener('click', toggleTheme);

  // Navbar Scroll Effect & Scroll To Top Button
  window.addEventListener('scroll', handleWindowScroll, { passive: true });
  DOM.scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Mobile Drawer Toggle
  DOM.mobileToggle.addEventListener('click', openMobileDrawer);
  DOM.drawerClose.addEventListener('click', closeMobileDrawer);
  DOM.drawerOverlay.addEventListener('click', closeMobileDrawer);
  DOM.drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // Search Input with Debounce
  let searchTimeout = null;
  DOM.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      AppState.searchQuery = e.target.value.trim().toLowerCase();
      toggleSearchClearBtn();
      applyFilters();
    }, 150);
  });

  DOM.searchClearBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    AppState.searchQuery = '';
    toggleSearchClearBtn();
    applyFilters();
    DOM.searchInput.focus();
  });

  // Category Filter Buttons
  DOM.filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      setCategory(category);
    });
  });

  // Footer Category Quick Links
  document.querySelectorAll('.footer-category-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-cat');
      setCategory(cat);
      const galleryElem = document.getElementById('gallery');
      if (galleryElem) {
        galleryElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Layout View Switchers
  DOM.viewGrid.addEventListener('click', () => {
    DOM.viewGrid.classList.add('active');
    DOM.viewMasonry.classList.remove('active');
    DOM.galleryGrid.classList.remove('masonry-view');
  });

  DOM.viewMasonry.addEventListener('click', () => {
    DOM.viewMasonry.classList.add('active');
    DOM.viewGrid.classList.remove('active');
    DOM.galleryGrid.classList.add('masonry-view');
  });

  // Reset Filters Button
  DOM.resetFiltersBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    AppState.searchQuery = '';
    toggleSearchClearBtn();
    setCategory('all');
  });

  // Lightbox Interactions
  DOM.lbCloseBtn.addEventListener('click', closeLightbox);
  DOM.lightboxBackdrop.addEventListener('click', closeLightbox);
  DOM.lbPrevBtn.addEventListener('click', prevLightboxImage);
  DOM.lbNextBtn.addEventListener('click', nextLightboxImage);
  DOM.lbZoomBtn.addEventListener('click', toggleLightboxZoom);

  // Keyboard Shortcuts
  window.addEventListener('keydown', handleGlobalKeydown);

  // Touch Swipe for Mobile Lightbox
  DOM.lbMediaWrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
  DOM.lbMediaWrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// ==========================================================================
// 5. Theme Management (Dark / Light)
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('lumina_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('lumina_theme', newTheme);
}

// ==========================================================================
// 6. Window Scroll Handlers
// ==========================================================================
function handleWindowScroll() {
  const scrollY = window.scrollY;

  // Navbar glass blur style
  if (scrollY > 50) {
    DOM.navbar.classList.add('scrolled');
  } else {
    DOM.navbar.classList.remove('scrolled');
  }

  // Scroll to Top Button Visibility
  if (scrollY > 400) {
    DOM.scrollTopBtn.classList.add('visible');
  } else {
    DOM.scrollTopBtn.classList.remove('visible');
  }
}

// ==========================================================================
// 7. Mobile Drawer Navigation
// ==========================================================================
function openMobileDrawer() {
  DOM.mobileDrawer.classList.add('open');
  DOM.mobileDrawer.setAttribute('aria-hidden', 'false');
  DOM.mobileToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
  DOM.mobileDrawer.classList.remove('open');
  DOM.mobileDrawer.setAttribute('aria-hidden', 'true');
  DOM.mobileToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// ==========================================================================
// 8. Category & Filter System
// ==========================================================================
function calculateCategoryCounts() {
  const counts = {
    all: GALLERY_DATA.length,
    nature: 0,
    architecture: 0,
    travel: 0,
    animals: 0,
    technology: 0
  };

  GALLERY_DATA.forEach(item => {
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    }
  });

  DOM.countAll.textContent = counts.all;
  DOM.countNature.textContent = counts.nature;
  DOM.countArchitecture.textContent = counts.architecture;
  DOM.countTravel.textContent = counts.travel;
  DOM.countAnimals.textContent = counts.animals;
  DOM.countTechnology.textContent = counts.technology;
  DOM.totalPhotosCount.textContent = counts.all;
  DOM.totalCount.textContent = counts.all;
}

function setCategory(category) {
  AppState.activeCategory = category;

  // Update tab button UI
  DOM.filterButtons.forEach(btn => {
    const isTarget = btn.getAttribute('data-category') === category;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  // Update active label badge
  DOM.activeFilterLabel.textContent = category === 'all' ? 'All Categories' : category;

  applyFilters();
}

function toggleSearchClearBtn() {
  if (AppState.searchQuery.length > 0) {
    DOM.searchClearBtn.classList.add('visible');
  } else {
    DOM.searchClearBtn.classList.remove('visible');
  }
}

function applyFilters() {
  const query = AppState.searchQuery;
  const category = AppState.activeCategory;

  AppState.filteredImages = GALLERY_DATA.filter(item => {
    // Category match
    const matchesCategory = category === 'all' || item.category === category;

    // Search query match (title, category, description, author)
    const matchesSearch = query === '' ||
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Update counter badges
  DOM.visibleCount.textContent = AppState.filteredImages.length;

  renderGallery();
}

// ==========================================================================
// 9. Gallery Card Rendering & Hover Effects
// ==========================================================================
function renderGallery() {
  DOM.galleryGrid.innerHTML = '';

  if (AppState.filteredImages.length === 0) {
    DOM.galleryGrid.style.display = 'none';
    DOM.noResults.style.display = 'flex';
    return;
  }

  DOM.galleryGrid.style.display = DOM.viewMasonry.classList.contains('active') ? 'block' : 'grid';
  DOM.noResults.style.display = 'none';

  AppState.filteredImages.forEach((photo, index) => {
    const card = document.createElement('article');
    card.className = 'gallery-card';
    card.setAttribute('data-id', photo.id);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${photo.title} in lightbox`);

    const isFav = AppState.favorites.has(photo.id);

    card.innerHTML = `
      <div class="card-media">
        <div class="skeleton-loader"></div>
        <img 
          class="card-image" 
          src="${photo.thumb}" 
          alt="${photo.title} - Photography by ${photo.author}"
          loading="lazy"
        />
        
        <div class="card-top-bar">
          <span class="card-category-badge">${photo.category}</span>
          <button class="card-fav-btn ${isFav ? 'active' : ''}" data-id="${photo.id}" aria-label="Add to favorites" title="Favorite">
            <svg viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>

        <div class="card-overlay">
          <div class="card-info">
            <h3 class="card-title">${photo.title}</h3>
            <div class="card-meta">
              <span class="card-author">By ${photo.author}</span>
              <div class="card-expand-icon" title="Quick View">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Handle Image Load & Error Gracefully
    const mediaWrapper = card.querySelector('.card-media');
    const imgElement = card.querySelector('.card-image');

    imgElement.addEventListener('load', () => {
      mediaWrapper.classList.add('loaded');
    });

    imgElement.addEventListener('error', () => {
      imgElement.src = getFallbackImage(photo.title);
      mediaWrapper.classList.add('loaded');
    });

    // Handle Card Click (Open Lightbox)
    card.addEventListener('click', (e) => {
      // Ignore if clicking favorite button
      if (e.target.closest('.card-fav-btn')) return;
      openLightbox(index);
    });

    // Enter key opens lightbox when card is focused
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        openLightbox(index);
      }
    });

    // Favorite Button Click
    const favBtn = card.querySelector('.card-fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(photo.id, favBtn);
    });

    DOM.galleryGrid.appendChild(card);
  });
}

// Favorite Toggle
function toggleFavorite(id, btnElement) {
  if (AppState.favorites.has(id)) {
    AppState.favorites.delete(id);
    btnElement.classList.remove('active');
  } else {
    AppState.favorites.add(id);
    btnElement.classList.add('active');
  }
  localStorage.setItem('lumina_favorites', JSON.stringify([...AppState.favorites]));
}

// ==========================================================================
// 10. Lightbox Modal Functionality
// ==========================================================================
function openLightbox(index) {
  if (AppState.filteredImages.length === 0) return;

  AppState.lightboxCurrentIndex = index;
  AppState.isLightboxOpen = true;
  AppState.isZoomed = false;

  updateLightboxContent();

  DOM.lightboxModal.classList.add('active');
  DOM.lightboxModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Focus trap / focus to close button
  DOM.lbCloseBtn.focus();
}

function closeLightbox() {
  DOM.lightboxModal.classList.remove('active');
  DOM.lightboxModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  AppState.isLightboxOpen = false;
  AppState.isZoomed = false;
  resetZoom();
}

function updateLightboxContent() {
  const photo = AppState.filteredImages[AppState.lightboxCurrentIndex];
  if (!photo) return;

  // Reset Zoom
  resetZoom();

  // Show loading spinner
  DOM.lbSpinner.classList.remove('hidden');
  DOM.lbImage.classList.add('animating-in');

  // Update text metadata
  DOM.lbCurrentIndex.textContent = AppState.lightboxCurrentIndex + 1;
  DOM.lbTotalCount.textContent = AppState.filteredImages.length;
  DOM.lbTitle.textContent = photo.title;
  DOM.lbCategory.textContent = photo.category;
  DOM.lbDescription.textContent = photo.description;
  DOM.lbAuthor.textContent = photo.author;
  DOM.lbDownloadBtn.href = photo.url;

  // Load new image
  const highResImg = new Image();
  highResImg.src = photo.url;

  highResImg.onload = () => {
    DOM.lbImage.src = photo.url;
    DOM.lbImage.alt = `${photo.title} by ${photo.author}`;
    DOM.lbSpinner.classList.add('hidden');
    DOM.lbImage.classList.remove('animating-in');
  };

  highResImg.onerror = () => {
    DOM.lbImage.src = getFallbackImage(photo.title);
    DOM.lbSpinner.classList.add('hidden');
    DOM.lbImage.classList.remove('animating-in');
  };
}

function nextLightboxImage() {
  if (!AppState.isLightboxOpen) return;
  AppState.lightboxCurrentIndex = (AppState.lightboxCurrentIndex + 1) % AppState.filteredImages.length;
  updateLightboxContent();
}

function prevLightboxImage() {
  if (!AppState.isLightboxOpen) return;
  AppState.lightboxCurrentIndex = (AppState.lightboxCurrentIndex - 1 + AppState.filteredImages.length) % AppState.filteredImages.length;
  updateLightboxContent();
}

// Lightbox Zoom In/Out
function toggleLightboxZoom() {
  AppState.isZoomed = !AppState.isZoomed;
  const zoomInIcon = DOM.lbZoomBtn.querySelector('.zoom-in-icon');
  const zoomOutIcon = DOM.lbZoomBtn.querySelector('.zoom-out-icon');

  if (AppState.isZoomed) {
    DOM.lbImage.classList.add('zoomed');
    zoomInIcon.style.display = 'none';
    zoomOutIcon.style.display = 'block';
  } else {
    resetZoom();
  }
}

function resetZoom() {
  AppState.isZoomed = false;
  DOM.lbImage.classList.remove('zoomed');
  const zoomInIcon = DOM.lbZoomBtn.querySelector('.zoom-in-icon');
  const zoomOutIcon = DOM.lbZoomBtn.querySelector('.zoom-out-icon');
  if (zoomInIcon && zoomOutIcon) {
    zoomInIcon.style.display = 'block';
    zoomOutIcon.style.display = 'none';
  }
}

// Click image in lightbox to toggle zoom
DOM.lbImage.addEventListener('click', () => {
  toggleLightboxZoom();
});

// ==========================================================================
// 11. Keyboard Controls & Shortcuts
// ==========================================================================
function handleGlobalKeydown(e) {
  if (!AppState.isLightboxOpen) {
    // If pressing "/" while gallery is open, focus search
    if (e.key === '/' && document.activeElement !== DOM.searchInput) {
      e.preventDefault();
      DOM.searchInput.focus();
    }
    return;
  }

  switch (e.key) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowRight':
      nextLightboxImage();
      break;
    case 'ArrowLeft':
      prevLightboxImage();
      break;
    case 'z':
    case 'Z':
      toggleLightboxZoom();
      break;
    default:
      break;
  }
}

// ==========================================================================
// 12. Touch Gestures for Mobile Lightbox Navigation
// ==========================================================================
function handleTouchStart(e) {
  AppState.touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
  AppState.touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
}

function handleSwipeGesture() {
  const deltaX = AppState.touchEndX - AppState.touchStartX;
  const swipeThreshold = 50; // min swipe distance in px

  if (deltaX > swipeThreshold) {
    // Swiped Right -> Previous Image
    prevLightboxImage();
  } else if (deltaX < -swipeThreshold) {
    // Swiped Left -> Next Image
    nextLightboxImage();
  }
}
