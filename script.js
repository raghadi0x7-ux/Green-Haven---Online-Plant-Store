// تخزين المنتجات في localStorage (السلة)
const buttons = document.querySelectorAll(".add-cart");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`تمت إضافة (${name}) إلى السلة 🌿`);
  });
});

// عرض السلة في صفحة cart.html
if (window.location.pathname.includes("cart.html")) {
  const tableBody = document.querySelector("#cart-table tbody");
  const totalSpan = document.querySelector("#cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    tableBody.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price} ريال</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="qty-input">
        </td>
        <td>${itemTotal} ريال</td>
        <td><button class="remove-btn" data-index="${index}">❌</button></td>
      `;
      tableBody.appendChild(row);
    });

    totalSpan.textContent = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  renderCart();

  // تحديث الكمية
  tableBody.addEventListener("input", e => {
    if (e.target.classList.contains("qty-input")) {
      const index = e.target.dataset.index;
      cart[index].quantity = parseInt(e.target.value);
      renderCart();
    }
  });

  // إزالة منتج
  tableBody.addEventListener("click", e => {
    if (e.target.classList.contains("remove-btn")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      renderCart();
    }
  });
}


// صفحة الدفع checkout.html
if (window.location.pathname.includes("checkout.html")) {
  const totalSpan = document.getElementById("checkout-total");
  const form = document.getElementById("checkout-form");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalSpan.textContent = total.toFixed(2);

  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("تمت عملية الدفع بنجاح ✅");
    localStorage.removeItem("cart"); // تفريغ السلة
    window.location.href = "thankyou.html"; // الانتقال لصفحة الشكر
  });
}

