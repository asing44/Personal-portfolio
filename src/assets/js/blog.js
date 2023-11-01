// ** ----------------------------------------
// ** BLOG PAGE
// ** ----------------------------------------

// ** PIN MAIN ARTICLE
const mainArticleScroll = gsap.timeline({
    scrollTrigger: {
        scrub: true,
        trigger: ".articles-container",
        pin: ".main-article",
        start: "top 10%",
        end: "bottom 75%",
    }
});

const mainArticleScrollReverse = gsap.timeline({
    scrollTrigger: {
        scrub: true,
        trigger: ".articles-container-reverse",
        pin: ".main-article-reverse",
        start: "top 10%",
        end: "bottom 75%",
    }
});
