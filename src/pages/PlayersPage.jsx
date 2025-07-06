import { useEffect, useState } from "react";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("auction_players") || "[]");
    setPlayers(stored);
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">👥 Uploaded Players</h2>
      {players.length === 0 ? (
        <p className="text-gray-500">No players uploaded yet.</p>
      ) : (
        <table className="w-full text-left border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Speciality</th>
              <th className="p-2 border">Base Price</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.speciality}</td>
                <td className="p-2 border">₹{p.basePrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
