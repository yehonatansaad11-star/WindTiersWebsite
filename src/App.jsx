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

  useEffect(() => {
    const playersRef = collection(db, "players");

    const unsubscribe = onSnapshot(
      playersRef,
      (snapshot) => {
        const playersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("PLAYERS FROM FIREBASE:", playersData);

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
      <AdminPanel players={players} />
      <Hero />

      <Leaderboard
        activeTab={activeTab}
        players={players}
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