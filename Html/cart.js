document.addEventListener("DOMContentLoaded", () => {
    const subtotalElement = document.getElementById("subtotal");
    const prices = [200, 200, 200]; // Each shirt price
    const qtyElements = document.querySelectorAll(".qty");
    const plusButtons = document.querySelectorAll(".plus");
    const minusButtons = document.querySelectorAll(".minus");
    const removeButtons = document.querySelectorAll(".remove-item");

    function updateSubtotal() {
        let total = 0;
        qtyElements.forEach((qty, index) => {
            total += parseInt(qty.textContent) * prices[index];
        });
        subtotalElement.textContent = `R${total},00`;
    }

    plusButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            qtyElements[index].textContent = parseInt(qtyElements[index].textContent) + 1;
            updateSubtotal();
        });
    });

    minusButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            let current = parseInt(qtyElements[index].textContent);
            if (current > 1) {
                qtyElements[index].textContent = current - 1;
                updateSubtotal();
            }
        });
    });

    removeButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            btn.parentElement.remove();
            prices[index] = 0; // Prevent subtotal from counting it
            updateSubtotal();
        });
    });

    document.getElementById("applyPromo").addEventListener("click", () => {
        const code = document.getElementById("promoCode").value.trim();
        if (code === "SAVE10") {
            alert("Promo applied! 10% off");
        } else {
            alert("Invalid promo code");
        }
    });

    // Checkout button click event
    document.getElementById("checkoutBtn").addEventListener("click", () => {
        const subtotal = subtotalElement.textContent;
        if (subtotal === "R0,00") {
            alert("Your cart is empty! Please add items before checking out.");
        } else {
            alert(`Proceeding to checkout. Total: ${subtotal}`);
            // Example redirect (later you can link to payment page)
            // window.location.href = "checkout.html";
        }
    });

    updateSubtotal();
});
