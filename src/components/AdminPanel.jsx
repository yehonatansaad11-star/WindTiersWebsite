import { useState } from "react";
import PlayerForm from "./PlayerForm";
import { db } from "../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

const ADMIN_CODE = "I-Control-The-Wind-9147!";

const modes = [
  "Crystal",
  "Sword",
  "Mace",
  "Axe",
  "UHC",
  "Pot",
  "Dia SMP",
  "SMP",
  "Spear Mace",
];

const emptyRanks = Object.fromEntries(
  modes.map((mode) => [mode, "Unranked"])
);

function AdminPanel({ players }) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState("");

  const [mode, setMode] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [ranks, setRanks] = useState(emptyRanks);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function login() {
    if (code === ADMIN_CODE) {
      setIsOwner(true);
      setError("");
    } else {
      setError("❌ Access Denied");
    }
  }

  function resetForm() {
    setPlayerName("");
    setRanks(emptyRanks);
    setSelectedPlayer("");
    setConfirmDelete(false);
    setError("");
  }

  function logout() {
    setIsOwner(false);
    setCode("");
    setMode(null);
    resetForm();
  }

  function openAdd() {
    resetForm();
    setMode("add");
  }

  function openEdit() {
    resetForm();
    setMode("edit-select");
  }

  function openDelete() {
    resetForm();
    setMode("delete-select");
  }

  function loadPlayerForEdit() {
    const player = players.find((p) => p.name === selectedPlayer);

    if (!player) {
      setError("❌ Please select a player.");
      return;
    }

    setPlayerName(player.name);
    setRanks({ ...emptyRanks, ...player.ranks });
    setMode("edit-form");
    setError("");
  }

  async function saveNewPlayer() {
    const cleanName = playerName.trim();

    if (!cleanName) {
      setError("❌ Please enter a player name.");
      return;
    }

    const alreadyExists = players.some(
      (player) => player.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (alreadyExists) {
      setError("❌ This player already exists.");
      return;
    }

    await setDoc(doc(db, "players", cleanName), {
      name: cleanName,
      skin: cleanName,
      ranks,
    });

    resetForm();
    setMode(null);
  }

  async function saveEditedPlayer() {
    const cleanName = playerName.trim();

    if (!cleanName) {
      setError("❌ Please enter a player name.");
      return;
    }

    const nameTaken = players.some(
      (player) =>
        player.name.toLowerCase() === cleanName.toLowerCase() &&
        player.name !== selectedPlayer
    );

    if (nameTaken) {
      setError("❌ This player name already exists.");
      return;
    }

    await setDoc(doc(db, "players", cleanName), {
      name: cleanName,
      skin: cleanName,
      ranks,
    });

    if (cleanName !== selectedPlayer) {
      await deleteDoc(doc(db, "players", selectedPlayer));
    }

    resetForm();
    setMode(null);
  }

  async function deletePlayer() {
    if (!selectedPlayer) {
      setError("❌ Please select a player.");
      return;
    }

    await deleteDoc(doc(db, "players", selectedPlayer));

    resetForm();
    setMode(null);
  }

  return (
    <div className="admin-panel">
      <button className="admin-toggle" onClick={() => setIsOpen(!isOpen)}>
        👤 Admin
      </button>

      {isOpen && (
        <div className="admin-card">
          {!isOwner ? (
            <>
              <h3>Admin Access</h3>

              <input
                type="password"
                placeholder="Enter Admin Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") login();
                }}
              />

              <button onClick={login}>Login</button>

              {error && <p className="admin-error">{error}</p>}
            </>
          ) : (
            <>
              <h3>✅ Welcome back, Wind Owner.</h3>

              <button onClick={openAdd}>➕ Add Player</button>
              <button onClick={openEdit}>✏️ Edit Player</button>
              <button onClick={openDelete}>🗑️ Delete Player</button>
              <button onClick={logout}>🚪 Logout</button>

              {mode === "add" && (
                <>
                  <h3>Add Player</h3>

                  <PlayerForm
                    playerName={playerName}
                    setPlayerName={setPlayerName}
                    ranks={ranks}
                    setRanks={setRanks}
                    onSave={saveNewPlayer}
                    saveText="Save Player"
                  />
                </>
              )}

              {mode === "edit-select" && (
                <div className="add-player-box">
                  <h3>Edit Player</h3>

                  <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                  >
                    <option value="">Select player</option>
                    {players.map((player) => (
                      <option key={player.name} value={player.name}>
                        {player.name}
                      </option>
                    ))}
                  </select>

                  <button onClick={loadPlayerForEdit}>Edit</button>
                </div>
              )}

              {mode === "edit-form" && (
                <>
                  <h3>Editing: {selectedPlayer}</h3>

                  <PlayerForm
                    playerName={playerName}
                    setPlayerName={setPlayerName}
                    ranks={ranks}
                    setRanks={setRanks}
                    onSave={saveEditedPlayer}
                    saveText="Save Changes"
                  />
                </>
              )}

              {mode === "delete-select" && (
                <div className="add-player-box">
                  <h3>Delete Player</h3>

                  {players.length === 0 ? (
                    <p>No players found.</p>
                  ) : (
                    <>
                      <select
                        value={selectedPlayer}
                        onChange={(e) => {
                          setSelectedPlayer(e.target.value);
                          setConfirmDelete(false);
                          setError("");
                        }}
                      >
                        <option value="">Select player</option>
                        {players.map((player) => (
                          <option key={player.name} value={player.name}>
                            {player.name}
                          </option>
                        ))}
                      </select>

                      {!confirmDelete ? (
                        <button
                          onClick={() => {
                            if (!selectedPlayer) {
                              setError("❌ Please select a player.");
                              return;
                            }

                            setConfirmDelete(true);
                            setError("");
                          }}
                        >
                          Delete Player
                        </button>
                      ) : (
                        <>
                          <p className="delete-warning">
                            ⚠️ Are you sure you want to delete {selectedPlayer}?
                          </p>

                          <button onClick={deletePlayer}>Yes, Delete</button>

                          <button onClick={() => setConfirmDelete(false)}>
                            Cancel
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              {error && <p className="admin-error">{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;