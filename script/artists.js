// Pas besoin d'importer GSAP, il est déjà chargé via le CDN
gsap.registerPlugin(ScrollTrigger);

gsap.to(".slider-right", {
    x: 1200,
    ease: "none",
    scrollTrigger: {
        trigger: ".slider-right",
        start: "top center",
        end: "top top",
        scrub: 1.5,
    },
});

gsap.to(".slider-left", {
    x: -1200,
    ease: "none",
    scrollTrigger: {
        trigger: ".slider-right",
        start: "top center",
        end: "top top",
        scrub: 1.5,
    },
});
