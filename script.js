// Global state and constants
const MOBILE_MENU_ID = 'mobileSidebar';
const MOBILE_BTN_ID = 'mobileMenuBtn';
const CLOSE_BTN_ID = 'closeSidebarBtn';
const OVERLAY_ID = 'sidebarOverlay';
const SIGNUP_MODAL_ID = 'signupModal';
const SIGNUP_BTNS = ['signUpBtn', 'mobileSignUpBtn', 'finalSignUpBtn'];
const CLOSE_MODAL_ID = 'closeModal';
const TRANSITION_DURATION = 300; // ms for CSS transition
const PRIZE_MONEY_ELEMENT_ID = 'prizeMoneyCounter'; 
const FINAL_PRIZE_AMOUNT = 45600000000; 

// DOM Elements
const mobileSidebar = document.getElementById(MOBILE_MENU_ID);
const mobileMenuBtn = document.getElementById(MOBILE_BTN_ID);
const closeSidebarBtn = document.getElementById(CLOSE_BTN_ID);
const sidebarOverlay = document.getElementById(OVERLAY_ID);
const signupModal = document.getElementById(SIGNUP_MODAL_ID);
const closeModalBtn = document.getElementById(CLOSE_MODAL_ID);
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav a[href^="#"], #' + MOBILE_MENU_ID + ' a[href^="#"]');
const allSignUpButtons = SIGNUP_BTNS.map(id => document.getElementById(id)).filter(el => el !== null);
const prizeMoneyElement = document.getElementById(PRIZE_MONEY_ELEMENT_ID); 

// Variables to track if the counters have run
let prizeCounterExecuted = false;

// --- Core Utility Functions ---

function toggleMobileMenu(isOpen) {
    if (isOpen) {
        mobileSidebar.classList.remove('translate-x-full');
        sidebarOverlay.classList.remove('hidden');
        document.body.style.overflowY = 'hidden';
    } else {
        mobileSidebar.classList.add('translate-x-full');
        setTimeout(() => {
            sidebarOverlay.classList.add('hidden');
        }, TRANSITION_DURATION);
        document.body.style.overflowY = 'auto';
    }
}

function toggleSignupModal(isOpen) {
    if (isOpen) {
        signupModal.classList.remove('hidden');
        document.body.style.overflowY = 'hidden';
    } else {
        signupModal.classList.add('hidden');
        document.body.style.overflowY = 'auto';
    }
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const navHeight = nav.offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        if (!mobileSidebar.classList.contains('translate-x-full')) {
            toggleMobileMenu(false);
        }
    }
}

// --- Animation & Observer Logic ---

/**
 * Adds initial hidden classes for all animatable elements.
 */
function initializeAnimations() {
    const animatableElements = document.querySelectorAll(
        // Elements to animate on scroll
        'section:not(.hero) h2, section:not(.hero) p, section:not(.hero) h3, .game-card, .participant-card, section:not(.hero) button'
    );
    animatableElements.forEach(el => {
        el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-1000', 'ease-out');
    });

    if (prizeMoneyElement) {
        prizeMoneyElement.textContent = formatCurrency(0);
        prizeMoneyElement.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-1000', 'ease-out');
    }
}

/**
 * Creates an IntersectionObserver to detect when elements enter the viewport.
 */
function createIntersectionObserver(selector) {
    const elements = document.querySelectorAll(selector);
    const options = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.remove('opacity-0', 'translate-y-4');
                    
                    if (entry.target.id === PRIZE_MONEY_ELEMENT_ID && !prizeCounterExecuted) {
                        animatePrizeCounter(FINAL_PRIZE_AMOUNT);
                        prizeCounterExecuted = true;
                    }
                    
                    observer.unobserve(entry.target);
                }, index * 100);
            }
        });
    }, options);

    elements.forEach(el => observer.observe(el));
}

function formatCurrency(number) {
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0
    }).replace('KRW', '₩');
}

function animatePrizeCounter(finalValue) {
    if (!prizeMoneyElement) return;

    const duration = 2000;
    const start = 0;
    let startTime;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        const currentValue = Math.floor(percentage * (finalValue - start) + start);

        prizeMoneyElement.textContent = formatCurrency(currentValue);

        if (percentage < 1) {
            window.requestAnimationFrame(step);
        } else {
            prizeMoneyElement.textContent = formatCurrency(finalValue);
        }
    }

    window.requestAnimationFrame(step);
}

// --- General Scroll Functionality ---

function handleHeaderStyleOnScroll() {
    if (!nav) return;

    if (window.scrollY > 50) {
        nav.classList.add('shadow-lg', 'border-b', 'border-red-600/50');
    } else {
        nav.classList.remove('shadow-lg', 'border-b', 'border-red-600/50');
    }
}

// --- Event Listeners Initialization ---

function initEventListeners() {
    // 1. Mobile Menu Listeners
    mobileMenuBtn?.addEventListener('click', () => toggleMobileMenu(true));
    closeSidebarBtn?.addEventListener('click', () => toggleMobileMenu(false));
    sidebarOverlay?.addEventListener('click', () => toggleMobileMenu(false));

    // 2. Modal Listeners
    allSignUpButtons.forEach(button => {
        button.addEventListener('click', () => toggleSignupModal(true));
    });
    closeModalBtn?.addEventListener('click', () => toggleSignupModal(false));
    signupModal?.addEventListener('click', (e) => {
        if (e.target.id === SIGNUP_MODAL_ID) {
            toggleSignupModal(false);
        }
    });

    // 3. Smooth Scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });

    // 4. Form Submission
    const signupForm = signupModal?.querySelector('form');
    signupForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Application Submitted! Processing player details...');
        alert('Application received. A recruiter will contact you if you are selected for the next round.');
        toggleSignupModal(false);
        this.reset();
    });
    
    // 5. Participant Card Interaction
    const participantCards = document.querySelectorAll('.participant-card');
    participantCards.forEach(card => {
        card.addEventListener('click', () => {
            const playerNum = card.querySelector('h3').textContent;
            console.log(`Player profile clicked: ${playerNum}. Detailed stats hidden by the Front Man.`);
        });
    });

    // 6. Global Scroll Listener 
    window.addEventListener('scroll', throttle(() => {
        handleNavigationHighlight();
        handleHeaderStyleOnScroll();
    }, 100));

    // 7. Easter Egg Key Press
    document.addEventListener('keydown', handleEasterEgg);
}

/**
 * Handles the logic for active navigation link highlighting.
 */
function handleNavigationHighlight() {
    const currentScroll = window.scrollY;
    const navHeight = nav.offsetHeight;
    let foundActive = false;

    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop - navHeight;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (currentScroll >= sectionTop - 100 && currentScroll < sectionBottom) {
            navLinks.forEach(link => link.classList.remove('text-red-500'));
            document.querySelectorAll(`nav a[href="#${sectionId}"], #${MOBILE_MENU_ID} a[href="#${sectionId}"]`).forEach(link => {
                link.classList.add('text-red-500');
            });
            foundActive = true;
        }
    });

    // Special handling for 'HOME' if no other section is active
    if (!foundActive && currentScroll < (document.getElementById('games')?.offsetTop - navHeight || 100)) {
        navLinks.forEach(link => link.classList.remove('text-red-500'));
        document.querySelectorAll('nav a[href="#"]').forEach(link => link.classList.add('text-red-500'));
    }
}

function handleEasterEgg(e) {
    if (e.key.toLowerCase() === 's') {
        console.warn('--- EASTER EGG ACTIVATED ---');
        console.warn('Recruiter detected! Preparing player files...');
        console.warn('Welcome to the SQUID GAME, Player 457.');
        console.warn('-----------------------------');
    }
}

// --- Main Execution ---

function main() {
    console.log("Squid Game Interface Initialized by Akbar Qureshi.");
    console.log("Tracking player movements and monitoring vital signs.");
    console.log("-------------------------------------------------------");

    // A. Setup
    initEventListeners();

    // B. Animation Initialization
    initializeAnimations();

    // C. Intersection Observers for Animations
    
    // Animate all general text/headings
    createIntersectionObserver('section:not(.hero) h2, section:not(.hero) p, section:not(.hero) h3');
    
    createIntersectionObserver('.game-card');
    createIntersectionObserver('.participant-card');
    createIntersectionObserver('section:not(.hero) button');

    if (prizeMoneyElement) {
        createIntersectionObserver('#' + PRIZE_MONEY_ELEMENT_ID);
    }

    // D. Initial scroll check 
    handleHeaderStyleOnScroll();
    handleNavigationHighlight();
}

// Simple Throttle Function
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

document.addEventListener('DOMContentLoaded', main);