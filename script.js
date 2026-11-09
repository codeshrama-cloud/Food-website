
let nav = document.querySelector(".navigation-wrap");

window.onscroll = function () {
    if (nav) {
        if (document.documentElement.scrollTop > 20) {
            nav.classList.add("scroll-on");
        } else {
            nav.classList.remove("scroll-on");
        }
    }
};

let navBar = document.querySelectorAll(".nav-link");
let navCollapse = document.querySelector(".navbar-collapse.collapse");

navBar.forEach(function (a) {
    a.addEventListener("click", function () {
        if (navCollapse) {
            navCollapse.classList.remove("show");
        }
    });
});

let links = document.querySelectorAll(".nav-link");
let sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", function () {
    let current = "";

    sections.forEach(function (section) {
        let sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    links.forEach(function (link) {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

let cards = document.querySelectorAll("#explore-food .card");

cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
        card.style.transform = "translateY(-8px)";
        card.style.transition = "0.3s";
        card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
    });

    card.addEventListener("mouseleave", function () {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "none";
    });
});

let toast = document.createElement("div");

toast.style.position = "fixed";
toast.style.bottom = "25px";
toast.style.right = "25px";
toast.style.background = "#00c604";
toast.style.color = "#fff";
toast.style.padding = "15px 25px";
toast.style.borderRadius = "8px";
toast.style.fontSize = "15px";
toast.style.zIndex = "2000";
toast.style.display = "none";

document.body.appendChild(toast);

function showMessage(message) {
    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(function () {
        toast.style.display = "none";
    }, 2500);
}

let orderButtons = document.querySelectorAll("#explore-food .card button");

orderButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        let card = button.closest(".card");
        let item = card.querySelector("h4").textContent;

        showMessage(item + " added to your order!");
    });
});

let mainButtons = document.querySelectorAll(".main-btn");

mainButtons.forEach(function (button) {
    let text = button.textContent.trim().toLowerCase();

    if (text.includes("book online")) {
        button.addEventListener("click", function () {
            showMessage("Online booking feature coming soon!");
        });
    }

    if (text.includes("contact us")) {
        button.addEventListener("click", function () {
            document.querySelector("#footer").scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    if (text.includes("learn more")) {
        button.addEventListener("click", function () {
            document.querySelector("#story").scrollIntoView({
                behavior: "smooth"
            });
        });
    }
});

let topButton = document.createElement("button");

topButton.innerHTML = "↑";
topButton.style.position = "fixed";
topButton.style.bottom = "25px";
topButton.style.left = "25px";
topButton.style.width = "45px";
topButton.style.height = "45px";
topButton.style.border = "none";
topButton.style.borderRadius = "50%";
topButton.style.background = "#00c604";
topButton.style.color = "#fff";
topButton.style.fontSize = "25px";
topButton.style.cursor = "pointer";
topButton.style.display = "none";
topButton.style.zIndex = "1000";

document.body.appendChild(topButton);

window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
        topButton.style.display = "block";
    } else {
        topButton.style.display = "none";
    }
});

topButton.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

let revealItems = document.querySelectorAll(
    "#explore-food .card, #team .card, .about-section img"
);

let observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealItems.forEach(function (item) {
    item.style.opacity = "0";
    item.style.transform = "translateY(30px)";
    item.style.transition = "all 0.7s ease";

    observer.observe(item);
});

//   counter("count1", 0, 1287, 3000);
//   counter("count2", 100, 4500, 2500);
//   counter("count3", 0, 2860, 3000);
//   counter("count4", 0, 3942, 3000);
// });
