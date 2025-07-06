import { useState } from "react";

export default function SetupPage() {
  const [clearExisting, setClearExisting] = useState(true);

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(",").map(v => v.trim());
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i] || "";
      });
      return obj;
    });
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const parsed = parseCSV(event.target.result);

      if (type === "players") {
        const filtered = parsed.filter(p => p.name && p.speciality && p.basePrice);
        const existing = JSON.parse(localStorage.getItem("auction_players") || "[]");
        const final = clearExisting ? filtered : [...existing, ...filtered];
        localStorage.setItem("auction_players", JSON.stringify(final));
        alert(`✅ ${filtered.length} players uploaded.`);
      }

      if (type === "teams") {
        const filtered = parsed.filter(t => t.team && t.purse);
        const existing = JSON.parse(localStorage.getItem("auction_teams") || "[]");
        const final = clearExisting ? filtered : [...existing, ...filtered];
        localStorage.setItem("auction_teams", JSON.stringify(final));
        alert(`✅ ${filtered.length} teams uploaded.`);
      }
    };

    reader.readAsText(file);
    // Reset input so same file can be selected again
    e.target.value = null;
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">⚙️ Setup Window</h2>

      {/* Clear Existing Checkbox */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={clearExisting}
          onChange={() => setClearExisting(!clearExisting)}
        />
        <span className="text-sm">Clear existing data before upload</span>
      </label>

      {/* Styled Upload Buttons */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="font-medium">Upload Players CSV</span>
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
            Choose File
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileUpload(e, "players")}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium">Upload Teams CSV</span>
          <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer">
            Choose File
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileUpload(e, "teams")}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
