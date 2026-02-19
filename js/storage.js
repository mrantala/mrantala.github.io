export const storage = {
  loadEntries() {
    return JSON.parse(localStorage.getItem("entries") || "[]");
  },

  saveEntries(entries) {
    localStorage.setItem("entries", JSON.stringify(entries));
  }
};