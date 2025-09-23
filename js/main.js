// GZNL Lung Data Portal - Main JavaScript

// DOM elements and configuration
const config = {
    animationDuration: 2000, // 2 seconds for counter animation
    updateInterval: 30000,   // 30 seconds for data updates
    chartColors: {
        primary: ['#1e40af', '#0d9488', '#7c3aed', '#ec4899', '#f97316', '#10b981', '#eab308'],
        gradients: [
            'rgba(30, 64, 175, 0.8)',
            'rgba(13, 148, 136, 0.8)', 
            'rgba(124, 58, 237, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(234, 179, 8, 0.8)'
        ]
    }
};

// Sample data for multi-omics datasets
const dataStats = {
    omicsDistribution: {
        labels: ['Genomics', 'Transcriptomics', 'Proteomics', 'Metabolomics', 'Epigenomics', 'Metagenomics'],
        data: [89456, 156789, 34567, 12456, 8934, 5678],
        colors: config.chartColors.primary
    },
    diseaseCategories: {
        labels: ['COPD', 'Asthma', 'Lung Cancer', 'Pulmonary Fibrosis', 'COVID-19', 'Healthy Controls', 'Other'],
        data: [25.5, 18.3, 22.1, 12.8, 8.7, 10.2, 2.4],
        colors: config.chartColors.primary
    }
};

// Counter Animation Function
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const startValue = parseInt(start) || 0;
    const endValue = parseInt(end);
    const difference = endValue - startValue;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (difference * easeOutCubic));
        
        // Format large numbers with commas
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = endValue.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Initialize counter animations
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    // Create intersection observer for animation trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, 0, target, config.animationDuration);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Chart.js configuration
function createChart(canvasId, type, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#e5e7eb',
                    font: {
                        family: 'Inter',
                        size: 12
                    },
                    padding: 20,
                    usePointStyle: true
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#e5e7eb',
                bodyColor: '#e5e7eb',
                borderColor: 'rgba(13, 148, 136, 0.5)',
                borderWidth: 1,
                cornerRadius: 8,
                titleFont: {
                    family: 'Inter',
                    size: 14,
                    weight: 600
                },
                bodyFont: {
                    family: 'Inter',
                    size: 12
                }
            }
        }
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return new Chart(ctx, {
        type: type,
        data: data,
        options: mergedOptions
    });
}

// Initialize Omics Distribution Chart
function initOmicsChart() {
    const data = {
        labels: dataStats.omicsDistribution.labels,
        datasets: [{
            data: dataStats.omicsDistribution.data,
            backgroundColor: dataStats.omicsDistribution.colors.map((color, index) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, color + '80');
                return gradient;
            }),
            borderColor: dataStats.omicsDistribution.colors,
            borderWidth: 2,
            hoverBorderWidth: 3,
            hoverOffset: 10
        }]
    };
    
    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed.toLocaleString();
                        return `${label}: ${value} samples`;
                    }
                }
            }
        }
    };
    
    return createChart('omicsChart', 'doughnut', data, options);
}

// Initialize Disease Categories Chart
function initDiseaseChart() {
    const data = {
        labels: dataStats.diseaseCategories.labels,
        datasets: [{
            data: dataStats.diseaseCategories.data,
            backgroundColor: config.chartColors.gradients,
            borderColor: config.chartColors.primary,
            borderWidth: 2
        }]
    };
    
    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 30,
                ticks: {
                    color: '#e5e7eb',
                    font: {
                        family: 'Inter'
                    },
                    callback: function(value) {
                        return value + '%';
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            x: {
                ticks: {
                    color: '#e5e7eb',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.parsed.y}% of datasets`;
                    }
                }
            }
        }
    };
    
    return createChart('diseaseChart', 'bar', data, options);
}

// Update last updated timestamp
function updateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    document.getElementById('lastUpdate').textContent = `Last updated: ${dateString} ${timeString}`;
}

// Simulate real-time data updates
function simulateDataUpdates() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const currentValue = parseInt(counter.textContent.replace(/,/g, ''));
        const baseValue = parseInt(counter.dataset.target);
        
        // Random small increment (0.1% to 2% of base value)
        const increment = Math.floor(Math.random() * (baseValue * 0.02 - baseValue * 0.001) + baseValue * 0.001);
        const newValue = currentValue + increment;
        
        // Update the counter with animation
        animateCounter(counter, currentValue, newValue, 1000);
        
        // Update the data target for next update
        counter.dataset.target = newValue;
    });
    
    updateTimestamp();
}

// Initialize navigation interactions
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Set active link (currently on Home)
    navLinks[0].classList.add('active');
    
    // Add click handlers for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Initialize page interactions
function initInteractions() {
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
    
    // Add click handlers for quick access buttons
    const quickAccessBtns = document.querySelectorAll('.quick-access-btn');
    quickAccessBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Error handling for chart initialization
function handleChartError(chartName, error) {
    console.error(`Error initializing ${chartName}:`, error);
    const canvas = document.getElementById(chartName);
    if (canvas) {
        const parent = canvas.parentElement;
        parent.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-400">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle text-3xl mb-4"></i>
                    <p>Chart loading error</p>
                </div>
            </div>
        `;
    }
}

// Main initialization function
function init() {
    try {
        // Initialize counters with intersection observer
        initCounters();
        
        // Initialize charts when DOM is ready
        setTimeout(() => {
            try {
                initOmicsChart();
                initDiseaseChart();
            } catch (error) {
                handleChartError('charts', error);
            }
        }, 500);
        
        // Initialize navigation
        initNavigation();
        
        // Initialize interactions
        initInteractions();
        
        // Set initial timestamp
        updateTimestamp();
        
        // Start periodic updates
        setInterval(simulateDataUpdates, config.updateInterval);
        
        console.log('GZNL Lung Data Portal initialized successfully');
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}