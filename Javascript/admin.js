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
