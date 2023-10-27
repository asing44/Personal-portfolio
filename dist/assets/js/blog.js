// ** ----------------------------------------
// ** BLOG PAGE
// ** ----------------------------------------

// ** PIN MAIN ARTICLE
ScrollTrigger.create({
    trigger: ".articles-container",
    pin: ".main-article",
    start: "top 10%",
    end: "bottom 75%",
});

ScrollTrigger.create({
    trigger: ".articles-container-reverse",
    pin: ".main-article-reverse",
    start: "top 10%",
    end: "bottom 75%",
});