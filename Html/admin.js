// --- In-memory sample data ---
let products = [
  {id: 1, name: "Carvn Astronut T-Shirt", category: "T-Shirts", price: 200, stock: 12, sold: 5},
  {id: 2, name: "Classic Denim Jeans", category: "Jeans", price: 450, stock: 8, sold: 3},
  {id: 3, name: "Sport Hoodie", category: "Hoodies", price: 350, stock: 6, sold: 4}
];

let orders = []; // will hold generated orders
let lastOrderId = 1000;

// --- DOM refs ---
const productsTableBody = document.querySelector("#productsTable tbody");
const ordersTableBody = document.querySelector("#ordersTable tbody");
const productForm = document.getElementById("productForm");
const openAddBtn = document.getElementById("openAddProduct");
const cancelProductBtn = document.getElementById("cancelProduct");
const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productCategoryInput = document.getElementById("productCategory");
const productPriceInput = document.getElementById("productPrice");
const productStockInput = document.getElementById("productStock");
const statProducts = document.getElementById("statProducts");
const statOrders = document.getElementById("statOrders");
const statSold = document.getElementById("statSold");
const clearOrdersBtn = document.getElementById("clearOrders");
const globalSearch = document.getElementById("globalSearch");
const searchBtn = document.getElementById("searchBtn");

// --- Charts ---
let soldChart, catChart;

function initCharts(){
  const soldCtx = document.getElementById("soldChart").getContext("2d");
  const catCtx = document.getElementById("catChart").getContext("2d");

  soldChart = new Chart(soldCtx, {
    type: "bar",
    data: { labels: [], datasets: [{ label: "Sold", data: [], backgroundColor: "#088178" }] },
    options: { responsive: true, plugins:{legend:{display:false}} }
  });

  catChart = new Chart(catCtx, {
    type: "pie",
    data: { labels: [], datasets: [{ data: [], backgroundColor: ["#8e44ad","#3498db","#a0522d","#f39c12","#2ecc71"] }] },
    options: { responsive: true }
  });
}

// --- Render functions ---
function renderProductsTable(filterText = ""){
  productsTableBody.innerHTML = "";
  const list = products.filter(p => {
    if (!filterText) return true;
    const t = filterText.toLowerCase();
    return p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t) || String(p.id) === filterText;
  });

  list.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>R${p.price.toFixed(2)}</td>
      <td>${p.stock}</td>
      <td>${p.sold}</td>
      <td class="actions">
        <button class="btn small" data-action="edit" data-id="${p.id}"><i class="fas fa-edit"></i></button>
        <button class="btn small" data-action="delete" data-id="${p.id}"><i class="fas fa-trash"></i></button>
        <button class="btn small" data-action="sale" data-id="${p.id}"><i class="fas fa-cart-plus"></i> Sale</button>
      </td>
    `;
    productsTableBody.appendChild(tr);
  });
  updateStats();
  attachProductButtons();
  updateCharts();
}

function renderOrdersTable(){
  ordersTableBody.innerHTML = "";
  orders.slice().reverse().forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>#${o.id}</td><td>${o.productName}</td><td>${o.qty}</td><td>R${o.total.toFixed(2)}</td><td>${o.date}</td>`;
    ordersTableBody.appendChild(tr);
  });
  updateStats();
}

// --- Stats ---
function updateStats(){
  statProducts.textContent = products.length;
  statOrders.textContent = orders.length;
  statSold.textContent = products.reduce((s,p)=>s+p.sold,0);
}

// --- product actions wiring ---
function attachProductButtons(){
  document.querySelectorAll('#productsTable button').forEach(btn=>{
    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);
    btn.onclick = ()=> {
      if(action === "edit") openEditProduct(id);
      if(action === "delete") deleteProduct(id);
      if(action === "sale") simulateSale(id);
    };
  });
}

// --- product CRUD ---
openAddBtn.onclick = ()=> {
  productForm.classList.remove("hidden");
  productIdInput.value = "";
  productNameInput.value = "";
  productCategoryInput.value = "";
  productPriceInput.value = "";
  productStockInput.value = "";
};

cancelProductBtn.onclick = ()=> productForm.classList.add("hidden");

productForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const idVal = productIdInput.value;
  const name = productNameInput.value.trim();
  const category = productCategoryInput.value.trim();
  const price = Number(productPriceInput.value) || 0;
  const stock = Number(productStockInput.value) || 0;

  if(!name || !category) return alert("Please enter name and category.");

  if(idVal){
    // edit
    const pid = Number(idVal);
    const p = products.find(x=>x.id===pid);
    if(p){
      p.name = name; p.category = category; p.price = price; p.stock = stock;
    }
  } else {
    // add
    const newId = (products.length ? Math.max(...products.map(p=>p.id)) : 0) + 1;
    products.push({id:newId, name, category, price, stock, sold:0});
  }

  productForm.classList.add("hidden");
  renderProductsTable(globalSearch.value.trim());
});

function openEditProduct(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  productIdInput.value = p.id;
  productNameInput.value = p.name;
  productCategoryInput.value = p.category;
  productPriceInput.value = p.price;
  productStockInput.value = p.stock;
  productForm.classList.remove("hidden");
}

function deleteProduct(id){
  if(!confirm("Delete product?")) return;
  products = products.filter(p=>p.id !== id);
  renderProductsTable(globalSearch.value.trim());
}

// --- simulate sale: create an order, decrement stock, increment sold ---
function simulateSale(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  if(p.stock <= 0) return alert("Out of stock.");
  const qty = 1; // single click creates 1 qty order (could prompt)
  p.stock -= qty;
  p.sold += qty;
  const order = {
    id: ++lastOrderId,
    productId: p.id,
    productName: p.name,
    qty,
    total: p.price * qty,
    date: new Date().toLocaleString()
  };
  orders.push(order);
  renderProductsTable(globalSearch.value.trim());
  renderOrdersTable();
}

// --- charts update ---
function updateCharts(){
  // soldChart: show top products by sold
  const labels = products.map(p=>p.name);
  const soldData = products.map(p=>p.sold);
  soldChart.data.labels = labels;
  soldChart.data.datasets[0].data = soldData;
  soldChart.update();

  // catChart: distribution by category
  const catMap = {};
  products.forEach(p=>{
    catMap[p.category] = (catMap[p.category] || 0) + (p.stock + p.sold); // size of category = items total
  });
  catChart.data.labels = Object.keys(catMap);
  catChart.data.datasets[0].data = Object.values(catMap);
  catChart.update();
}

// --- orders clear ---
clearOrdersBtn.onclick = ()=> {
  if(!confirm("Clear all orders?")) return;
  orders = [];
  renderOrdersTable();
};

// --- search ---
searchBtn.onclick = ()=> {
  const q = globalSearch.value.trim();
  renderProductsTable(q);
  renderOrdersTable();
};
globalSearch.addEventListener("keyup", (e)=>{
  if(e.key === "Enter") searchBtn.click();
});

// --- initial render ---
initCharts();
renderProductsTable();
renderOrdersTable();


/* admin.js -- combined focused users + keep products code intact where needed
   1) logs on load so you can confirm file loaded
   2) robust users CRUD pointing to your Spring controller at /user
*/

console.log("admin.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Config ----------
  const USER_API = "http://localhost:8080/user"; // matches your controller @RequestMapping("/user")

  // ---------- Helper ----------
  function escapeHtml(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---------- DOM refs (users) ----------
  const usersTableBody = document.querySelector("#usersTable tbody");
  const userForm = document.getElementById("userForm");
  const openAddUserBtn = document.getElementById("openAddUser");
  const cancelUserBtn = document.getElementById("cancelUser");
  const userIdInput = document.getElementById("userId");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const phoneInput = document.getElementById("phoneNumber");
  const addressInput = document.getElementById("address");

  // sanity checks
  if(!usersTableBody) console.warn("#usersTable tbody not found in DOM");
  if(!userForm) console.warn("#userForm not found in DOM");
  if(!openAddUserBtn) console.warn("#openAddUser button not found in DOM");
  if(!cancelUserBtn) console.warn("#cancelUser button not found in DOM");

  // ---------- Load users ----------
  async function loadUsers() {
    if (!usersTableBody) return;
    try {
      console.log("Loading users from", USER_API);
      const res = await fetch(USER_API);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const users = await res.json();
      // build rows
      usersTableBody.innerHTML = users.map(u => `
        <tr>
          <td>${u.userId ?? ""}</td>
          <td>${escapeHtml(u.firstName ?? "")}</td>
          <td>${escapeHtml(u.lastName ?? "")}</td>
          <td>${escapeHtml(u.email ?? "")}</td>
          <td>${escapeHtml(u.phoneNumber ?? "")}</td>
          <td>${escapeHtml(u.address ?? "")}</td>
          <td class="actions">
            <button class="btn small" data-action="edit" data-id="${u.userId}"><i class="fas fa-edit"></i></button>
            <button class="btn small" data-action="delete" data-id="${u.userId}"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `).join("");
      console.log(`Loaded ${users.length} users`);
    } catch (err) {
      console.error("Failed to load users:", err);
      if (usersTableBody) usersTableBody.innerHTML = `<tr><td colspan="7">Failed to load users: ${escapeHtml(err.message || err)}</td></tr>`;
    }
  }

  // ---------- Open Add User (clear form) ----------
  if (openAddUserBtn) {
    openAddUserBtn.addEventListener("click", () => {
      userIdInput.value = "";
      firstNameInput.value = "";
      lastNameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      phoneInput.value = "";
      addressInput.value = "";
      userForm.classList.remove("hidden");
      firstNameInput.focus();
    });
  }

  // ---------- Cancel User ----------
  if (cancelUserBtn) {
    cancelUserBtn.addEventListener("click", () => userForm.classList.add("hidden"));
  }

  // ---------- Submit (Create or Update) ----------
  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value, // if you store plain password (not ideal) — follow your current backend
        phoneNumber: phoneInput.value.trim(),
        address: addressInput.value.trim()
      };

      const id = userIdInput.value;
      try {
        if (id) {
          // Update
          const res = await fetch(`${USER_API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error(`Update failed: ${res.status} ${res.statusText}`);
          console.log("User updated:", id);
        } else {
          // Create (signup/save)
          const res = await fetch(`${USER_API}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error(`Create failed: ${res.status} ${res.statusText}`);
          console.log("User created");
        }
        userForm.classList.add("hidden");
        await loadUsers();
      } catch (err) {
        console.error("Error saving user:", err);
        alert("Error saving user: " + (err.message || err));
      }
    });
  }

  // ---------- Delegated actions (Edit / Delete) ----------
  if (usersTableBody) {
    usersTableBody.addEventListener("click", async (evt) => {
      const btn = evt.target.closest("button[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (action === "edit") {
        try {
          const res = await fetch(`${USER_API}/user/${id}`); // controller GET single is /user/user/{id}
          if (!res.ok) throw new Error(`Fetch user failed: ${res.status}`);
          const u = await res.json();
          userIdInput.value = u.userId ?? "";
          firstNameInput.value = u.firstName ?? "";
          lastNameInput.value = u.lastName ?? "";
          emailInput.value = u.email ?? "";
          passwordInput.value = u.password ?? "";
          phoneInput.value = u.phoneNumber ?? "";
          addressInput.value = u.address ?? "";
          userForm.classList.remove("hidden");
          firstNameInput.focus();
        } catch (err) {
          console.error("Failed to fetch user:", err);
          alert("Failed to fetch user: " + (err.message || err));
        }
      } else if (action === "delete") {
        if (!confirm("Delete this user?")) return;
        try {
          const res = await fetch(`${USER_API}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
          console.log("User deleted:", id);
          await loadUsers();
        } catch (err) {
          console.error("Failed to delete user:", err);
          alert("Failed to delete user: " + (err.message || err));
        }
      }
    });
  }

  // ---------- Initial load ----------
  loadUsers();

  // ---------- OPTIONAL: make sure products code still runs below (if you have it)
  // If you kept your product code in file, it will still run.
  // If you want me to merge the entire products + users file into one file let me know.

});
