import { storage } from "./storage.js";

//let entries = storage.loadEntries();
// let entries = storage.loadEntries().sort((a, b) => {
  // return new Date(a.date) - new Date(b.date);
// });

//

// function renderEntries(entries) {
  // const list = document.getElementById("entry-list");
  // list.innerHTML = "";

  // const sorted = [...entries].sort((a, b) => {
    // return new Date(a.date) - new Date(b.date);
  // });

  // sorted.forEach(entry => {
    // const li = document.createElement("li");
    // li.textContent = `${entry.date}: ${entry.weight}`;	
    // list.appendChild(li);
  // });
// }

export function initEntries() {
  let editingId = null;
  const form = document.getElementById("entry-form");
  const list = document.getElementById("entry-list");
  
  let entries = storage.loadEntries() || [];
  //renderEntries(entries);
  
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const editBanner = document.getElementById("edit-indicator");

	const settings = storage.loadSettings();
	document.getElementById("unit-label").textContent = settings.units || "lb";

  // Default date = today
  document.getElementById("entry-date").value = new Date()
    .toISOString()
    .slice(0, 10);

  form.addEventListener("submit", e => {
    e.preventDefault();

    const date = document.getElementById("entry-date").value;
    const weight = parseFloat(document.getElementById("entry-weight").value);
    const comments = document.getElementById("entry-comments").value;

    if (!date || !weight) return;

    if (editingId) {
      const entry = entries.find(e => e.id === editingId);
      entry.date = date;
      entry.weight = weight;
      entry.comments = comments;
      editingId = null;
    } else {
      entries.push({
        id: Date.now(),
        date,
        weight,
        comments
      });
    }

    storage.saveEntries(entries);
    resetForm();
    renderList();
  });

  cancelBtn.addEventListener("click", () => {
    editingId = null;
    resetForm();
  });

  function resetForm() {
    form.reset();
    document.getElementById("entry-date").value = new Date()
      .toISOString()
      .slice(0, 10);

    editBanner.classList.add("hidden");
    cancelBtn.classList.add("hidden");
  }

  function renderList() {
  list.innerHTML = "";

  entries
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))   // chronological
    .forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.date} — ${entry.weight}`;

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.addEventListener("click", () => {
        editingId = entry.id;
        document.getElementById("entry-date").value = entry.date;
        document.getElementById("entry-weight").value = entry.weight;
        document.getElementById("entry-comments").value = entry.comments;

        editBanner.classList.remove("hidden");
        cancelBtn.classList.remove("hidden");
      });

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.addEventListener("click", () => {
        entries = entries.filter(e => e.id !== entry.id);
        storage.saveEntries(entries);
        renderList();
      });

      li.append(" ", editBtn, " ", delBtn);
      list.appendChild(li);
    });
  }

  renderList();
}