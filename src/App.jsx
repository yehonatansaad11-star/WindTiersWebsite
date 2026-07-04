import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./components/AdminPanel";
import PlayerProfile from "./components/PlayerProfile";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

function App() {
  const [activeTab, setActiveTab] = useState("Overall");
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showAdmin =
    new URLSearchParams(window.location.search).get("admin") === "true";

  useEffect(() => {
    const playersRef = collection(db, "players");

    const unsubscribe = onSnapshot(
      playersRef,
      (snapshot) => {
        const playersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPlayers(playersData);
      },
      (error) => {
        console.error("FIREBASE READ ERROR:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {showAdmin && <AdminPanel players={players} />}

      <Hero />

      <section className="search-section">
        <input
          type="text"
          placeholder="Search player..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </section>

      <Leaderboard
        activeTab={activeTab}
        players={players}
        searchQuery={searchQuery}
        onSelectPlayer={setSelectedPlayer}
      />

      <PlayerProfile
        player={selectedPlayer}
        players={players}
        onClose={() => setSelectedPlayer(null)}
      />
    </main>
  );
}

export default App;