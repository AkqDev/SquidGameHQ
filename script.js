/* -------------------------------
    GLOBAL CONSTANTS & ELEMENTS
--------------------------------*/
const MOBILE_MENU_ID = 'mobileSidebar';
const MOBILE_BTN_ID = 'mobileMenuBtn';
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
    DYNAMIC CONTENT DATA
--------------------------------*/

const GAMES_DATA = [
    { title: "RED LIGHT, GREEN LIGHT", iconShape: "circle", iconColor: "pink-500", description: "Run when you hear \"green light\" but freeze when you hear \"red light\"." },
    { title: "HONEYCOMB", iconShape: "square", iconColor: "blue-500", description: "Choose your shape carefully and try not to break the honeycomb." },
    { title: "TUG OF WAR", iconShape: "triangle", iconColor: "green-500", description: "Team up and pull with all your might against your opponents." },
    { title: "MARBLES", iconShape: "square", iconColor: "purple-500", description: "Win all your opponent's marbles to survive this psychological game." },
    { title: "GLASS BRIDGE", iconShape: "circle", iconColor: "yellow-500", description: "Choose between tempered and normal glass while crossing." },
    { title: "SQUID GAME", iconShape: "triangle", iconColor: "red-500", description: "The final game that gives the competition its name." }
];

const PARTICIPANT_DATA = [
    { num: 456, name: "Player 456", status: "Default Status", location: "Seoul", state: "Active", image: "./Images/player 456.webp" },
    { num: 67, name: "Player 067", status: "Pickpocket", location: "Busan", state: "Active", image: "./Images/player 067.jpg" },
    { num: 1, name: "Player 001", status: "Veteran", location: "Daegu", state: "Eliminated", image: "./Images/player 001.webp" },
    { num: 101, name: "Player 101", status: "Gangster", location: "Incheon", state: "Eliminated", image: "./Images/player 101.png" }
];

const RULES_DATA = [
    { title: "Rule 1", iconShape: "circle", description: "Participants must remain in the competition area until all games are completed." },
    { title: "Rule 2", iconShape: "triangle", description: "Anyone who refuses to play will be eliminated." },
    { title: "Rule 3", iconShape: "square", description: "The games may be terminated if the majority agrees." },
    { title: "Rule 4", iconShape: "circle", description: "All participants are equal in the game, regardless of their background." },
    { title: "Rule 5", iconShape: "triangle", description: "The winner takes all money earned from the prize pool." }
];

/* -------------------------------
    DYNAMIC CONTENT RENDERING
--------------------------------*/

function renderGames() {
    const container = document.getElementById('gamesContainer');
    if (!container) return;

    const htmlContent = GAMES_DATA.map(game => `
        <div class="game-card relative p-8 rounded-lg group overflow-hidden">
            <div class="${game.iconShape} bg-${game.iconColor} mb-4"></div>
            <h3 class="text-2xl font-bold mb-4">${game.title}</h3>
            <p class="text-gray-300">${game.description}</p>
            <div class="absolute bottom-0 left-0 w-full h-1 bg-red-500 transform -translate-x-full group-hover:translate-x-0 transition"></div>
        </div>
    `).join('');

    container.innerHTML = htmlContent;
}

function renderParticipants() {
    const container = document.getElementById('participantsContainer');
    if (!container) return;

    const htmlContent = PARTICIPANT_DATA.map(player => {
        const statusColor = player.state === 'Active' ? 'bg-red-700' : 'bg-gray-500';
        return `
            <div class="participant-card rounded-lg overflow-hidden transition duration-300 transform hover:scale-[1.03] hover:cursor-pointer bg-gray-800 border border-gray-700 hover:border-red-600">
                <div class="h-64 overflow-hidden">
                    <img src="${player.image}" alt="${player.name} in green tracksuit" class="w-full h-full object-cover" />
                </div>
                <div class="p-4">
                    <h3 class="text-xl font-bold">${player.name}</h3>
                    <p class="text-gray-400">${player.status}</p>
                    <div class="flex justify-between mt-4">
                        <span class="bg-black px-3 py-1 rounded-full text-sm">${player.location}</span>
                        <span class="${statusColor} px-3 py-1 rounded-full text-sm">${player.state}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Render the cards and the "View All" button container
    container.innerHTML = htmlContent;

    // You might also want to generate the "View All" button here if it was dynamic, 
    // but for now, we'll assume the button container is in the HTML.
}


function renderRules() {
    const container = document.getElementById('rulesContainer');
    if (!container) return;

    const htmlContent = RULES_DATA.map(rule => `
        <div class="flex items-start">
            <div class="${rule.iconShape} bg-red-600 mr-4 mt-1 flex-shrink-0"></div>
            <div>
                <h3 class="text-xl font-bold mb-2">${rule.title}</h3>
                <p class="text-gray-300">${rule.description}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = htmlContent;
}


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
        
        // Toggle icon to 'X'
        hamburgerIcon.classList.add('opacity-0');
        closeIcon.classList.remove('opacity-0');
        
    } else { 
        mobileSidebar.classList.add('translate-x-full');
        sidebarOverlay.classList.add('hidden');
        
        // Toggle icon back to hamburger
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
    // IMPORTANT: Include the new containers for animations
    const animatables = document.querySelectorAll(
        'section:not(.hero) h2, section:not(.hero) p, section:not(.hero) h3, .game-card, .participant-card, #rulesContainer > div, section:not(.hero) button'
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
    // Re-select animatables after content injection to observe the new elements
    document.querySelectorAll(
        'section:not(.hero) h2, section:not(.hero) p, section:not(.hero) h3, .game-card, .participant-card, #rulesContainer > div, section:not(.hero) button, .participant-card button'
    ).forEach(el => observer.observe(el));

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
    mobileMenuBtn?.addEventListener("click", () => {
        const isClosed = mobileSidebar?.classList.contains('translate-x-full');
        toggleMobileMenu(isClosed);
    });

    sidebarOverlay?.addEventListener("click", () => toggleMobileMenu(false));
    
    // Modal Handlers
    allSignUpButtons.forEach(btn => btn?.addEventListener("click", () => toggleSignupModal(true)));
    closeModalBtn?.addEventListener("click", () => toggleSignupModal(false));

    // Modal Close on backdrop click
    signupModal?.addEventListener("click", e => {
        if (e.target.id === SIGNUP_MODAL_ID) toggleSignupModal(false);
    });

    // Smooth Scroll Handler
    // Note: The navLinks variable is still valid as it queries links in the generated mobile sidebar
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
    // 1. Render dynamic content before initialization
    renderGames();
    renderParticipants();
    renderRules();

    console.log("All Features Loaded Successfully - Player 456's Challenge Ready");
    
    // 2. Initialize Events
    initEvents();

    // 3. Initialize Animations (needs to run after rendering new elements)
    initializeAnimations();
    
    // 4. Run header style and nav highlight immediately for the initial state
    handleHeaderStyle(); 
    handleNavHighlight(); 
});