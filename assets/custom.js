class CartItemRemove extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.key = this.getAttribute('key')
        this.addEventListener('click', e => {
            fetch(theme.routes.cartChange + "?id=" + this.key + "&amp;quantity=0")
            .then(res => res.json())
            .then(json => {
                document.dispatchEvent(new Event('cart:build'))
            })
        })
    }
}

customElements.define('cart-item-remove', CartItemRemove);

/* custom add to cart button in grid item */
Shopify = Shopify || {}
Shopify.theme = Shopify.theme || {}
Shopify.theme.cart = Shopify.theme.cart || {}
Shopify.theme.cart.addToCart = function (itemsToAdd, events = true, callback = (products) => {}) {
  let that = this;
  fetch(routes.cart_add_url, {
    body: JSON.stringify(itemsToAdd),
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json', 'Accept':'application/json', 'X-Requested-With': 'XMLHttpRequest'},
    method: 'POST'
  }).then(function(response) {
    if(!response.ok) {
      response.text().then(text => {
        let error = JSON.parse(text);
        console.error(error.status);
        console.error(error.message);
        console.error(error.description);
      })
    } else {
      return response.json();
    }   
  }).then(function(products) {
    if(events){
      window.dispatchEvent(new CustomEvent("ajaxProduct:added", products.items[0]));
    } 
    callback(products);
  }).catch(function(err) {
    console.error(err);
  }
  );
}

let atc_buttons = document.querySelectorAll('button[data-product-add-to-cart]');
atc_buttons.forEach(atc_button => {
  atc_button.addEventListener('click', () => {
    let variant_id = atc_button.dataset.variantId;
    if(!!variant_id){
      Shopify.theme.cart.addToCart({items: [{id: variant_id, quantity: 1}]}, true, (products) => {
        document.dispatchEvent(new CustomEvent('cart:build'));
        document.dispatchEvent(new CustomEvent('cart:open'));
      });
    }
  })
});



/** Wishlist King Code **/
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        WishlistKing.observe(
            {
                // Adjust the selector target your cart link
                selector: "header a.js-drawer-open-cart",
            },
            (target) => {
                target.insertBefore(
                    WishlistKing.createComponent("wishlist-link")
                )
            }
        );

        WishlistKing.observe(
            {
                // Adjust the selector to target the grid item
                selector: ".grid__item[data-product-id]",
            },
            (target) => {
                target.append(
                    WishlistKing.createComponent("wishlist-button-floating", {
                        // Get product id from data attribute
                        id: target.container.getAttribute("data-product-id"),
                    })
                );
            }
        );
    }, 500);
});

// span number to go from 0 to X in Y seconds for all elements with class .count
document.addEventListener("DOMContentLoaded", function () {
    let count = document.querySelectorAll(".count-up-number");
    count.forEach((el) => {
        // Execute when element is in view do function
        window.addEventListener('scroll', function (event) {
            if (isInViewport(el)) {
                if (el.classList.contains("counted")) return;
                let duration = Number(el.getAttribute("data-duration"));
                let start = Number(el.getAttribute("data-start"));
                let end = Number(el.getAttribute("data-end"));
                if (typeof duration !== "undefined" && typeof start !== "undefined" && typeof end !== "undefined") {
                    countingUp(el, start, end, duration);
                }
                el.classList.add("counted");
            }
        }, false);
    });
});

function isInViewport(element) {
    // Get the bounding client rectangle position in the viewport
    var bounding = element.getBoundingClientRect();

    // Checking part. Here the code checks if it's *fully* visible
    // Edit this part if you just want a partial visibility
    if (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    ) {
        //console.log('In the viewport! :)');
        return true;
    } else {
        //console.log('Not in the viewport. :(');
        return false;
    }
}

// example code <span class='count-up-number' data-start='0' data-end='39' data-duration='2'>0</span>
/*
    * @param {element} el - element to count up
    * @param {number} start - number to start counting from
    * @param {number} end - number to count to
    * @param {number} duration - duration in seconds
    * @return {void}
    * @example countingUp(el, start, end, duration)
    * @example countingUp(element, 0, 39, 2)
 */
function countingUp(el, start, end, duration) {
    let options = {
        useEasing: true,
        useGrouping: true,
        startVal: start,
        duration: duration,
        separator: ",",
        decimal: "."
    };
    const counter = new countUp.CountUp(el, end, options);
    counter.start();
}


