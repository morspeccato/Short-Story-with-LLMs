// Application State
let isLoggedIn = false;

// Login credentials (for demo purposes)
const DEMO_CREDENTIALS = {
    username: 'reader',
    password: 'storm123'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    showPage('homepage');
    updateUIForLoginStatus();
});

// Check if user is logged in from sessionStorage
function checkLoginStatus() {
    const loginStatus = sessionStorage.getItem('isLoggedIn');
    isLoggedIn = loginStatus === 'true';
}

// Update UI elements based on login status
function updateUIForLoginStatus() {
    const pages = ['', '-ch1', '-ch2'];
    
    pages.forEach(suffix => {
        const loginBtn = document.getElementById(`login-btn${suffix}`);
        const registerBtn = document.getElementById(`register-btn${suffix}`);
        const profileSection = document.getElementById(`profile-section${suffix}`);
        
        if (loginBtn && registerBtn && profileSection) {
            if (isLoggedIn) {
                loginBtn.classList.add('hidden');
                registerBtn.classList.add('hidden');
                profileSection.classList.remove('hidden');
            } else {
                loginBtn.classList.remove('hidden');
                registerBtn.classList.remove('hidden');
                profileSection.classList.add('hidden');
            }
        }
    });
}

// Page navigation functions
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the requested page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update UI for login status on page change
    updateUIForLoginStatus();
}

function navigateToHome() {
    showPage('homepage');
    // Scroll to top
    window.scrollTo(0, 0);
}

function navigateToChapter(chapterNumber) {
    const pageId = `chapter${chapterNumber}`;
    showPage(pageId);
    // Scroll to top
    window.scrollTo(0, 0);
}

function navigateToLogin() {
    showPage('loginpage');
    // Clear any previous error messages
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.classList.add('hidden');
    }
    // Clear form fields
    const form = document.querySelector('.login-form');
    if (form) {
        form.reset();
    }
    // Scroll to top
    window.scrollTo(0, 0);
}

// Login form handling
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');
    
    // Validate credentials
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        // Successful login
        isLoggedIn = true;
        sessionStorage.setItem('isLoggedIn', 'true');
        
        // Hide error message if visible
        errorMessage.classList.add('hidden');
        
        // Update UI and redirect to homepage
        updateUIForLoginStatus();
        showPage('homepage');
        
        // Show success feedback (optional)
        showNotification('Login successful!', 'success');
    } else {
        // Failed login
        errorMessage.classList.remove('hidden');
        
        // Clear password field
        document.getElementById('password').value = '';
        
        // Focus back to username field
        document.getElementById('username').focus();
    }
}

// Logout function
function logout() {
    isLoggedIn = false;
    sessionStorage.removeItem('isLoggedIn');
    updateUIForLoginStatus();
    
    // Show notification
    showNotification('Logged out successfully!', 'info');
    
    // Redirect to homepage
    showPage('homepage');
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-surface);
        color: var(--color-text);
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-family: var(--font-family-base);
        font-size: var(--font-size-base);
        max-width: 300px;
        word-wrap: break-word;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;
    
    // Apply type-specific styling
    if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
    } else if (type === 'info') {
        notification.style.borderColor = 'var(--color-info)';
        notification.style.backgroundColor = 'rgba(var(--color-info-rgb), 0.1)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.parentNode.removeChild(notification);
            }, 300);
        }
    }, 3000);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        updateUIForLoginStatus();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // ESC key to close modals or go back
    if (event.key === 'Escape') {
        const currentPageId = document.querySelector('.page.active').id;
        if (currentPageId === 'loginpage') {
            navigateToHome();
        }
    }
    
    // Enter key on chapter items
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('chapter-item')) {
            activeElement.click();
        }
    }
});

// Add focus management for accessibility
document.addEventListener('DOMContentLoaded', function() {
    // Make chapter items focusable
    const chapterItems = document.querySelectorAll('.chapter-item');
    chapterItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        
        // Add keyboard support
        item.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                item.click();
            }
        });
    });
    
    // Make logo focusable
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.setAttribute('tabindex', '0');
        
        // Add keyboard support
        logo.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigateToHome();
            }
        });
    });
});

// Handle form submission with Enter key
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    loginForm.dispatchEvent(new Event('submit'));
                }
            });
        });
    }
});

// Smooth scrolling for internal navigation
function smoothScrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Handle window resize events for responsive adjustments
window.addEventListener('resize', function() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(function() {
        // Any responsive adjustments can go here
        updateUIForLoginStatus();
    }, 250);
});

// Add loading states for better UX
function showLoadingState(element) {
    if (element) {
        const originalText = element.textContent;
        element.textContent = 'Loading...';
        element.disabled = true;
        
        // Return function to restore original state
        return function() {
            element.textContent = originalText;
            element.disabled = false;
        };
    }
}

// Enhanced chapter navigation with loading states
function navigateToChapterWithLoading(chapterNumber) {
    const currentPage = document.querySelector('.page.active');
    const loadingOverlay = document.createElement('div');
    
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    loadingOverlay.appendChild(spinner);
    document.body.appendChild(loadingOverlay);
    
    // Simulate loading time
    setTimeout(() => {
        document.body.removeChild(loadingOverlay);
        navigateToChapter(chapterNumber);
    }, 500);
}

// Initialize tooltips for better UX
function initializeTooltips() {
    const elements = document.querySelectorAll('[data-tooltip]');
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.className = 'tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--color-surface);
                color: var(--color-text);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                border: 1px solid var(--color-border);
                z-index: 1000;
                pointer-events: none;
                box-shadow: var(--shadow-md);
            `;
            
            document.body.appendChild(tooltip);
            
            // Position tooltip
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                document.body.removeChild(this.tooltipElement);
                this.tooltipElement = null;
            }
        });
    });
}

// Call initialization functions
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
});