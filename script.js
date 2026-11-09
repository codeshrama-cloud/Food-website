
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

// Feastify shopping cart

const cart = new Map();
const cartItemsContainer = document.getElementById("cart-items");
const cartCountElement = document.getElementById("cart-count");
const cartTotalElement = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-btn");

function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character];
    });
}

function updateMenuControls() {
    document.querySelectorAll("#explore-food .card").forEach(function (card) {
        let button = card.querySelector(".add-to-cart-btn");
        let control = card.querySelector(".menu-quantity");

        let name;
        let price;
        let id;

        if (button) {
            name = button.dataset.name;
            price = Number(button.dataset.price);
            id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        } else if (control) {
            name = control.dataset.name;
            price = Number(control.dataset.price);
            id = control.dataset.id;
        } else {
            return;
        }

        let item = cart.get(id);

        if (item) {
            if (!control) {
                control = document.createElement("div");
                control.className = "menu-quantity";
                control.dataset.id = id;
                control.dataset.name = name;
                control.dataset.price = price;
                button.replaceWith(control);
            }

            control.innerHTML = `
                <button type="button" class="menu-qty-btn menu-decrease">−</button>
                <span class="menu-qty-value">${item.quantity}</span>
                <button type="button" class="menu-qty-btn menu-increase">+</button>
            `;
        } else if (control) {
            button = document.createElement("button");
            button.type = "button";
            button.className = "mt-4 main-btn add-to-cart-btn";
            button.dataset.name = name;
            button.dataset.price = price;
            button.innerHTML = '<i class="fas fa-cart-plus me-2"></i>Add to Cart';
            control.replaceWith(button);
        }
    });
}

function renderCart() {
    if (!cartItemsContainer) return;

    const entries = Array.from(cart.values());

    const count = entries.reduce(function (sum, item) {
        return sum + item.quantity;
    }, 0);

    const total = entries.reduce(function (sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    cartCountElement.textContent = count;
    cartTotalElement.textContent = formatPrice(total);
    checkoutButton.disabled = entries.length === 0;

    if (!entries.length) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <h4>Your cart is empty</h4>
                <p>Add something delicious from our menu!</p>
                <a href="#explore-food" class="main-btn">Explore Foods</a>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = entries.map(function (item) {
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${escapeHTML(item.name)}</h4>
                        <span class="cart-item-price">${formatPrice(item.price)} each</span>
                    </div>

                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button type="button" class="quantity-btn decrease-quantity" data-id="${item.id}">−</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button type="button" class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                        </div>

                        <strong class="cart-line-total">${formatPrice(item.price * item.quantity)}</strong>

                        <button type="button" class="remove-cart-item" data-id="${item.id}">
                            <i class="fas fa-trash-alt"></i> Remove
                        </button>
                    </div>
                </div>
            `;
        }).join("");
    }

    updateMenuControls();
}

document.querySelector("#explore-food").addEventListener("click", function (event) {
    const addButton = event.target.closest(".add-to-cart-btn");
    const increaseButton = event.target.closest(".menu-increase");
    const decreaseButton = event.target.closest(".menu-decrease");

    if (addButton) {
        const name = addButton.dataset.name;
        const price = Number(addButton.dataset.price);
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        if (cart.has(id)) {
            cart.get(id).quantity++;
        } else {
            cart.set(id, {
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }

        showMessage(name + " added to your cart!");
        renderCart();
    }

    if (increaseButton) {
        const control = increaseButton.closest(".menu-quantity");
        const item = cart.get(control.dataset.id);

        if (item) {
            item.quantity++;
            renderCart();
        }
    }

    if (decreaseButton) {
        const control = decreaseButton.closest(".menu-quantity");
        const item = cart.get(control.dataset.id);

        if (item) {
            item.quantity--;

            if (item.quantity <= 0) {
                cart.delete(item.id);
            }

            renderCart();
        }
    }
});

cartItemsContainer.addEventListener("click", function (event) {
    const increase = event.target.closest(".increase-quantity");
    const decrease = event.target.closest(".decrease-quantity");
    const remove = event.target.closest(".remove-cart-item");

    if (increase) {
        const item = cart.get(increase.dataset.id);
        if (item) item.quantity++;
    } else if (decrease) {
        const item = cart.get(decrease.dataset.id);

        if (item) {
            item.quantity--;

            if (item.quantity <= 0) {
                cart.delete(item.id);
            }
        }
    } else if (remove) {
        cart.delete(remove.dataset.id);
    } else {
        return;
    }

    renderCart();
});

checkoutButton.addEventListener("click", function () {
    if (!cart.size) return;

    const items = Array.from(cart.values());

    const total = items.reduce(function (sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    const summary = items.map(function (item) {
        return `${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`;
    }).join("\n");

    alert(
        "Feastify Order Summary\n\n" +
        summary +
        "\n\nTotal: " + formatPrice(total) +
        "\n\nDemo checkout only — connect a payment provider to accept real payments."
    );
});

renderCart();


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
