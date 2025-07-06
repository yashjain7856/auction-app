import { useEffect, useState } from "react";

export default function TeamsWindow() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({ team: "", purse: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const teamData = JSON.parse(localStorage.getItem("auction_teams") || "[]");
    const playerData = JSON.parse(localStorage.getItem("auction_players") || "[]");
    setTeams(teamData);
    setPlayers(playerData);
  }, []);

  const updateLocalStorage = (updatedTeams) => {
    setTeams(updatedTeams);
    localStorage.setItem("auction_teams", JSON.stringify(updatedTeams));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.team || !form.purse) {
      alert("Fill in all fields");
      return;
    }

    const newTeam = { team: form.team, purse: parseInt(form.purse) };

    let updated;
    if (editIndex !== null) {
      updated = [...teams];
      updated[editIndex] = newTeam;
    } else {
      updated = [...teams, newTeam];
    }

    updateLocalStorage(updated);
    setForm({ team: "", purse: "" });
    setEditIndex(null);
  };

  const handleDelete = (i) => {
    const teamToDelete = teams[i].team;
    const hasPlayers = players.some(p => p.assignedTeam === teamToDelete);

    if (hasPlayers) {
      alert("⚠️ Cannot delete. Team already owns players.");
      return;
    }

    if (!window.confirm("Delete this team?")) return;
    const updated = [...teams];
    updated.splice(i, 1);
    updateLocalStorage(updated);
    if (selectedTeam === teamToDelete) setSelectedTeam(null);
  };

  const handleEdit = (i) => {
    const t = teams[i];
    setForm({ team: t.team, purse: t.purse });
    setEditIndex(i);
  };

  const getTeamPlayers = (teamName) => {
    return players.filter((p) => p.assignedTeam === teamName);
  };

  const getSpent = (teamName) => {
    return getTeamPlayers(teamName).reduce(
      (sum, p) => sum + (parseInt(p.soldPrice) || 0),
      0
    );
  };

  const getRemaining = (teamName) => {
    const team = teams.find((t) => t.team === teamName);
    return parseInt(team?.purse || 0) - getSpent(teamName);
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">🏏 Teams Manager + Overview</h2>

      {/* Add/Edit Team Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <input
          type="text"
          name="team"
          placeholder="Team Name"
          value={form.team}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="purse"
          placeholder="Purse"
          value={form.purse}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 sm:col-span-2"
        >
          {editIndex !== null ? "Update Team" : "Add Team"}
        </button>
      </div>

      {/* List of Teams */}
      {teams.length === 0 ? (
        <p className="text-gray-500">No teams yet.</p>
      ) : (
        <table className="w-full max-w-4xl border mt-6">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Team Name</th>
              <th className="p-2 border">Purse</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td
                  className="p-2 border cursor-pointer hover:text-blue-600"
                  onClick={() => setSelectedTeam(t.team)}
                >
                  {t.team}
                </td>
                <td className="p-2 border">₹{t.purse}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => handleEdit(i)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Players in Selected Team */}
      {selectedTeam && (
        <div className="mt-8 max-w-4xl">
          <h3 className="text-xl font-semibold mb-2">
            👥 {selectedTeam} — Players
          </h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Speciality</th>
                <th className="p-2 border">Price</th>
              </tr>
            </thead>
            <tbody>
              {getTeamPlayers(selectedTeam).map((p, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.speciality}</td>
                  <td className="p-2 border">₹{p.soldPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 text-lg">
            💰 <strong>Remaining Purse:</strong> ₹{getRemaining(selectedTeam)}
          </div>
        </div>
      )}
    </div>
  );
}
