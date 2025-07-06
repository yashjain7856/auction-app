import { useEffect, useState } from "react";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({ name: "", speciality: "", basePrice: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("auction_players") || "[]");
    setPlayers(stored);
  }, []);

  const updateLocalStorage = (data) => {
    localStorage.setItem("auction_players", JSON.stringify(data));
    setPlayers(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.speciality || !form.basePrice) {
      alert("Please fill all fields");
      return;
    }

    const newPlayer = {
      name: form.name,
      speciality: form.speciality,
      basePrice: parseInt(form.basePrice),
    };

    let updated;
    if (editIndex !== null) {
      updated = [...players];
      updated[editIndex] = { ...updated[editIndex], ...newPlayer };
    } else {
      updated = [...players, newPlayer];
    }

    updateLocalStorage(updated);
    setForm({ name: "", speciality: "", basePrice: "" });
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    const updated = [...players];
    updated.splice(index, 1);
    updateLocalStorage(updated);
  };

  const handleEdit = (index) => {
    const p = players[index];
    setForm({
      name: p.name,
      speciality: p.speciality,
      basePrice: p.basePrice,
    });
    setEditIndex(index);
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">👥 Manage Players</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        <input
          type="text"
          name="name"
          placeholder="Player Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="speciality"
          placeholder="Speciality"
          value={form.speciality}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="basePrice"
          placeholder="Base Price"
          value={form.basePrice}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 sm:col-span-3"
        >
          {editIndex !== null ? "Update Player" : "Add Player"}
        </button>
      </div>

      {players.length === 0 ? (
        <p className="text-gray-500">No players yet.</p>
      ) : (
        <table className="w-full max-w-5xl border mt-6">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Speciality</th>
              <th className="p-2 border">Base Price</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.speciality}</td>
                <td className="p-2 border">₹{p.basePrice}</td>
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
    </div>
  );
}
