const signUpBtn = document.getElementById('signUpBtn');
const finalSignUpBtn = document.getElementById('finalSignUpBtn');
const closeModal = document.getElementById('closeModal');
const signupModal = document.getElementById('signupModal');

function toggleModal() {
    signupModal.classList.toggle('hidden');
    
    if(!signupModal.classList.contains('hidden')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

signUpBtn.addEventListener('click', toggleModal);
finalSignUpBtn.addEventListener('click', toggleModal);
closeModal.addEventListener('click', toggleModal);

// Participant card interaction
const participantCards = document.querySelectorAll('.participant-card');

participantCards.forEach(card => {
    card.addEventListener('click', () => {
        const statusElement = card.querySelector('.bg-red-900');
        if(statusElement) {
            statusElement.classList.remove('bg-red-900');
            statusElement.classList.add('bg-gray-500');
            statusElement.textContent = 'Eliminated';
        } else {
            const eliminatedElement = card.querySelector('.bg-gray-500');
            if(eliminatedElement) {
                eliminatedElement.classList.remove('bg-gray-500');
                eliminatedElement.classList.add('bg-red-900');
                eliminatedElement.textContent = 'Active';
            }
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(AnyValue => {
    AnyValue.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Random participant elimination animation
setInterval(() => {
    const activeCards = document.querySelectorAll('.participant-card .bg-red-900');
    if(activeCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * activeCards.length);
        const randomCard = activeCards[randomIndex];
        
        randomCard.classList.remove('bg-red-900');
        randomCard.classList.add('bg-gray-500');
        randomCard.textContent = 'Eliminated';
        
        // Flash effect
        randomCard.parentElement.parentElement.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
        setTimeout(() => {
            randomCard.parentElement.parentElement.style.boxShadow = '';
        }, 1000);
    }
}, 10000);