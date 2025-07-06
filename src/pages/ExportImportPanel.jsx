import { useRef } from "react";

export default function ExportImportPanel() {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const players = JSON.parse(localStorage.getItem("auction_players") || "[]");
    const teams = JSON.parse(localStorage.getItem("auction_teams") || "[]");

    const data = {
      players,
      teams,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "auction_data.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.players || !data.teams) {
          alert("Invalid file structure.");
          return;
        }

        localStorage.setItem("auction_players", JSON.stringify(data.players));
        localStorage.setItem("auction_teams", JSON.stringify(data.teams));
        alert("✅ Data imported successfully!");
      } catch (err) {
        alert("❌ Error parsing file.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">📦 Export / Import Auction Data</h2>

      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ⬇ Export Data (JSON)
      </button>

      <div>
        <label className="inline-block bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700">
          ⬆ Import Data
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      <p className="text-sm text-gray-500">
        You can export your data and import it later on another device. It includes both players and team info.
      </p>
    </div>
  );
}
