import { useState } from "react";

export default function SetupWindow() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const data = parseCSV(csv);
      if (type === "players") {
        setPlayers(data);
        localStorage.setItem("auction_players", JSON.stringify(data));
      } else {
        setTeams(data);
        localStorage.setItem("auction_teams", JSON.stringify(data));
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });
  };

  return (
    <div className="p-8 space-y-10">
        <h2 className="text-2xl font-bold">📋 Setup</h2>

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


        <div className="space-y-2">
            <div>
                ✅ <strong>{players.length}</strong> players saved.
            </div>
            <div>
                ✅ <strong>{teams.length}</strong> teams saved.
            </div>
            </div>
    </div>
  );
}
