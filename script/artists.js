gsap.registerPlugin(ScrollTrigger);

const sliderWidth = 256 + 64 * 2;

gsap.to(".slider-right", {
    x: window.innerWidth - sliderWidth,
    ease: "none",
    scrollTrigger: {
        trigger: ".section_artists",
        start: "top 80%",
        end: "center center",
        scrub: 1.5,
    },
});

gsap.to(".slider-left", {
    x: -(window.innerWidth - sliderWidth),
    ease: "none",
    scrollTrigger: {
        trigger: ".section_artists",
        start: "top 80%",
        end: "center center",
        scrub: 1.5,
    },
});