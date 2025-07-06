import { useEffect, useState } from "react";

export default function TeamsWindow() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const teamData = JSON.parse(localStorage.getItem("auction_teams") || "[]");
    const playerData = JSON.parse(localStorage.getItem("auction_players") || "[]");
    setTeams(teamData);
    setPlayers(playerData);
  }, []);

  const getTeamPlayers = (teamName) => {
    return players.filter((p) => p.assignedTeam === teamName);
  };

  const getSpentAmount = (teamName) => {
    return getTeamPlayers(teamName).reduce(
      (sum, p) => sum + (parseInt(p.soldPrice) || 0),
      0
    );
  };

  const getRemainingPurse = (teamName) => {
    const team = teams.find((t) => t.team === teamName);
    return parseInt(team?.purse || 0) - getSpentAmount(teamName);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">🏏 Teams Overview</h2>

      {teams.length === 0 ? (
        <p className="text-gray-500">⚠️ No teams uploaded yet.</p>
        ) : (
        <div className="flex flex-wrap gap-4 mb-8">
            {teams.map((team, idx) => (
            <button
                key={idx}
                onClick={() => setSelectedTeam(team.team)}
                className={`px-4 py-2 rounded font-semibold shadow ${
                selectedTeam === team.team
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
                {team.team}
            </button>
            ))}
        </div>
        )}


      {selectedTeam && (
        <div>
          <h3 className="text-xl font-semibold mb-2">
            {selectedTeam} — Players
          </h3>
          <table className="w-full text-left border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Speciality</th>
                <th className="p-2 border">Sold Price</th>
              </tr>
            </thead>
            <tbody>
              {getTeamPlayers(selectedTeam).map((p, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.speciality}</td>
                  <td className="p-2 border">₹{p.soldPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-lg">
            💰 Remaining Purse: ₹{getRemainingPurse(selectedTeam)}
          </div>
        </div>
      )}
    </div>
  );
}
