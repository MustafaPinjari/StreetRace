document.addEventListener("DOMContentLoaded", function () {
    const heroAudio = document.getElementById("hero-audio");
    const heroSection = document.getElementById("hero");
    let hasInteracted = false;

    // Function to play audio
    function playAudio() {
        console.log("Attempting to play audio...");
        heroAudio.volume = 1; // Ensure volume is at maximum
        heroAudio.muted = false; // Ensure audio is not muted
        heroAudio.play().then(() => {
            console.log("Audio started playing successfully");
        }).catch(error => {
            console.error("Error playing audio:", error);
        });
    }

    // Function to pause audio
    function pauseAudio() {
        heroAudio.pause();
        console.log("Audio paused");
    }

    // Play audio when user interacts with the page
    document.body.addEventListener('click', function() {
        console.log("User interaction detected");
        if (!hasInteracted) {
            hasInteracted = true;
            playAudio();
        }
    }, { once: true });

    // Pause audio when scrolled past hero section
    window.addEventListener('scroll', throttle(function() {
        const rect = heroSection.getBoundingClientRect();
        const heroVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (hasInteracted) {
            if (heroVisible) {
                playAudio();
            } else {
                pauseAudio();
            }
        }
    }, 100));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Log audio element details for debugging
    console.log("Audio element:", heroAudio);
    console.log("Audio source:", heroAudio.querySelector('source').src);
    console.log("Audio ready state:", heroAudio.readyState);

    // Attempt to play audio as soon as it's loaded
    heroAudio.addEventListener('canplaythrough', function() {
        console.log("Audio can play through, attempting playback");
        if (hasInteracted) {
            playAudio();
        }
    });
});

// Throttle function (unchanged)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}
