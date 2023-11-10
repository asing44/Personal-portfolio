// ?? ----------------------------------------
// ?? INIT AND SETUP
// ?? ----------------------------------------

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

gsap.config({
    autoSleep: 60,
});

// Set the page change container to the previous color
$('.pageChangeContainer').css('background-color', localStorage.getItem("pageChangeColor")
);

var viewportHeight = window.innerHeight;
var viewportWidth = window.innerWidth;
console.log("Viewport height: " + viewportHeight, "Viewport width: " + viewportWidth);

window.addEventListener("resize", () => {
    viewportHeight = window.innerHeight;
    viewportWidth = window.innerWidth;
});

gsap.to(window, {
    duration: 1,
    scrollTo: 0,
    ease: "power3.out"
});

// ?? ----------------------------------------
// ?? HELPER FUNCTIONS
// ?? ----------------------------------------

// * INFINITE HORIZONTAL LOOPING

/*
This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.

Features:
 - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
 - When each item animates to the left or right enough, it will loop back to the other side
 - Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
 - The returned timeline will have the following methods added to it:
   - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
   - current() - returns the current index (if an animation is in-progress, it reflects the final index)
   - times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
 */
   function horizontalLoop(items, config) {
	items = gsap.utils.toArray(items);
	config = config || {};
	let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
		length = items.length,
		startX = items[0].offsetLeft,
		times = [],
		widths = [],
		xPercents = [],
		curIndex = 0,
		pixelsPerSecond = (config.speed || 1) * 100,
		snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
		totalWidth, curX, distanceToStart, distanceToLoop, item, i;
	gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
		xPercent: (i, el) => {
			let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
			xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
			return xPercents[i];
		}
	});
	gsap.set(items, {x: 0});
	totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
	for (i = 0; i < length; i++) {
		item = items[i];
		curX = xPercents[i] / 100 * widths[i];
		distanceToStart = item.offsetLeft + curX - startX;
		distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
		tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
		  .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
		  .add("label" + i, distanceToStart / pixelsPerSecond);
		times[i] = distanceToStart / pixelsPerSecond;
	}
	function toIndex(index, vars) {
		vars = vars || {};
		(Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
		let newIndex = gsap.utils.wrap(0, length, index),
			time = times[newIndex];
		if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
			vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
			time += tl.duration() * (index > curIndex ? 1 : -1);
		}
		curIndex = newIndex;
		vars.overwrite = true;
		return tl.tweenTo(time, vars);
	}
	tl.next = vars => toIndex(curIndex+1, vars);
	tl.previous = vars => toIndex(curIndex-1, vars);
	tl.current = () => curIndex;
	tl.toIndex = (index, vars) => toIndex(index, vars);
	tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
	return tl;
}

// * DELAY LINKS

var pageChangeHref = '';

function goToLink() {

    gsap.delayedCall(0.25, function() {
        document.location.href = pageChangeHref;
    });
};

// * GET CURSOR POSITION

function getCursor(e) {
    var rect = e.target.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

// ?? ----------------------------------------
// ?? GLOBAL
// ?? ----------------------------------------

// ** ----------------------------------------
// ** CURSOR
// ** ----------------------------------------

const cursor = document.querySelector('.cursor-ball');
const cursorOuter = document.querySelector('.cursor-outer');
const cursorOuterCircle = $('.cursor-outer-circle');

document.body.addEventListener('mousemove', cursorMove);

// * SET CURSOR

// !! Need to figure out how to set the cursor across page changes

// * EXPAND CURSOR

$('.--cursor-expand').on('mouseenter', function(){
    gsap.to(cursor, {scale: 0});
    gsap.to(cursorOuter, {scale: 2});
}).on('mouseleave', function(){
    gsap.to(cursor, {scale: 1});
    gsap.to(cursorOuter, {scale: 1});
    gsap.to(cursorOuterCircle, {
        strokeWidth: "1px"
    }, '<')
});

// * TRACK MOVE

function cursorMove(e) {
    gsap.set('.cursor', {
        opacity: 1,
    });

    let tl = gsap.timeline({
    });

    let cursorX = e.clientX;
    let cursorY = e.clientY;

    tl.to(cursor, {
        x: cursorX - 7,
        y: cursorY - 16,
        ease: "power4"
    }).to(cursorOuter, {
        x: cursorX - 25,
        y: cursorY - 25,
        ease: "power4"
    }, '<5%')

    localStorage.setItem("cursorX", cursorX);
    localStorage.setItem("cursorY", cursorY);
}

// ** ----------------------------------------
// ** PAGELOAD ANIMATIONS
// ** ----------------------------------------

// * PAGE CHANGE IN

var pageChangeColors = {
    1: "#32853F", /* green */
    2: "#2A1E5C", /* blue */
    3: "#694873", /* purple */
    4: "#BA2D0B", /* red */
}

let pageChangeAnim = gsap.timeline({
    delay: 0.2,
    defaults: {
        duration: 1
    },
    onReverseComplete: goToLink,
});

pageChangeAnim.set(".pageChangeContainer", {
    x: 0,
    y: 0,
}).to(".pageChangeContainer", {
    scale: 0.85,
    ease: "power3.inOut",
    borderRadius: "5rem"
}).to(".pageChangeContainer", {
    duration: 0.75,
    yPercent: -100,
    ease: "power3.in"
}, "<75%")

// * PAGE CHANGE OUT

$('.--delay-link').on('click', function(e) {
    e.preventDefault();

    if (/index/.test($(this).attr("href"))) {
        $('#pageChangeText').html("home")
    } else {
        $("#pageChangeText").html($(this).attr("href").match(/[\w-]+(?=\.html)/g).toString().replaceAll("-", " "));
    }
    pageChangeHref = $(this).attr('href');
    var pageChangeColor = pageChangeColors[Math.round((Math.random() * 4))];
    localStorage.setItem("pageChangeColor", pageChangeColor);
    $('.pageChangeContainer').css('background-color', pageChangeColor);
    pageChangeAnim.reverse();
});

// * DELAY PAGELOAD ANIMATIONS

// gsap.delayedCall(0.5, function() {
//     pageLoadAnimParent.play()
// });

// ?? ----------------------------------------
// ?? SECTIONS
// ?? ----------------------------------------

// ** ----------------------------------------
// ** NAVIGATION
// ** ----------------------------------------

// * NAVIGATION TOP ACTIVE LINK

$('.navLink').each(function() {
    console.log($(this))
    if ((window.location.pathname).match(/(?<=\/)\w+(?=\.html)/) == $(this).data('location')) {
        $(this).addClass('__link-1--active');
    } else {
        $(this).removeClass('__link-1--active');
    }
})

// // * SHOW/HIDE NAV SCROLLED BUTTON

// let navScrolled = $(".navigation-scrolled-button");

// let showHideNavButtonAnim = gsap.timeline({
//     scrollTrigger: {
//         trigger: "#fixedReference",
//         start: "50% top",
//         end: "50% top",
//         toggleActions: "play none reverse none",
//     }
// })

// showHideNavButtonAnim.fromTo(navScrolled, {
//     scale: 0
// }, {
//     duration: 1,
//     scale: 1,
//     ease: "power3.out"
// })

// // * NAV SCROLLED BUTTON HOVER
// let navButtonHoverAnim = gsap.to(".navButtonHover", {
//     paused: true,
//     duration: 0.5,
//     top: "0%",
//     ease: "power3.out"
// });

// $(".navigation-scrolled-button").on("mouseenter", function(){
//     navButtonHoverAnim.play();
// });
// $(".navigation-scrolled-button").on("mouseleave", function(){
//     navButtonHoverAnim.reverse()
// })

// // * NAV MODAL
// let navModalShowHideAnim = gsap.timeline({
//     paused: true,
//     defaults: {
//         duration: 1
//     },
//     onStart: () => {
//         $("body").addClass("-lockScroll");
//     },
//     onReverseComplete: () => {
//         $("body").removeClass("-lockScroll");
//         $(".navigationScrolledContainer").addClass("-inactive");
//     }
// })
// .add(showHideModal());

// function showHideModal() {
//     let tl = gsap.timeline({
//         defaults: {
//             duration: 1,
//             ease: "power2.out"
//         }
//     });
//     tl.set($(".navigationScrolledContainer"), {
//         autoAlpha: 0
//     }).set($(".navigationScrolledMainWrapper"),{
//         borderRadius: "40% 0% 0% 40%",
//     }).to($(".navigationScrolledContainer"), {
//         xPercent: 0,
//         autoAlpha: 1
//     }, 0).to($(".navigationScrolledMainWrapper"), {
//         xPercent: -100,
//         ease: "power4.inOut"
//     }, 0).to($(".navigationScrolledMainWrapper"), {
//         borderRadius: "0% 0% 0% 0%",
//         ease: "power4.inOut"
//     }, "<10%")
//     return tl;
// }

// function modalInnerContent() {
//     let tl = gsap.timeline()
// }

// $(".navigation-scrolled-button").on("click", () => {
//     $(".navigationScrolledContainer").removeClass("-inactive");
//     navModalShowHideAnim.play();
// });

// $("#navigationScrolledButton-close").on("click", () => {
//     navModalShowHideAnim.reverse();
// })

// ?? ----------------------------------------
// ?? INTERACTIVE
// ?? ----------------------------------------

// ** ----------------------------------------
// ** LINK 1
// ** ----------------------------------------

gsap.utils.toArray($(".__link-1:not(.__link-1--active)")).forEach((item) => {
    let hover1 = $(item).children("._inner-1");
    let hover2 = $(item).children("._inner-2");
    let link1Hover_tl = gsap.timeline({ paused: true });
    link1Hover_tl.to(hover1, {
        scale: 0.85
    }).to(hover2, {
        duration: 0.4,
        yPercent: -100,
        ease: "power3.inOut"
    },"<5%");
    $(item).on("mouseenter", function () {
        link1Hover_tl.play();
    }).on("mouseleave", function () {
        link1Hover_tl.reverse();
    });
});

// ** ----------------------------------------
// ** BUTTONS
// ** ----------------------------------------

// ?? ----------------------------------------
// ?? TESTING ZONE
// ?? ----------------------------------------

console.log((window.location.pathname).match(/(?<=\/)\w+(?=\.html)/))

