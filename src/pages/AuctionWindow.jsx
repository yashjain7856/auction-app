import { useEffect, useState } from "react";

export default function AuctionWindow() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const playerData = JSON.parse(localStorage.getItem("auction_players") || "[]");
    const teamData = JSON.parse(localStorage.getItem("auction_teams") || "[]");
    setPlayers(playerData);
    setTeams(teamData);
  }, []);

  const current = players[currentIndex];

  const handleAssign = (teamName) => {
    const priceStr = prompt(`Enter selling price for ${current.name}:`);
    const soldPrice = parseInt(priceStr);
    if (isNaN(soldPrice) || soldPrice < parseInt(current.basePrice)) {
      alert("Invalid price. Must be a number >= base price.");
      return;
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentIndex] = {
      ...current,
      assignedTeam: teamName,
      soldPrice: soldPrice,
    };
    setPlayers(updatedPlayers);
    localStorage.setItem("auction_players", JSON.stringify(updatedPlayers));

    alert(`${current.name} sold to ${teamName} for ₹${soldPrice}`);
  };

  const handleUnsold = () => {
    const updatedPlayers = [...players];
    updatedPlayers[currentIndex] = {
      ...current,
      assignedTeam: "Unsold",
      soldPrice: 0,
    };
    setPlayers(updatedPlayers);
    localStorage.setItem("auction_players", JSON.stringify(updatedPlayers));

    alert(`${current.name} marked as UNSOLD`);
  };

  const nextPlayer = () => {
    if (currentIndex < players.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPlayer = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getSpent = (teamName) => {
    return players
      .filter((p) => p.assignedTeam === teamName)
      .reduce((sum, p) => sum + (parseInt(p.soldPrice) || 0), 0);
  };

  const getRemaining = (teamName) => {
    const t = teams.find((t) => t.team === teamName);
    return parseInt(t?.purse || 0) - getSpent(teamName);
  };

  if (!current) {
    return <div className="p-8 text-gray-500">🎉 All players auctioned!</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">🔥 Auction Window</h2>

      <div className="border p-6 rounded shadow bg-white text-black max-w-xl">
        <h3 className="text-xl font-semibold mb-2">🔹 {current.name}</h3>
        <p><strong>Speciality:</strong> {current.speciality}</p>
        <p><strong>Base Price:</strong> ₹{current.basePrice}</p>
        {current.assignedTeam && (
          <p className="mt-2 text-green-700">
            ✅ Sold to {current.assignedTeam} for ₹{current.soldPrice}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {teams.map((team, idx) => (
          <button
            key={idx}
            onClick={() => handleAssign(team.team)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {team.team} (₹{getRemaining(team.team)})
          </button>
        ))}

        <button
          onClick={handleUnsold}
          className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
        >
          Mark Unsold
        </button>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={prevPlayer}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅ Previous
        </button>
        <button
          onClick={nextPlayer}
          disabled={currentIndex === players.length - 1}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
