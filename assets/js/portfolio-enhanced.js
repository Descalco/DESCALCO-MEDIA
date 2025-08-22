// Enhanced Portfolio JavaScript - Interactive Animations and Effects
// Pedro Costa Portfolio Enhancement - Main Landing Page

class PortfolioEnhanced {
    constructor() {
        this.init();
    }

    init() {
        this.setupParticles();
        this.setupFloatingShapes();
        this.setupMouseFollower();
        this.setupEnhancedAnimations();
        this.setupInteractiveElements();
        this.setupScrollEffects();
        this.setupFormEnhancements();
        this.setupNavigationEffects();
        this.setupPerformanceOptimizations();
    }

    // Particle Canvas Background
    setupParticles() {
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        canvas.id = 'particleCanvas';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220, 38, 38, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Floating Shapes Background
    setupFloatingShapes() {
        const shapesContainer = document.createElement('div');
        shapesContainer.className = 'floating-shapes';
        document.body.appendChild(shapesContainer);
        
        // Create 5 floating shapes
        for (let i = 1; i <= 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            
            // Random properties for each shape
            const size = 40 + Math.random() * 80;
            const duration = 15 + Math.random() * 20;
            const delay = Math.random() * 5;
            
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
            shape.style.animationDuration = `${duration}s`;
            shape.style.animationDelay = `${delay}s`;
            
            // Random position
            shape.style.top = Math.random() * 100 + '%';
            shape.style.left = Math.random() * 100 + '%';
            
            shapesContainer.appendChild(shape);
        }
    }

    // Mouse Follower Effect
    setupMouseFollower() {
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;
        
        // Create follower element
        const follower = document.createElement('div');
        follower.className = 'mouse-follower';
        document.body.appendChild(follower);
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            
            requestAnimationFrame(animateFollower);
        };
        
        animateFollower();
        
        // Interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .slider--item, .work-request--options label, input[type="submit"]');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                follower.classList.add('active');
            });
            
            element.addEventListener('mouseleave', () => {
                follower.classList.remove('active');
            });
        });
    }

    // Enhanced Animations
    setupEnhancedAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe sections for fade-in animations
        document.querySelectorAll('.intro, .work, .about, .contact, .hire').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(section);
        });
    }

    // Interactive Elements Enhancement
    setupInteractiveElements() {
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('button, .cta, .other-works--button');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });

        // Enhanced slider interactions
        const sliderItems = document.querySelectorAll('.slider--item');
        
        sliderItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const image = item.querySelector('.slider--item-image');
                if (image) {
                    image.style.transform = 'scale(1.05)';
                    image.style.borderColor = 'rgba(220, 38, 38, 0.8)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const image = item.querySelector('.slider--item-image');
                if (image) {
                    image.style.transform = 'scale(1)';
                    image.style.borderColor = 'transparent';
                }
            });
        });

        // Enhanced navigation effects
        const navItems = document.querySelectorAll('.side-nav > li');
        
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(10px)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
            });
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effect for background elements
            const shapes = document.querySelectorAll('.floating-shape');
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.1;
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick);
    }

    // Form Enhancements
    setupFormEnhancements() {
        // Enhanced checkbox interactions
        const checkboxes = document.querySelectorAll('.work-request--options input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const label = checkbox.nextElementSibling;
                if (checkbox.checked) {
                    label.style.animation = 'checkboxGlow 2s ease-in-out infinite';
                } else {
                    label.style.animation = 'none';
                }
            });
        });

        // Enhanced input field interactions
        const inputs = document.querySelectorAll('.work-request--information input');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderBottomColor = '#dc2626';
                input.style.boxShadow = '0 2px 10px rgba(220, 38, 38, 0.3)';
                input.style.background = 'rgba(220, 38, 38, 0.05)';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.style.borderBottomColor = 'rgba(255, 255, 255, 0.3)';
                    input.style.boxShadow = 'none';
                    input.style.background = 'rgba(255, 255, 255, 0.02)';
                }
            });
            
            // Handle label animations
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });

        // Enhanced submit button
        const submitBtn = document.querySelector('input[type="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('mouseenter', () => {
                submitBtn.style.transform = 'translateY(-3px)';
                submitBtn.style.boxShadow = '0 10px 30px rgba(220, 38, 38, 0.5)';
            });
            
            submitBtn.addEventListener('mouseleave', () => {
                submitBtn.style.transform = 'translateY(0)';
                submitBtn.style.boxShadow = 'none';
            });
        }
    }

    // Navigation Effects
    setupNavigationEffects() {
        // Enhanced header logo
        const logo = document.querySelector('.header--logo');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                logo.style.transform = 'scale(1.05)';
                logo.style.filter = 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.5))';
            });
            
            logo.addEventListener('mouseleave', () => {
                logo.style.transform = 'scale(1)';
                logo.style.filter = 'none';
            });
        }

        // Enhanced navigation toggle
        const navToggle = document.querySelector('.header--nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('mouseenter', () => {
                navToggle.style.transform = 'scale(1.1)';
                const spans = navToggle.querySelectorAll('span, ::before, ::after');
                navToggle.style.color = '#dc2626';
            });
            
            navToggle.addEventListener('mouseleave', () => {
                navToggle.style.transform = 'scale(1)';
                navToggle.style.color = '#fff';
            });
        }

        // Enhanced outer navigation
        const outerNavItems = document.querySelectorAll('.outer-nav > li');
        
        outerNavItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(-10px) scale(1.05)';
                item.style.color = '#dc2626';
                item.style.textShadow = '0 0 20px rgba(220, 38, 38, 0.8)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0) scale(1)';
                item.style.color = '#fff';
                item.style.textShadow = 'none';
            });
        });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Reduce animations on mobile for better performance
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Disable heavy animations on mobile
            const shapes = document.querySelectorAll('.floating-shape');
            shapes.forEach(shape => {
                shape.style.display = 'none';
            });
            
            // Simplify particle system on mobile
            const canvas = document.getElementById('particleCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                // Reduce particle count for mobile
                // This would be handled in the particle creation loop
            }
        }

        // Intersection Observer for performance
        const performanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Enable animations when in view
                    entry.target.style.willChange = 'transform, opacity';
                } else {
                    // Disable animations when out of view
                    entry.target.style.willChange = 'auto';
                }
            });
        });

        // Observe animated elements
        document.querySelectorAll('.intro--banner h1, .about--banner h2, .slider--item-image').forEach(el => {
            performanceObserver.observe(el);
        });
    }

    // Enhanced Trust Section Interactions
    setupTrustSection() {
        const trustSection = document.querySelector('.trust-section');
        const logos = document.querySelectorAll('.logos-container img');
        
        if (trustSection) {
            trustSection.addEventListener('mouseenter', () => {
                logos.forEach((logo, index) => {
                    setTimeout(() => {
                        logo.style.transform = 'scale(1.1) translateY(-5px)';
                        logo.style.filter = 'brightness(0) invert(0.8) sepia(1) hue-rotate(-10deg) saturate(5)';
                    }, index * 100);
                });
            });
            
            trustSection.addEventListener('mouseleave', () => {
                logos.forEach(logo => {
                    logo.style.transform = 'scale(1) translateY(0)';
                    logo.style.filter = 'brightness(0) invert(1)';
                });
            });
        }
    }

    // Enhanced Showreel Placeholder
    setupShowreelEffects() {
        const placeholder = document.querySelector('.showreel-placeholder');
        
        if (placeholder) {
            placeholder.addEventListener('mouseenter', () => {
                placeholder.style.borderColor = 'rgba(220, 38, 38, 0.6)';
                placeholder.style.boxShadow = '0 0 30px rgba(220, 38, 38, 0.3)';
            });
            
            placeholder.addEventListener('mouseleave', () => {
                placeholder.style.borderColor = 'rgba(220, 38, 38, 0.2)';
                placeholder.style.boxShadow = 'none';
            });
        }
    }

    // Utility Functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Random number generator
    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Easing function
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the main portfolio page (not mystory)
    if (!document.body.classList.contains('mystory-enhanced')) {
        new PortfolioEnhanced();
    }
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// Export for potential use in other scripts
window.PortfolioEnhanced = PortfolioEnhanced;
