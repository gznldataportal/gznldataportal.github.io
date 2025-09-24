// GZNL Lung Data Portal - Main JavaScript

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
    
    // Initialize all components
    initMobileMenu();
    initCounters();
    initSmoothScroll();
    initParallax();
    initInteractiveCards();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            // Animate icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }
}

// Animated Counter Function
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 2000; // Animation duration in milliseconds
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / (speed / 16); // 60fps
        let current = 0;
        
        counter.classList.add('counting');
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.innerText = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target.toLocaleString();
                counter.classList.remove('counting');
                
                // Add a subtle bounce effect at the end
                counter.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    counter.style.transform = 'scale(1)';
                }, 200);
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for triggering counter animation
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                if (counter.innerText === '0') { // Only animate once
                    animateCounter(counter);
                }
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Smooth Scroll for Navigation Links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for actual anchor links (not just "#")
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Parallax Effect for Hero Section
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    const lungBackground = document.querySelector('.lung-background');
    
    if (heroSection && lungBackground) {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            lungBackground.style.transform = `translateY(${rate}px) scale(${1 + scrolled * 0.0001})`;
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
}

// Interactive Card Effects
function initInteractiveCards() {
    const cards = document.querySelectorAll('.stat-card');
    
    cards.forEach(card => {
        // Mouse move effect
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
        
        // Click effect
        card.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Animate the card
            this.style.animation = 'cardClick 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
}

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(20, 184, 166, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
        width: 100px;
        height: 100px;
        top: 50%;
        left: 50%;
        margin-left: -50px;
        margin-top: -50px;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes cardClick {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Navigation Scroll Effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Press '/' to focus on search (if implemented)
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // Focus search input when implemented
    }
    
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
});

// CTA Button Click Handler
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a loading effect
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading Database...';
            this.disabled = true;
            
            // Simulate loading and redirect
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check mr-2"></i>Redirecting...';
                setTimeout(() => {
                    // Navigate to database page
                    window.location.href = '#database';
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 500);
            }, 1500);
        });
    }
});

// Performance monitoring
if ('IntersectionObserver' in window) {
    // Lazy load images if any are added
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Page visibility API to pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations
        document.querySelectorAll('.counter').forEach(counter => {
            counter.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('.counter').forEach(counter => {
            counter.style.animationPlayState = 'running';
        });
    }
});

// Live Dataset Counter Functionality
function initLiveCounters() {
    // Main live counter
    const liveCounters = document.querySelectorAll('.live-counter');
    const subCounters = document.querySelectorAll('.live-sub-counter');
    
    // Function to update a counter with random variation
    function updateCounter(counter) {
        const baseValue = parseInt(counter.getAttribute('data-base'));
        const variation = parseInt(counter.getAttribute('data-variation'));
        
        // Generate random change within variation range
        const change = Math.floor(Math.random() * variation) - variation/2;
        const newValue = baseValue + change;
        
        // Update the display with animation
        counter.style.transition = 'none';
        counter.style.transform = 'scale(1)';
        
        setTimeout(() => {
            counter.style.transition = 'all 0.3s ease';
            counter.style.transform = 'scale(1.02)';
            counter.textContent = newValue.toLocaleString();
            
            // Update base for next iteration
            counter.setAttribute('data-base', newValue);
        }, 50);
        
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
        }, 350);
    }
    
    // Update all live counters periodically
    function updateAllCounters() {
        liveCounters.forEach(counter => updateCounter(counter));
        
        // Update sub-counters less frequently
        if (Math.random() > 0.5) {
            subCounters.forEach(counter => {
                if (Math.random() > 0.6) {
                    updateCounter(counter);
                }
            });
        }
        
        // Update increment today
        const incrementToday = document.querySelector('.increment-today');
        if (incrementToday && Math.random() > 0.7) {
            const current = parseInt(incrementToday.textContent);
            incrementToday.textContent = current + Math.floor(Math.random() * 3) + 1;
        }
        
        // Update growth percentage
        const growthPercentage = document.querySelector('.growth-percentage');
        if (growthPercentage && Math.random() > 0.8) {
            const current = parseFloat(growthPercentage.textContent);
            const newGrowth = (current + (Math.random() * 0.2 - 0.1)).toFixed(1);
            growthPercentage.textContent = newGrowth + '%';
        }
    }
    
    // Start updating counters
    if (liveCounters.length > 0) {
        updateAllCounters(); // Initial update
        setInterval(updateAllCounters, 3000); // Update every 3 seconds
    }
}

// Activity Feed Functionality
function initActivityFeed() {
    const feed = document.getElementById('activity-feed');
    if (!feed) return;
    
    const activities = [
        { type: 'upload', icon: 'fa-upload', color: 'blue', dataset: 'Genomics', user: 'Research Lab A', files: 127 },
        { type: 'process', icon: 'fa-cogs', color: 'purple', dataset: 'Transcriptomics', user: 'Analysis Pipeline', files: 89 },
        { type: 'download', icon: 'fa-download', color: 'green', dataset: 'Clinical Data', user: 'Hospital Network B', files: 45 },
        { type: 'update', icon: 'fa-sync', color: 'orange', dataset: 'Proteomics', user: 'Data Team C', files: 234 },
        { type: 'validate', icon: 'fa-check-circle', color: 'teal', dataset: 'Metabolomics', user: 'QC System', files: 67 },
        { type: 'share', icon: 'fa-share-alt', color: 'indigo', dataset: 'Single-Cell', user: 'Consortium D', files: 156 },
        { type: 'analyze', icon: 'fa-chart-bar', color: 'pink', dataset: 'scATAC-seq', user: 'ML Pipeline', files: 98 },
        { type: 'archive', icon: 'fa-archive', color: 'gray', dataset: 'Historical Data', user: 'Archive System', files: 412 }
    ];
    
    function addActivityItem() {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-2 bg-gray-50 rounded-lg opacity-0 transition-all duration-500';
        item.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center">
                    <i class="fas ${activity.icon} text-${activity.color}-600 text-xs"></i>
                </div>
                <div>
                    <span class="text-sm font-medium text-gray-700">${activity.dataset}</span>
                    <span class="text-xs text-gray-500 ml-2">${activity.files} files</span>
                </div>
            </div>
            <div class="text-right">
                <div class="text-xs text-gray-500">${activity.user}</div>
                <div class="text-xs text-gray-400">${timestamp}</div>
            </div>
        `;
        
        // Add to feed
        feed.insertBefore(item, feed.firstChild);
        
        // Animate in
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 50);
        
        // Remove old items if too many
        while (feed.children.length > 5) {
            const lastChild = feed.lastChild;
            lastChild.style.opacity = '0';
            lastChild.style.transform = 'translateY(10px)';
            setTimeout(() => {
                if (lastChild.parentNode === feed) {
                    feed.removeChild(lastChild);
                }
            }, 500);
        }
    }
    
    // Add initial items
    for (let i = 0; i < 3; i++) {
        setTimeout(() => addActivityItem(), i * 200);
    }
    
    // Add new items periodically
    setInterval(addActivityItem, 5000);
}

// Initialize live features on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Previous initialization code...
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
    
    initMobileMenu();
    initCounters();
    initSmoothScroll();
    initParallax();
    initInteractiveCards();
    
    // New live features
    initLiveCounters();
    initActivityFeed();
});

// Log initialization
console.log('%c GZNL Lung Data Portal ', 
    'background: linear-gradient(135deg, #14b8a6, #06b6d4); color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('Portal initialized successfully ✅');
console.log('Version: 1.0.0');
console.log('Multi-Omics Data Platform Ready');