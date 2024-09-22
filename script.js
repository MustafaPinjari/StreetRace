document.addEventListener("DOMContentLoaded", function () {
    const heroAudio = document.getElementById("hero-audio");
    const currentPage = document.getElementById('current-page');
    const links = document.querySelectorAll('.dropdown-content a');
    
    // Preload audio
    heroAudio.preload = "auto";
    
    // Attempt to play audio immediately
    function attemptAutoplay() {
        heroAudio.volume = 0.1;  // Start with low volume
        heroAudio.muted = false;
        
        let playPromise = heroAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("Autoplay started successfully");
                // Gradually increase volume
                let volumeIncrease = setInterval(() => {
                    if (heroAudio.volume < 1) {
                        heroAudio.volume += 0.1;
                    } else {
                        clearInterval(volumeIncrease);
                    }
                }, 1000);
            }).catch(error => {
                console.error("Autoplay was prevented:", error);
                // Fallback to play on first interaction
                document.body.addEventListener('click', playAudio, { once: true });
                document.body.addEventListener('keydown', playAudio, { once: true });
                document.body.addEventListener('touchstart', playAudio, { once: true });
            });
        }
    }

    function playAudio() {
        heroAudio.volume = 1;
        heroAudio.muted = false;
        heroAudio.play().then(() => {
            console.log("Audio started playing on user interaction");
        }).catch(error => {
            console.error("Error playing audio:", error);
        });
    }

    attemptAutoplay();

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            currentPage.textContent = this.textContent;
        });
    });

    // Function to control audio
    function controlAudio(isHeroVisible) {
        if (isHeroVisible) {
            if (heroAudio.paused) {
                playAudio();
            }
        } else {
            heroAudio.pause();
        }
    }

    // Throttle function
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

    // Update current page on scroll and control audio
    const handleScroll = throttle(function() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        let isHeroVisible = false;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                currentSection = section.getAttribute('id');
                if (currentSection === 'home') {
                    isHeroVisible = true;
                }
            }
        });

        if (currentSection) {
            currentPage.textContent = document.querySelector(`.dropdown-content a[href="#${currentSection}"]`).textContent;
        }

        controlAudio(isHeroVisible);
    }, 200);

    window.addEventListener('scroll', handleScroll);

    // Initial audio control on page load
    controlAudio(window.scrollY < window.innerHeight);
});