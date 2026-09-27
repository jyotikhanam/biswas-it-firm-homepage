"use strict";

const html = document.documentElement;
const body = document.body;

const siteHeader = document.querySelector("#site-header");
const mainNav = document.querySelector("#main-nav");
const menuToggle = document.querySelector("#menu-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const navLinks = document.querySelectorAll(".nav-link");
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioCards = document.querySelectorAll(".portfolio-card");

const serviceButtons = document.querySelectorAll(
    "[data-modal-service]"
);

const serviceModal = document.querySelector("#service-modal");
const modalClose = document.querySelector("#modal-close");
const modalIcon = document.querySelector("#modal-icon");
const modalLabel = document.querySelector("#modal-label");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalFeatures = document.querySelector("#modal-features");
const modalCta = document.querySelector("#modal-cta");

const testimonialCards = document.querySelectorAll(
    ".testimonial-card"
);

const testimonialDots = document.querySelectorAll(
    ".slider-dot"
);

const testimonialPrev = document.querySelector(
    "#testimonial-prev"
);

const testimonialNext = document.querySelector(
    "#testimonial-next"
);

const faqItems = document.querySelectorAll(".faq-item");
const faqSearchInput = document.querySelector("#faq-search-input");
const faqEmpty = document.querySelector("#faq-empty");

const liveRegion = document.querySelector("#live-region");

function announce(message) {

    if (!liveRegion) {
        return;
    }

    liveRegion.textContent = "";

    window.setTimeout(() => {
        liveRegion.textContent = message;
    }, 50);
}

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

function scrollToElement(target) {

    const element = document.querySelector(target);

    if (!element) {
        return;
    }

    element.scrollIntoView({
        behavior: prefersReducedMotion
            ? "auto"
            : "smooth",
        block: "start"
    });
}

const THEME_KEY = "biswas-theme";

function applyTheme(theme) {

    const isDark = theme === "dark";

    if (isDark) {
        html.dataset.theme = "dark";
    } else {
        delete html.dataset.theme;
    }

    if (themeToggle) {

        themeToggle.setAttribute(
            "aria-pressed",
            String(isDark)
        );

        themeToggle.setAttribute(
            "aria-label",
            isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );
    }
}

function getInitialTheme() {

    const savedTheme =
        localStorage.getItem(THEME_KEY);

    if (
        savedTheme === "dark" ||
        savedTheme === "light"
    ) {
        return savedTheme;
    }

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";
}

function initTheme() {

    applyTheme(getInitialTheme());

    if (!themeToggle) {
        return;
    }

    themeToggle.addEventListener(
        "click",
        () => {

            const currentTheme =
                html.dataset.theme === "dark"
                    ? "dark"
                    : "light";

            const nextTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";

            applyTheme(nextTheme);

            localStorage.setItem(
                THEME_KEY,
                nextTheme
            );
        }
    );
}


function closeMobileMenu() {

    if (!mainNav || !menuToggle) {
        return;
    }

    mainNav.classList.remove("is-open");
    menuToggle.classList.remove("is-active");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    body.classList.remove("menu-open");
}


function openMobileMenu() {

    if (!mainNav || !menuToggle) {
        return;
    }

    mainNav.classList.add("is-open");
    menuToggle.classList.add("is-active");

    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
    );

    body.classList.add("menu-open");
}


function initMobileNavigation() {

    if (!menuToggle || !mainNav) {
        return;
    }

    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                menuToggle.getAttribute(
                    "aria-expanded"
                ) === "true";

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }
    );

    navLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {
                closeMobileMenu();
            }
        );
    });

    document.addEventListener(
        "click",
        (event) => {

            const clickedInsideNav =
                mainNav.contains(event.target);

            const clickedMenuButton =
                menuToggle.contains(event.target);

            if (
                !clickedInsideNav &&
                !clickedMenuButton
            ) {
                closeMobileMenu();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeMobileMenu();
            }
        }
    );


    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }
    );
}

function updateHeaderOnScroll() {

    if (!siteHeader) {
        return;
    }

    if (window.scrollY > 15) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }
}


function initHeaderScroll() {

    updateHeaderOnScroll();

    window.addEventListener(
        "scroll",
        updateHeaderOnScroll,
        {
            passive: true
        }
    );
}

function initActiveNavigation() {

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if (!sections.length || !navLinks.length) {
        return;
    }


    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                const currentId =
                    entry.target.id;

                navLinks.forEach((link) => {

                    const linkTarget =
                        link.getAttribute("href");

                    const isActive =
                        linkTarget ===
                        `#${currentId}`;

                    link.classList.toggle(
                        "active",
                        isActive
                    );
                });
            });
        },
        {
            rootMargin:
                "-30% 0px -60% 0px",
            threshold: 0
        }
    );


    sections.forEach((section) => {
        observer.observe(section);
    });
}

function initPortfolioFilter() {

    if (
        !filterButtons.length ||
        !portfolioCards.length
    ) {
        return;
    }


    filterButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const selectedFilter =
                    button.dataset.filter;

                filterButtons.forEach(
                    (filterButton) => {

                        const isActive =
                            filterButton === button;

                        filterButton.classList.toggle(
                            "active",
                            isActive
                        );

                        filterButton.setAttribute(
                            "aria-pressed",
                            String(isActive)
                        );
                    }
                );


                let visibleCount = 0;

                portfolioCards.forEach((card) => {

                    const category =
                        card.dataset.category;

                    const shouldShow =
                        selectedFilter === "all" ||
                        category === selectedFilter;

                    card.classList.toggle(
                        "is-hidden",
                        !shouldShow
                    );

                    if (shouldShow) {
                        visibleCount++;
                    }
                });


                announce(
                    `${visibleCount} portfolio ${
                        visibleCount === 1
                            ? "project"
                            : "projects"
                    } displayed.`
                );
            }
        );
    });
}


const serviceData = {

    "web-development": {

        icon: "fa-solid fa-code",

        label: "Web Development",

        title: "Web Development",

        description:
            "Responsive and modern websites built around real business needs, user expectations and performance.",

        features: [
            "Responsive business websites",
            "Mobile-friendly user experiences",
            "Performance-conscious development",
            "Clean and maintainable front-end structure"
        ]
    },


    "graphic-design": {

        icon: "fa-solid fa-palette",

        label: "Graphic Design",

        title: "Graphic Design",

        description:
            "Professional visual designs that help your brand communicate clearly and consistently across digital platforms.",

        features: [
            "Social media graphics",
            "Marketing materials",
            "Brand visual assets",
            "Promotional creative designs"
        ]
    },


    "digital-marketing": {

        icon: "fa-solid fa-ranking-star",

        label: "Digital Marketing",

        title: "Digital Marketing",

        description:
            "Strategic digital solutions designed to connect your business with the right audience and strengthen online visibility.",

        features: [
            "Digital campaign planning",
            "Audience-focused strategies",
            "Brand visibility support",
            "Social media marketing content"
        ]
    },


    "video-editing": {

        icon: "fa-solid fa-play",

        label: "Video Editing",

        title: "Video Editing",

        description:
            "Engaging visual content created for social media, marketing campaigns and brand communication.",

        features: [
            "Short-form video editing",
            "Social media videos",
            "Promotional content",
            "Brand-focused visual storytelling"
        ]
    },


    "content-writing": {

        icon: "fa-solid fa-pen-to-square",

        label: "Content Writing",

        title: "Content Writing",

        description:
            "Clear and engaging content that communicates your message and supports your digital presence.",

        features: [
            "Website content",
            "Marketing copy",
            "Social media content",
            "Business-focused copywriting"
        ]
    },


    "brand-promotion": {

        icon: "fa-solid fa-bullhorn",

        label: "Brand Promotion",

        title: "Brand Promotion",

        description:
            "Creative promotional solutions designed to increase your brand's visibility and communicate your value clearly.",

        features: [
            "Promotional campaigns",
            "Brand visibility support",
            "Creative communication",
            "Digital promotional content"
        ]
    }

};


let lastFocusedElement = null;


function populateServiceModal(serviceKey) {

    const service =
        serviceData[serviceKey];

    if (!service) {
        return false;
    }


    if (modalIcon) {
        modalIcon.innerHTML = `<i class="${service.icon}" aria-hidden="true"></i>`;
    }

    if (modalLabel) {
        modalLabel.textContent = service.label;
    }

    if (modalTitle) {
        modalTitle.textContent = service.title;
    }

    if (modalDescription) {
        modalDescription.textContent =
            service.description;
    }


    if (modalFeatures) {

        modalFeatures.innerHTML = "";

        service.features.forEach(
            (feature) => {

                const listItem =
                    document.createElement("li");

                listItem.textContent = feature;

                modalFeatures.appendChild(
                    listItem
                );
            }
        );
    }


    if (modalCta) {

        modalCta.href = "#contact";

        modalCta.dataset.service =
            serviceKey;
    }

    return true;
}


function openServiceModal(serviceKey) {

    if (
        !serviceModal ||
        !populateServiceModal(serviceKey)
    ) {
        return;
    }

    lastFocusedElement =
        document.activeElement;


    if (typeof serviceModal.showModal === "function") {

        serviceModal.showModal();

    } else {

        serviceModal.setAttribute(
            "open",
            ""
        );
    }


    if (modalClose) {
        modalClose.focus();
    }


    announce(
        `${serviceData[serviceKey].title} details opened.`
    );
}


function closeServiceModal() {

    if (!serviceModal) {
        return;
    }


    if (
        typeof serviceModal.close === "function" &&
        serviceModal.open
    ) {
        serviceModal.close();
    } else {
        serviceModal.removeAttribute("open");
    }


    if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {
        lastFocusedElement.focus();
    }

    lastFocusedElement = null;
}


function initServiceModal() {

    if (!serviceModal) {
        return;
    }


    serviceButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const serviceKey =
                    button.dataset.modalService;

                openServiceModal(serviceKey);
            }
        );
    });


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeServiceModal
        );
    }


    serviceModal.addEventListener(
        "click",
        (event) => {

            if (event.target === serviceModal) {
                closeServiceModal();
            }
        }
    );

    serviceModal.addEventListener(
        "cancel",
        () => {

            lastFocusedElement = null;
        }
    );


    if (modalCta) {

        modalCta.addEventListener(
            "click",
            () => {

                closeServiceModal();

                window.setTimeout(
                    () => {
                        scrollToElement("#contact");
                    },
                    50
                );
            }
        );
    }
}

let currentTestimonial = 0;
let testimonialInterval = null;


function showTestimonial(index) {

    if (!testimonialCards.length) {
        return;
    }


    const total =
        testimonialCards.length;


    currentTestimonial =
        (index + total) % total;


    testimonialCards.forEach(
        (card, cardIndex) => {

            const isActive =
                cardIndex === currentTestimonial;

            card.classList.toggle(
                "active",
                isActive
            );

            card.setAttribute(
                "aria-hidden",
                String(!isActive)
            );
        }
    );


    testimonialDots.forEach(
        (dot, dotIndex) => {

            const isActive =
                dotIndex === currentTestimonial;

            dot.classList.toggle(
                "active",
                isActive
            );

            dot.setAttribute(
                "aria-selected",
                String(isActive)
            );
        }
    );
}


function nextTestimonial() {

    showTestimonial(
        currentTestimonial + 1
    );
}


function previousTestimonial() {

    showTestimonial(
        currentTestimonial - 1
    );
}


function startTestimonialAutoplay() {

    if (
        prefersReducedMotion ||
        testimonialCards.length < 2
    ) {
        return;
    }


    stopTestimonialAutoplay();


    testimonialInterval =
        window.setInterval(
            nextTestimonial,
            5000
        );
}


function stopTestimonialAutoplay() {

    if (testimonialInterval) {

        window.clearInterval(
            testimonialInterval
        );

        testimonialInterval = null;
    }
}


function initTestimonials() {

    if (!testimonialCards.length) {
        return;
    }


    showTestimonial(0);


    if (testimonialNext) {

        testimonialNext.addEventListener(
            "click",
            () => {

                nextTestimonial();

                startTestimonialAutoplay();
            }
        );
    }


    if (testimonialPrev) {

        testimonialPrev.addEventListener(
            "click",
            () => {

                previousTestimonial();

                startTestimonialAutoplay();
            }
        );
    }


    testimonialDots.forEach(
        (dot) => {

            dot.addEventListener(
                "click",
                () => {

                    const slideIndex =
                        Number(dot.dataset.slide);

                    showTestimonial(
                        slideIndex
                    );

                    startTestimonialAutoplay();
                }
            );
        }
    );


    const slider =
        document.querySelector(
            ".testimonial-slider"
        );


    if (slider) {

        slider.addEventListener(
            "mouseenter",
            stopTestimonialAutoplay
        );

        slider.addEventListener(
            "mouseleave",
            startTestimonialAutoplay
        );


        slider.addEventListener(
            "focusin",
            stopTestimonialAutoplay
        );

        slider.addEventListener(
            "focusout",
            startTestimonialAutoplay
        );
    }


    startTestimonialAutoplay();
}


function closeFaqItem(item) {

    const question =
        item.querySelector(
            ".faq-question"
        );

    const answer =
        item.querySelector(
            ".faq-answer"
        );

    if (!question || !answer) {
        return;
    }

    question.setAttribute(
        "aria-expanded",
        "false"
    );

    answer.hidden = true;
}


function openFaqItem(item) {

    const question =
        item.querySelector(
            ".faq-question"
        );

    const answer =
        item.querySelector(
            ".faq-answer"
        );

    if (!question || !answer) {
        return;
    }

    question.setAttribute(
        "aria-expanded",
        "true"
    );

    answer.hidden = false;
}


function initFaqAccordion() {

    faqItems.forEach(
        (item) => {

            const question =
                item.querySelector(
                    ".faq-question"
                );

            if (!question) {
                return;
            }


            question.addEventListener(
                "click",
                () => {

                    const isExpanded =
                        question.getAttribute(
                            "aria-expanded"
                        ) === "true";


                    faqItems.forEach(
                        (otherItem) => {

                            if (
                                otherItem !== item
                            ) {
                                closeFaqItem(
                                    otherItem
                                );
                            }
                        }
                    );



                    if (isExpanded) {
                        closeFaqItem(item);
                    } else {
                        openFaqItem(item);
                    }
                }
            );
        }
    );
}


function escapeRegExp(value) {

    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}


function highlightQuestion(
    questionText,
    searchTerm
) {

    if (!searchTerm) {
        return questionText;
    }


    const safeTerm =
        escapeRegExp(searchTerm);


    const pattern =
        new RegExp(
            `(${safeTerm})`,
            "gi"
        );


    return questionText.replace(
        pattern,
        '<mark>$1</mark>'
    );
}


function initFaqSearch() {

    if (!faqSearchInput) {
        return;
    }


    faqSearchInput.addEventListener(
        "input",
        () => {

            const searchTerm =
                faqSearchInput.value
                    .trim()
                    .toLowerCase();


            let visibleCount = 0;


            faqItems.forEach(
                (item) => {

                    const question =
                        item.querySelector(
                            ".faq-question"
                        );

                    if (!question) {
                        return;
                    }

                    const questionText =
                        question.dataset.originalText ||
                        question
                            .querySelector("span")
                            ?.textContent
                            .trim() ||
                        "";


                    question.dataset.originalText =
                        questionText;


                    const matches =
                        questionText
                            .toLowerCase()
                            .includes(searchTerm);


                    item.hidden = !matches;


                    if (matches) {

                        visibleCount++;


                        const questionSpan =
                            question.querySelector(
                                "span:first-child"
                            );


                        if (questionSpan) {

                            questionSpan.innerHTML =
                                highlightQuestion(
                                    questionText,
                                    searchTerm
                                );
                        }


                    } else {

                        const questionSpan =
                            question.querySelector(
                                "span:first-child"
                            );

                        if (questionSpan) {
                            questionSpan.textContent =
                                questionText;
                        }
                    }
                }
            );


            if (faqEmpty) {

                faqEmpty.hidden =
                    visibleCount !== 0;
            }


            if (searchTerm) {

                announce(
                    `${visibleCount} matching ${
                        visibleCount === 1
                            ? "question"
                            : "questions"
                    } found.`
                );
            }
        }
    );
}


function injectFaqHighlightStyle() {

    const style =
        document.createElement("style");

    style.textContent = `
        .faq-question mark {
            background: rgba(31, 91, 234, 0.14);
            color: var(--blue);
            border-radius: 3px;
            padding: 1px 3px;
        }
    `;

    document.head.appendChild(style);
}

function initContactLinks() {

    const internalContactLinks =
        document.querySelectorAll(
            'a[href="#contact"]'
        );


    internalContactLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const contactSection =
                        document.querySelector(
                            "#contact"
                        );

                    if (!contactSection) {
                        return;
                    }


                    event.preventDefault();

                    closeMobileMenu();

                    scrollToElement(
                        "#contact"
                    );
                }
            );
        }
    );
}


function initGlobalKeyboardControls() {

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            closeMobileMenu();


            if (
                serviceModal &&
                serviceModal.open
            ) {
                closeServiceModal();
            }
        }
    );
}

function init() {

    initTheme();

    initMobileNavigation();

    initHeaderScroll();

    initActiveNavigation();

    initPortfolioFilter();

    initServiceModal();

    initTestimonials();

    initFaqAccordion();

    initFaqSearch();

    injectFaqHighlightStyle();

    initContactLinks();

    initGlobalKeyboardControls();
}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init,
        {
            once: true
        }
    );

} else {

    init();
}