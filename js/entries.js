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
  document.getElementById("export-btn").addEventListener("click", () => exportCSV(entries));

  //renderEntries(entries);
  
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const editBanner = document.getElementById("edit-indicator");

	const settings = storage.loadSettings();
	document.getElementById("unit-label").textContent = settings.units || "lb";

  // Default date = today
  document.getElementById("entry-date").value = new Date()
    .toISOString()
    .slice(0, 10);

  function getMostRecentEntry() {
	if (entries.length === 0) return null;

	  return entries
		.slice()
		.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const date = document.getElementById("entry-date").value;
    const weight = parseFloat(document.getElementById("entry-weight").value);
    const comments = document.getElementById("entry-comments").value;

    if (!date || !weight) return;

	//Resonableness check
	const previous = getMostRecentEntry();

	if (previous) {
	  const diff = Math.abs(weight - previous.weight);
	  const pct = diff / previous.weight;

	  const tooBig =
		diff > 10 || pct > 0.08;

	  if (tooBig) {
		const ok = confirm(
		  `This entry differs from your last weight by ${diff.toFixed(
			1
		  )} lbs (${(pct * 100).toFixed(
			1
		  )}%). Do you want to save it anyway?`
		);

		if (!ok) return; // user cancelled
	  }
	}
	
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
  
  // --- CSV IMPORT ---
	const importBtn = document.getElementById("import-btn");
	const importFile = document.getElementById("import-file");

	importBtn.addEventListener("click", () => importFile.click());

	importFile.addEventListener("change", () => {
	  const file = importFile.files[0];
	  if (!file) return;

	  const reader = new FileReader();

	  reader.onload = e => {
		const text = e.target.result;
		const rows = text.split(/\r?\n/).filter(r => r.trim() !== "");

		// Expect header row: id,date,weight,comments
		const [header, ...dataRows] = rows;
		const cols = header.split(",");

		if (cols.length < 4) {
		  alert("Invalid CSV format. Expected: id,date,weight,comments");
		  return;
		}

		const imported = dataRows.map(row => {
		  const parts = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];

		  const [id, date, weight, comments] = parts.map(v =>
			v.replace(/^"|"$/g, "").replace(/""/g, '"')
		  );

		  return {
			id: Number(id),
			date,
			weight: Number(weight),
			comments: comments || ""
		  };
		});

		let validImportedRows = [];
		for (let i = 0; i < imported.length; i++) {
		  const e = imported[i];
		  const rowNum = i + 2; // +2 because row 1 is header, row 2 is first data row

			console.log(e);
		  if (!e.id || isNaN(e.id)) {
			alert(`Row ${rowNum}: Invalid ID value "${e.id}". Import cancelled.`);
			continue;
		  }

		  if (!e.date || isNaN(Date.parse(e.date))) {
			alert(`Row ${rowNum}: Invalid date value "${e.date}". Import cancelled.`);
			continue;
		  }

		  if (isNaN(e.weight)) {
			alert(`Row ${rowNum}: Invalid weight value "${e.weight}". Import cancelled.`);
			continue;
		  }
		  
		  validImportedRows.push(e)
		}


		// Basic validation
		const invalid = validImportedRows.some(e =>
		  !e.id || !e.date || isNaN(e.weight)
		);

		if (invalid) {
		  alert("CSV contains invalid rows. Import cancelled.");
		  return;
		}

		// Replace all entries
		entries = imported;
		storage.saveEntries(entries);
		renderList();

		alert("Import successful!");
	  };

	  reader.readAsText(file);
	});

  renderList();
}


function exportCSV(entries) {console.log("Hello");
  const sorted = entries
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Build CSV header + rows
  const rows = [
    ["id", "date", "weight", "comments"],
    ...sorted.map(e => [
      e.id,
      e.date,
      e.weight,
      (e.comments || "").replace(/\n/g, " ") // remove newlines
    ])
  ];

  // Convert to CSV string
  const csv = rows.map(r =>
    r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
  ).join("\n");

  // Create downloadable file
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `entries-${today}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}