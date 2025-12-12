/* -------------------------------
    GLOBAL CONSTANTS & ELEMENTS
--------------------------------*/
const MOBILE_MENU_ID = 'mobileSidebar';
const MOBILE_BTN_ID = 'mobileMenuBtn';
// const CLOSE_BTN_ID = 'closeSidebarBtn'; // Removed: Icon is now handled by mobileMenuBtn
const OVERLAY_ID = 'sidebarOverlay';
const SIGNUP_MODAL_ID = 'signupModal';
const CLOSE_MODAL_ID = 'closeModal';
const SIGNUP_BTNS = ['signUpBtn', 'mobileSignUpBtn', 'finalSignUpBtn'];

const PRIZE_MONEY_ELEMENT_ID = 'prizeMoneyCounter';
const FINAL_PRIZE_AMOUNT = 45600000000;
let prizeCounterExecuted = false;

// DOM elements
const mobileSidebar = document.getElementById(MOBILE_MENU_ID);
const mobileMenuBtn = document.getElementById(MOBILE_BTN_ID);
// const closeSidebarBtn = document.getElementById(CLOSE_BTN_ID); // Removed
const sidebarOverlay = document.getElementById(OVERLAY_ID);
const signupModal = document.getElementById(SIGNUP_MODAL_ID);
const closeModalBtn = document.getElementById(CLOSE_MODAL_ID);
const nav = document.querySelector('nav');
// Select all links in the main nav AND the mobile sidebar for smooth scroll
const navLinks = document.querySelectorAll('nav a[href^="#"], #' + MOBILE_MENU_ID + ' a[href^="#"]'); 
const allSignUpButtons = SIGNUP_BTNS.map(id => document.getElementById(id)).filter(Boolean);
const prizeMoneyElement = document.getElementById(PRIZE_MONEY_ELEMENT_ID);

// NEW: Icon elements for the toggle functionality
const hamburgerIcon = document.getElementById('hamburgerIcon');
const closeIcon = document.getElementById('closeIcon');

/* -------------------------------
    MOBILE MENU
--------------------------------*/
/**
 * Toggles the mobile menu open or closed.
 * @param {boolean} open - True to open the menu, false to close it.
 */
function toggleMobileMenu(open) {
    // Check if elements exist before toggling
    if (!mobileSidebar || !sidebarOverlay || !hamburgerIcon || !closeIcon) return; 

    if (open) {
        mobileSidebar.classList.remove('translate-x-full');
        sidebarOverlay.classList.remove('hidden');
        document.body.style.overflow = "hidden";
        
        // NEW: Toggle icon to 'X'
        hamburgerIcon.classList.add('opacity-0');
        closeIcon.classList.remove('opacity-0');
        
    } else { 
        mobileSidebar.classList.add('translate-x-full');
        sidebarOverlay.classList.add('hidden');
        
        // NEW: Toggle icon back to hamburger
        hamburgerIcon.classList.remove('opacity-0');
        closeIcon.classList.add('opacity-0');
        
        // Only restore scrolling if the modal is not also open
        if (signupModal?.classList.contains('hidden')) {
            document.body.style.overflow = "auto";
        }
    }
}

/* -------------------------------
    SIGNUP MODAL
--------------------------------*/
/**
 * Toggles the signup modal open or closed.
 * @param {boolean} open - True to show the modal, false to hide it.
 */
function toggleSignupModal(open) {
    if (!signupModal) return;

    if (open) {
        signupModal.classList.remove('hidden');
        document.body.style.overflow = "hidden";
    } else {
        signupModal.classList.add('hidden');
        // Only restore scrolling if the mobile menu is not also open
        if (mobileSidebar?.classList.contains('translate-x-full')) {
            document.body.style.overflow = "auto";
        }
    }
}

/* -------------------------------
    SMOOTH SCROLL
--------------------------------*/
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    // Handle the case where the link is just '#' to scroll to top
    if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toggleMobileMenu(false);
        return;
    }
    
    const target = document.querySelector(targetId);

    if (target) {
        const navHeight = nav?.offsetHeight || 0; 
        const offsetTop = target.offsetTop - navHeight; 

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        // Close the mobile menu after clicking a link
        if (!mobileSidebar?.classList.contains('translate-x-full')) {
            // Note: If the menu is open, this ensures it closes when a link is clicked
            toggleMobileMenu(false);
        }
    }
}

/* -------------------------------
    HEADER SCROLL EFFECT
--------------------------------*/
function handleHeaderStyle() {
    if (!nav) return; 

    if (window.scrollY > 50) {
        nav.classList.add('shadow-lg', 'border-b', 'border-red-600/50');
    } else {
        nav.classList.remove('shadow-lg', 'border-b', 'border-red-600/50');
    }
}

/* -------------------------------
    ACTIVE NAVIGATION HIGHLIGHT
--------------------------------*/
function handleNavHighlight() {
    if (!nav) return; 
    
    const navHeight = nav.offsetHeight;
    const scrollPos = window.scrollY;

    // Remove active class from all links first
    navLinks.forEach(link => link.classList.remove('text-red-500'));

    document.querySelectorAll("section[id]").forEach(section => {
        // Offset by fixed header height and a small buffer (100px)
        const top = section.offsetTop - navHeight - 100;
        const bottom = top + section.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
            const id = section.getAttribute("id");
            // Highlight links with matching hrefs in both desktop and mobile menus
            document.querySelectorAll(`a[href="#${id}"]`).forEach(link =>
                link.classList.add('text-red-500')
            );
        }
    });
}

/* -------------------------------
    PRIZE COUNTER ANIMATION HELPERS
--------------------------------*/
/**
 * Formats a number as a currency string with Korean Won symbol.
 * @param {number} number - The number to format.
 * @returns {string} The formatted currency string.
 */
function formatCurrency(number) {
    // Use toLocaleString to handle digit grouping (e.g., 45,600,000,000)
    return number.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

/**
 * Animates the prize money counter from 0 to the final value.
 * @param {number} finalValue - The final prize amount.
 */
function animatePrizeCounter(finalValue) {
    if (!prizeMoneyElement) return;

    const duration = 2000; // 2 seconds
    let startTime;

    function animate(time) {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const value = Math.floor(progress * finalValue);

        const formattedValue = formatCurrency(value);
        prizeMoneyElement.textContent = `₩${formattedValue}`; // Prepend ₩

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

/* -------------------------------
    INTERSECTION OBSERVER (Animations)
--------------------------------*/
function initializeAnimations() {
    // Elements to animate on scroll (fade in and slide up)
    const animatables = document.querySelectorAll(
        'section:not(.hero) h2, section:not(.hero) p, section:not(.hero) h3, .game-card, .participant-card, section:not(.hero) button'
    );
    
    // 1. Set initial hidden state for all animatable elements
    animatables.forEach(el => {
        el.classList.add("opacity-0", "translate-y-4", "transition-all", "duration-1000");
    });

    // 2. Handle the Prize Money element separately
    if (prizeMoneyElement) {
        // Set initial state and ensure it's observed for the animation trigger
        prizeMoneyElement.textContent = `₩${formatCurrency(0)}`;
        prizeMoneyElement.classList.add("opacity-0", "translate-y-4", "transition-all", "duration-1000");
    }

    // 3. Create the observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Apply a staggered delay using the element's index
                setTimeout(() => {
                    entry.target.classList.remove("opacity-0", "translate-y-4");

                    // Trigger the prize counter animation only once when its element enters the viewport
                    if (entry.target.id === PRIZE_MONEY_ELEMENT_ID && !prizeCounterExecuted) {
                        animatePrizeCounter(FINAL_PRIZE_AMOUNT);
                        prizeCounterExecuted = true;
                    }

                    // Stop observing once the animation is triggered
                    observer.unobserve(entry.target);
                }, index * 100); 
            }
        });
    }, {
        // Start the animation 100px before the element hits the bottom of the viewport
        rootMargin: '0px 0px -100px 0px', 
        threshold: 0.1
    });

    // 4. Start observing the elements
    animatables.forEach(el => observer.observe(el));
    if (prizeMoneyElement) observer.observe(prizeMoneyElement);
}

/* -------------------------------
    EASTER EGG
--------------------------------*/
function handleEasterEgg(e) {
    if (e.key.toLowerCase() === "s") {
        console.warn("EASTER EGG ACTIVATED - Welcome Player 457!");
    }
}

/* -------------------------------
    FORM SUBMIT
--------------------------------*/
function handleSignupSubmit(e) {
    e.preventDefault();
    alert("Application received! A recruiter will contact you soon.");
    toggleSignupModal(false);
    // Reset the form after submission
    if (this instanceof HTMLFormElement) {
        this.reset();
    }
}

/* -------------------------------
    INIT EVENTS
--------------------------------*/
function initEvents() {
    // Mobile Menu Handlers
    // The mobileMenuBtn now handles both open and close, and icon toggle is inside toggleMobileMenu
    mobileMenuBtn?.addEventListener("click", () => {
        // Check if the sidebar is currently closed (has 'translate-x-full') to decide whether to open or close
        const isClosed = mobileSidebar?.classList.contains('translate-x-full');
        toggleMobileMenu(isClosed);
    });

    // Removed the closeSidebarBtn listener as the close button is now in the nav
    // closeSidebarBtn?.addEventListener("click", () => toggleMobileMenu(false)); 
    sidebarOverlay?.addEventListener("click", () => toggleMobileMenu(false));
    
    // Modal Handlers
    allSignUpButtons.forEach(btn => btn?.addEventListener("click", () => toggleSignupModal(true)));
    closeModalBtn?.addEventListener("click", () => toggleSignupModal(false));

    // Modal Close on backdrop click
    signupModal?.addEventListener("click", e => {
        if (e.target.id === SIGNUP_MODAL_ID) toggleSignupModal(false);
    });

    // Smooth Scroll Handler
    navLinks.forEach(link => link.addEventListener("click", handleSmoothScroll));

    // Form Submit Handler
    const form = signupModal?.querySelector("form");
    form?.addEventListener("submit", handleSignupSubmit);
    
    // Window Scroll Events (Header style and Nav highlighting)
    window.addEventListener("scroll", () => {
        handleHeaderStyle();
        handleNavHighlight();
    });
    
    // Easter Egg
    document.addEventListener("keydown", handleEasterEgg);
    
    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !signupModal?.classList.contains('hidden')) {
            toggleSignupModal(false);
        }
    });
}

/* -------------------------------
    MAIN EXECUTION
--------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    console.log("All Features Loaded Successfully - Player 456's Challenge Ready");
    initEvents();
    initializeAnimations();
    // Run header style and nav highlight immediately for the initial state
    handleHeaderStyle(); 
    handleNavHighlight(); 
});