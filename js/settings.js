import { storage } from "./storage.js";

let settings = {
  units: "lb",
  goalWeight: "",
  ...storage.loadSettings()
};

export function initSettings() {
  const form = document.getElementById("settings-form");
  //const exportBtn = document.getElementById("export-btn");
  const importBtn = document.getElementById("import-btn");
  const importFile = document.getElementById("import-file");

  // Load settings into the form
  const unitInput = document.querySelector(
    `input[name="units"][value="${settings.units}"]`
  );

  if (unitInput) {
    unitInput.checked = true;
  }

  document.getElementById("goal-weight").value = settings.goalWeight || "";

  form.addEventListener("submit", e => {
    e.preventDefault();

    const units = document.querySelector('input[name="units"]:checked').value;
    const goalWeight = document.getElementById("goal-weight").value;

    settings = { units, goalWeight };
    storage.saveSettings(settings);

    alert("Settings saved");
  });

  //Moved to Entries exportBtn.addEventListener("click", () => exportCSV());
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", () => alert("Import not implemented yet"));
}
