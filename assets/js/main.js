// ** ----------------------------------------
// ** HOMEPAGE
// ** ----------------------------------------

// ** INTRO

var playIntroAnim = false;

if (playIntroAnim) {

    gsap.set(".loading-container", {
        display: "grid"
    });

    gsap.timeline({
        delay: 0.2,
    })
    .add(loadingTextAnim())
    .add(loadingBarAnim(), "+=2")
    .add(loadingCircleAnim(), "-=2")
    
    function loadingTextAnim() {
        let loadingText = gsap.utils.toArray(".msg-txt"),
        tl = gsap.timeline({delay: 0.2});
        loadingText.forEach(el => {
        tl.from(el, {text: "", duration: 0.1 * gsap.utils.clamp(1,el.innerHTML.length,el.innerHTML.length), ease: "none"});
        return loadingText;
    });
    
    }
    
    function loadingBarAnim() {
        let tl = gsap.timeline({
            defaults: {
                duration: 7,
                ease: "power3.inOut"
            }
        });
    
        tl.to(".loading-bar-vertical", {
            height: "100%"
        }).to(".loading-bar-horizontal", {
            width: "100%"
        }, "<");
    
        return tl;
    }
    
    function loadingCircleAnim() {
        let tl = gsap.timeline({
            defaults: {
                duration: 1,
                ease: "power3.inOut"
            },
            onComplete: () => {
                gsap.set(".loading-container", {
                    display: "none"
                })
            }
        });
    
        tl.set(".loading-circle", {
            x: 0,
            y: 0
        }).to(".loading-circle", {
            height: `${1.00}rem`,
            width: `${1.00}rem`
        }).to(".loading-circle", {
            duration: 2,
            scale: 250,
            ease: "power2.in",
            onComplete: () => {
                gsap.set(".loading-container", {
                    backgroundColor: "transparent"
                });
                gsap.set(".loading-bar-vertical, .loading-bar-horizontal, .loading-message-wrapper", {
                    display: "none"
                });
            }
        }).set(".loading-circle", {
            x: -viewportWidth,
            y: viewportHeight
        }).to(".loading-circle", {
            scale: 0,
            ease: "power1.out"
        })
    
        return tl
    }
}

// ** HERO

const nameScroll = gsap.utils.toArray(".hero-name-item");

const loop = horizontalLoop(nameScroll, {paused: false, repeat: -1, speed: 2});