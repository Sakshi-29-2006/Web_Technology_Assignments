
document.addEventListener("DOMContentLoaded", function () {

    /* CURRENT YEAR */

    var year = document.getElementById("currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* NAVBAR */

    var navMenu = document.getElementById("navMenu");

    var navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (navMenu && navMenu.classList.contains("show")) {

                var navbar = bootstrap.Collapse.getOrCreateInstance(navMenu);

                navbar.hide();

            }

        });

    });


    /* ACTIVE NAV LINK */

    var sections = document.querySelectorAll("header[id], section[id], footer[id]");

    function updateActiveLink() {

        var currentPosition = window.scrollY + 150;

        sections.forEach(function (section) {

            var sectionTop = section.offsetTop;

            var sectionBottom = sectionTop + section.offsetHeight;

            var sectionId = section.getAttribute("id");

            if (
                currentPosition >= sectionTop &&
                currentPosition < sectionBottom
            ) {

                navLinks.forEach(function (link) {

                    link.classList.remove("active");

                    if (link.getAttribute("href") === "#" + sectionId) {
                        link.classList.add("active");
                    }

                });

            }

        });

    }

    window.addEventListener("scroll", updateActiveLink);

    updateActiveLink();


    /* BACK TO TOP */

    var backToTop = document.getElementById("backToTop");

    if (backToTop) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 500) {

                backToTop.classList.add("is-visible");

            } else {

                backToTop.classList.remove("is-visible");

            }

        });


        backToTop.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* SMOOTH SCROLL */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            var targetId = this.getAttribute("href");

            if (targetId === "#") {
                return;
            }

            var target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                var navbar = document.querySelector(".navbar-custom");

                var navbarHeight = navbar
                    ? navbar.offsetHeight
                    : 0;

                var targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            }

        });

    });

});