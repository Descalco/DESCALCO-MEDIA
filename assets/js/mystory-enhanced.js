// Enhanced MyStory JavaScript - Interactive Animations and Effects
// Pedro Costa Portfolio Enhancement

class MyStoryEnhanced {
    constructor() {
        this.init();
    }

    init() {
        this.setupParticles();
        this.setupTypingAnimation();
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupTimelineAnimations();
        this.setupSoftwareOrbit();
        this.setupPersonalityCards();
        this.setupFloatingShapes();
        this.calculateAge();
        this.setupMouseFollower();
        this.setupSmoothScrolling();
    }

    // Dynamic Age Calculator
    calculateAge() {
        const birthDate = new Date(2003, 0, 6); // January 6, 2003
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        document.getElementById('dynamicAge').textContent = age;
    }

    // Particle Canvas Background
    setupParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        
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

    // Typing Animation
    setupTypingAnimation() {
        const texts = [
            "Motion Designer & Digital Artist",
            "Creating engaging visual experiences",
            "8+ years of creative passion",
            "From sketches to stunning visuals",
            "Ready to bring your vision to life"
        ];
        
        const typingElement = document.getElementById('typingText');
        if (!typingElement) return;
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;
        
        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let speed = isDeleting ? deleteSpeed : typeSpeed;
            
            if (!isDeleting && charIndex === currentText.length) {
                speed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
            
            setTimeout(type, speed);
        };
        
        type();
    }

    // Scroll-triggered Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
        
        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
        
        // Observe personality cards
        document.querySelectorAll('.personality-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Counter Animations
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Timeline Animations
    setupTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('timeline-animate');
                }
            });
        }, { threshold: 0.5 });
        
        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Software Orbit Animation
    setupSoftwareOrbit() {
        const softwareItems = document.querySelectorAll('.software-item');
        const categoryBtns = document.querySelectorAll('.category-btn');
        
        // Position items randomly in orbit with more variation
        const positionItems = () => {
            const centerX = 200;
            const centerY = 200;
            const baseRadius = 150;
            
            softwareItems.forEach((item, index) => {
                // Add randomness to angle and radius for more organic movement
                const randomAngleOffset = (Math.random() - 0.5) * 0.5;
                const randomRadiusOffset = (Math.random() - 0.5) * 60;
                
                const angle = (index / softwareItems.length) * 2 * Math.PI + randomAngleOffset;
                const radius = baseRadius + randomRadiusOffset;
                
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                item.style.left = `${x}px`;
                item.style.top = `${y}px`;
                
                // Add random animation delays and durations for more chaotic movement
                const randomDelay = Math.random() * 5;
                const randomDuration = 15 + Math.random() * 20; // 15-35 seconds
                const randomDirection = Math.random() > 0.5 ? 'normal' : 'reverse';
                
                item.style.animationDelay = `${randomDelay}s`;
                item.style.animationDuration = `${randomDuration}s`;
                item.style.animationDirection = randomDirection;
                
                // Add random transform origin for more varied rotation
                const randomOriginX = 40 + Math.random() * 20; // 40-60%
                const randomOriginY = 40 + Math.random() * 20; // 40-60%
                item.style.transformOrigin = `${randomOriginX}% ${randomOriginY}%`;
            });
        };
        
        // Filter functionality
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter items
                softwareItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'flex';
                        item.classList.add('software-show');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('software-show');
                    }
                });
            });
        });
        
        // Hover effects
        softwareItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.classList.add('software-hover');
                // Pause orbit animation on hover
                item.style.animationPlayState = 'paused';
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove('software-hover');
                // Resume orbit animation
                item.style.animationPlayState = 'running';
            });
        });
        
        positionItems();
    }

    // Personality Cards Flip Animation
    setupPersonalityCards() {
        const cards = document.querySelectorAll('.personality-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
            
            // Auto-flip on scroll (optional)
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('card-animate');
                        }, Math.random() * 500);
                    }
                });
            });
            
            cardObserver.observe(card);
        });
    }

    // Floating Shapes Animation
    setupFloatingShapes() {
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            // Random initial position
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            
            // Random animation duration
            const duration = 10 + Math.random() * 20;
            shape.style.animationDuration = `${duration}s`;
            shape.style.animationDelay = `${index * 2}s`;
        });
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
        const interactiveElements = document.querySelectorAll('a, button, .software-item, .personality-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                follower.classList.add('follower-active');
            });
            
            element.addEventListener('mouseleave', () => {
                follower.classList.remove('follower-active');
            });
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                document.getElementById('timeline').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
        
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.getElementById('hero');
            
            if (hero) {
                const speed = scrolled * 0.5;
                hero.style.transform = `translateY(${speed}px)`;
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MyStoryEnhanced();
});

// Additional utility functions
const utils = {
    // Random number generator
    random: (min, max) => Math.random() * (max - min) + min,
    
    // Easing functions
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    
    // Debounce function
    debounce: (func, wait) => {
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
};

// Export for potential use in other scripts
window.MyStoryUtils = utils;
