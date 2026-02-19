export const storage = {
	loadEntries() {
		return JSON.parse(localStorage.getItem("entries") || "[]");
	},

	saveEntries(entries) {
		localStorage.setItem("entries", JSON.stringify(entries));
	},
  
	loadSettings() {
	  return JSON.parse(localStorage.getItem("settings") || "{}");
	},

	saveSettings(settings) {
	  localStorage.setItem("settings", JSON.stringify(settings));
	}
};
