// portfolio-dynamic.js
// This file handles the dynamic loading and management of portfolio projects

class PortfolioManager {
    constructor() {
      this.projects = [];
      this.staticProjects = [];
      this.dynamicProjects = [];
      this.currentFilter = 'all';
      this.isLoading = false;
      
      // Initialize on DOM load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
      } else {
        this.init();
      }
    }
  
    async init() {
      this.setupEventListeners();
      await this.loadAllProjects();
      this.setupIntersectionObserver();
    }
  
    setupEventListeners() {
      // Filter buttons (if you add them later)
      const filterButtons = document.querySelectorAll('[data-filter]');
      filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const filter = e.target.dataset.filter;
          this.filterProjects(filter);
        });
      });
  
      // Search functionality (if you add it later)
      const searchInput = document.querySelector('#portfolio-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchProjects(e.target.value);
        });
      }
    }
  
    async loadAllProjects() {
      const loadingState = document.getElementById('loading-state');
      const errorState = document.getElementById('error-state');
      const portfolioGrid = document.getElementById('portfolio-grid');
  
      try {
        this.isLoading = true;
        
        // Show loading state
        if (loadingState) loadingState.style.display = 'block';
        if (errorState) errorState.style.display = 'none';
        if (portfolioGrid) portfolioGrid.style.display = 'none';
  
        // Load static projects (from your existing work)
        this.staticProjects = this.getStaticProjects();
  
        // Try to load dynamic projects from API
        try {
          const response = await fetch('/api/projects');
          if (response.ok) {
            this.dynamicProjects = await response.json();
            console.log(`Loaded ${this.dynamicProjects.length} dynamic projects from API`);
          } else {
            console.warn('API response not ok:', response.status);
            this.dynamicProjects = [];
          }
        } catch (apiError) {
          console.warn('API not available, using only static projects:', apiError.message);
          this.dynamicProjects = [];
        }
  
        // Combine and sort projects
        this.projects = [...this.staticProjects, ...this.dynamicProjects];
        this.sortProjects();
  
        // Render projects
        this.renderProjects();
  
        // Show portfolio grid
        if (loadingState) loadingState.style.display = 'none';
        if (portfolioGrid) {
          portfolioGrid.style.display = 'grid';
          this.animateProjectsIn();
        }
  
        this.isLoading = false;
  
      } catch (error) {
        console.error('Error loading projects:', error);
        this.showError('Failed to load projects. Please try again later.');
        this.isLoading = false;
      }
    }
  
    getStaticProjects() {
      return [
        {
          id: 'sof-week-static',
          title: 'SOF WEEK: Motion Design for Military Events',
          year: 2025,
          category: 'Motion Design',
          description: 'Final degree project aiming to modernize the visual identity of SOF Week, an event promoted by the Special Operations Forces Center, through strategic branding and motion design.',
          tags: ['Motion Design', 'Branding', 'Military Event', 'Final Project'],
          coverMedia: 'assets/img/OUTROS/SOF-WEEK.mp4',
          mediaType: 'video',
          externalLink: 'SOF-WEEK.html',
          featured: true,
          isStatic: true
        },
        {
          id: 'guisado-static',
          title: 'GUISADO - 3D SHORT MOVIE',
          year: 2025,
          category: '3D Animation',
          description: '"GUISADO" is a 4-minute 3D animated short film exploring themes of loneliness, superficial relationships, and the illusion of happiness. Created as part of the Animation III curriculum at ESMAD, this atmospheric piece combines motion capture performance with stylized 3D animation to tell a surreal gothic tale.',
          tags: ['3D Animation', 'Character Animation', 'Motion Capture'],
          coverMedia: 'assets/img/OUTROS/GUISADO-VIDEO.mp4#t=3',
          mediaType: 'video',
          externalLink: 'GUISADO.html',
          featured: true,
          isStatic: true
        },
        {
          id: 'cidade-futuro-static',
          title: 'AMBIVALÊNCIA - CITY OF THE FUTURE',
          year: 2023,
          category: '2D Animation',
          description: '"Ambivalência" is an animation/installation created for large-scale projection at the Alfândega Congress Center in Porto. Developed as part of the "Multimedia I" course at ESMAD in collaboration with OCUBO, this visually striking project explores the contrast between utopian dreams and dystopian reality through a young girl\'s journey.',
          tags: ['2D Animation', 'Character Animation', 'Video Mapping'],
          coverMedia: 'assets/img/OUTROS/pa_-_immersivus_x_a_cidade_do_futuro (1080p) (online-video-cutter.com).mp4',
          mediaType: 'video',
          externalLink: 'CidadeDoFuturo.html',
          featured: true,
          isStatic: true
        },
        {
          id: 'motion-jam-static',
          title: '"A Carne que Anda" — Winner of MOTION JAM 2025',
          year: 2025,
          category: 'Motion Design',
          description: 'Challenged to create an animation under the themes The Admirable Grotesque, Elevator, and Flash, we won 1st place at MOTION JAM 2025 with our project \'A Carne que Anda\' (The Flesh That Walks), as voted by renowned Portuguese motion design jurors. Developed in 48 hours as team NOUSHOE (with Nuno Faria), the animation blends frame-by-frame techniques, 2.5D animation in After Effects, and a narrative voice-over',
          tags: ['Award Winning', 'Motion Design', '48H CHALLENGE'],
          coverMedia: 'assets/img/OUTROS/Noushoe.mp4',
          mediaType: 'video',
          externalLink: 'https://youtu.be/P0jaOjuQ654',
          featured: true,
          isStatic: true
        },
        {
          id: 'limifield-static',
          title: 'Limifield - Corporate Video',
          year: 2024,
          category: 'Corporate Video',
          description: 'Corporate video created for Limifield.LDA, a company specializing in the import and distribution of IT equipment since 2007. The project highlights the company\'s exclusive brands and extensive product portfolio, conveying professionalism and trust. Featuring dynamic motion design, the video strengthens the brand\'s visual identity and market presence in the tech industry.',
          tags: ['Corporate Video', 'Motion Design', 'Business Communication'],
          coverMedia: 'assets/img/OUTROS/LIMIFIELD-INSTITUCIONAL.mp4',
          mediaType: 'video',
          externalLink: 'https://www.youtube.com/watch?v=ug4wro36A-o&t=2s',
          featured: false,
          isStatic: true
        },
        {
          id: 'type-ad-static',
          title: 'Type in Motion: Corporate Ad for Limifield',
          year: 2023,
          category: 'Motion Design',
          description: 'Full kinetic typography ad created for Limifield.LDA to attract new business partners. The project blends animated type, voice-over, and minimalist motion design to deliver a clear and compelling message about partnership opportunities with the brand.',
          tags: ['Kinetic Type', 'Business Communication', 'Motion Design'],
          coverMedia: 'assets/img/OUTROS/limifield-type-ad.mp4',
          mediaType: 'video',
          externalLink: 'https://www.youtube.com/watch?v=jBuUN4bA3YI',
          featured: false,
          isStatic: true
        },
        {
          id: 'let-it-happen-static',
          title: 'LET IT HAPPEN - EXPERIMENTAL ANIMATION',
          year: 2022,
          category: 'Animation',
          description: 'This experimental short film explores themes of anxiety, transformation, and acceptance — visually inspired by the song "Let It Happen" by Tame Impala. Structured in three emotional phases (Stress, Flow, and Overcoming), the film animates the inner struggles of someone learning to let go and embrace change.',
          tags: ['Frame by frame', 'Motion Design', 'Animation'],
          coverMedia: 'assets/img/OUTROS/LETITHAPPEN.mp4',
          mediaType: 'video',
          externalLink: 'LetItHappen.html',
          featured: false,
          isStatic: true
        },
        {
          id: 'queen-static',
          title: 'Experimental Animation – QUEEN',
          year: 2022,
          category: 'Animation',
          description: 'METAMORPHOSIS is a hand-drawn frame-by-frame animation exploring transformation and identity. Created using traditional animation techniques with modern digital tools, this piece delves into the concept of personal evolution and the fluid nature of self-perception through abstract visual storytelling.',
          tags: ['Animation', 'Frame-By-Frame', 'Adobe Animate'],
          coverMedia: 'assets/img/OUTROS/queen.mp4',
          mediaType: 'video',
          externalLink: 'https://youtu.be/xAjgsekjEcI',
          featured: false,
          isStatic: true
        },
        {
          id: 'kinetic-duality-static',
          title: 'KINETIC DUALITY: Interactive Art Installation',
          year: 2022,
          category: 'Interactive Art',
          description: 'KINETIC DUALITY is an interactive art installation exploring the stark contrast between life and death through projected posters, a central mirror, and Kinect sensors. Viewers trigger opposing animations and sounds. Developed with TouchDesigner, Madmapper, and After Effects.',
          tags: ['Motion Design', 'Kinetic Type', 'Installation'],
          coverMedia: 'assets/img/OUTROS/KINETIC DUALITY.mp4',
          mediaType: 'video',
          externalLink: 'https://www.youtube.com/watch?v=o8OGEqCWxZ8',
          featured: false,
          isStatic: true
        },
        {
          id: 'desistir-static',
          title: 'DESISTIR - CONCEPTUAL BOOK',
          year: 2024,
          category: 'Graphic Design',
          description: '"DESISTIR" is a book that explores a teenager\'s entry into university life. Despite initially being motivated, João quickly realizes the challenge and difficulties of the path he has chosen.',
          tags: ['Design', 'Graphic Design', 'Book'],
          coverMedia: 'assets/img/DESISTIR/DESISTIR-CAPA2.jpg',
          mediaType: 'image',
          externalLink: 'DESISTIR.html',
          featured: false,
          isStatic: true
        },
        {
          id: 'videoclip-static',
          title: 'Empresta o Verbo Amar',
          year: 2022,
          category: 'Music Video',
          description: 'Music video for musician Luis Sequeira produced as a student exercise for college at Escola Superior de Media Artes E Design.',
          tags: ['VideoClip', 'Producing', 'Storytelling'],
          coverMedia: 'assets/img/OUTROS/EmprestaOVerboAmar.mp4',
          mediaType: 'video',
          externalLink: 'https://www.youtube.com/watch?v=BgKK0P0Rjyo',
          featured: false,
          isStatic: true
        }
      ];
    }
  
    sortProjects() {
      this.projects.sort((a, b) => {
        // Featured projects first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        // Then by year (newest first)
        if (a.year !== b.year) return b.year - a.year;
        
        // Finally by title alphabetically
        return a.title.localeCompare(b.title);
      });
    }
  
    filterProjects(category) {
      this.currentFilter = category;
      const filteredProjects = category === 'all' 
        ? this.projects 
        : this.projects.filter(project => 
            project.category.toLowerCase() === category.toLowerCase()
          );
      
      this.renderProjects(filteredProjects);
      this.animateProjectsIn();
    }
  
    searchProjects(query) {
      if (!query.trim()) {
        this.renderProjects();
        return;
      }
  
      const searchTerm = query.toLowerCase();
      const filteredProjects = this.projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        project.category.toLowerCase().includes(searchTerm)
      );
  
      this.renderProjects(filteredProjects);
      this.animateProjectsIn();
    }
  
    renderProjects(projectsToRender = this.projects) {
      const portfolioGrid = document.getElementById('portfolio-grid');
      if (!portfolioGrid) return;
  
      portfolioGrid.innerHTML = '';
  
      if (projectsToRender.length === 0) {
        portfolioGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: #888;">
            <p>No projects found matching your criteria.</p>
          </div>
        `;
        return;
      }
  
      projectsToRender.forEach((project, index) => {
        const projectElement = this.createProjectElement(project);
        projectElement.style.animationDelay = `${index * 0.1}s`;
        portfolioGrid.appendChild(projectElement);
      });
    }
  
    createProjectElement(project) {
      const projectDiv = document.createElement('div');
      projectDiv.className = 'project-item';
      projectDiv.setAttribute('data-category', project.category.toLowerCase());
      projectDiv.setAttribute('data-year', project.year);
      
      // Create media element
      const mediaElement = this.createMediaElement(project);
      
      // Create featured badge
      const featuredBadge = project.featured ? 
        '<div class="featured-badge">Featured</div>' : '';
      
      // Build project HTML
      projectDiv.innerHTML = `
        ${featuredBadge}
        <div class="project-meta">
          <h3>${this.escapeHtml(project.title)}</h3>
          <div class="project-year">${project.year}</div>
        </div>
        <div class="project-overlay">
          <div class="project-title">${this.escapeHtml(project.title)}</div>
          <div class="project-description">
            ${this.escapeHtml(project.description)}
          </div>
          <div class="project-tags">
            ${project.tags.map(tag => 
              `<span class="project-tag">${this.escapeHtml(tag)}</span>`
            ).join('')}
          </div>
          <a href="${project.externalLink || '#'}" 
             ${project.externalLink && project.externalLink.startsWith('http') ? 'target="_blank"' : ''} 
             class="project-link">View Project</a>
        </div>
      `;
  
      // Insert media element at the beginning
      projectDiv.insertBefore(mediaElement, projectDiv.firstChild);
  
      return projectDiv;
    }
  
    createMediaElement(project) {
      const isVideo = project.mediaType === 'video' || 
                     (project.coverMedia && this.isVideoFile(project.coverMedia));
  
      if (isVideo) {
        const videoElement = document.createElement('video');
        videoElement.className = 'project-media';
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.playsInline = true;
        videoElement.loading = 'lazy';
        
        const source = document.createElement('source');
        source.src = this.getMediaUrl(project);
        source.type = 'video/mp4';
        videoElement.appendChild(source);
  
        // Error handling for videos
        videoElement.onerror = () => {
          console.warn(`Failed to load video for project: ${project.title}`);
          // Replace with placeholder or fallback image
          const img = document.createElement('img');
          img.className = 'project-media';
          img.src = 'assets/img/placeholder-video.jpg';
          img.alt = project.title;
          videoElement.parentNode?.replaceChild(img, videoElement);
        };
  
        return videoElement;
      } else {
        const imgElement = document.createElement('img');
        imgElement.className = 'project-media';
        imgElement.src = this.getMediaUrl(project);
        imgElement.alt = project.title;
        imgElement.loading = 'lazy';
  
        // Error handling for images
        imgElement.onerror = () => {
          console.warn(`Failed to load image for project: ${project.title}`);
          imgElement.src = 'assets/img/placeholder-image.jpg';
        };
  
        return imgElement;
      }
    }
  
    getMediaUrl(project) {
      if (project.isStatic) {
        return project.coverMedia;
      } else {
        return project.coverMedia || `/api/projects/${project.id}/cover`;
      }
    }
  
    isVideoFile(filename) {
      const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.ogv'];
      return videoExtensions.some(ext => filename.toLowerCase().includes(ext));
    }
  
    animateProjectsIn() {
      const projectItems = document.querySelectorAll('.project-item');
      
      projectItems.forEach((item, index) => {
        item.classList.remove('loaded');
        setTimeout(() => {
          item.classList.add('loaded');
        }, index * 100);
      });
    }
  
    setupIntersectionObserver() {
      // Lazy loading for better performance
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const media = entry.target.querySelector('video, img');
              if (media && media.dataset.src) {
                media.src = media.dataset.src;
                media.removeAttribute('data-src');
                observer.unobserve(entry.target);
              }
            }
          });
        });
  
        // Observer will be set up when projects are rendered
        this.observer = observer;
      }
    }
  
    showError(message) {
      const loadingState = document.getElementById('loading-state');
      const errorState = document.getElementById('error-state');
      const portfolioGrid = document.getElementById('portfolio-grid');
  
      if (loadingState) loadingState.style.display = 'none';
      if (portfolioGrid) portfolioGrid.style.display = 'none';
      
      if (errorState) {
        errorState.style.display = 'block';
        const errorText = errorState.querySelector('p');
        if (errorText) errorText.textContent = message;
      }
    }
  
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  
    // Public method to refresh projects (useful for admin panels)
    async refresh() {
      if (this.isLoading) return;
      await this.loadAllProjects();
    }
  
    // Public method to add a new project dynamically
    addProject(project) {
      project.id = project.id || `dynamic-${Date.now()}`;
      this.projects.unshift(project); // Add to beginning
      this.sortProjects();
      this.renderProjects();
      this.animateProjectsIn();
    }
  
    // Public method to remove a project
    removeProject(projectId) {
      this.projects = this.projects.filter(p => p.id !== projectId);
      this.renderProjects();
    }
  }
  
  // Initialize the portfolio manager
  const portfolioManager = new PortfolioManager();
  
  // Make it globally available for debugging or external use
  window.portfolioManager = portfolioManager;