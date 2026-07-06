import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./components/AdminPanel";
import PlayerProfile from "./components/PlayerProfile";

import { db, auth, provider } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

function App() {
  const [activeTab, setActiveTab] = useState("Overall");
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

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

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => signOut(auth);

  const isAdmin =
    user?.email === "yehonatansaad11@gmail.com";

  return (
    <main className="app">
<Navbar
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  user={user}
  login={login}
  logout={logout}
/>

      {isAdmin && <AdminPanel players={players} />}

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