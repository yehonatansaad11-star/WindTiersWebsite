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

const rankPoints = {
  HT1: 2800,
  LT1: 2799,
  HT2: 2399,
  LT2: 1999,
  HT3: 1699,
  LT3: 1399,
  HT4: 1099,
  LT4: 899,
  HT5: 699,
  LT5: 499,
  Unranked: 0,
};

function getOverallElo(player) {
  return modes.reduce((total, mode) => {
    const rank = player.ranks?.[mode] || "Unranked";
    return total + (rankPoints[rank] || 0);
  }, 0);
}

function getBestRank(player) {
  let bestRank = "Unranked";
  let bestPoints = 0;

  modes.forEach((mode) => {
    const rank = player.ranks?.[mode] || "Unranked";
    const points = rankPoints[rank] || 0;

    if (points > bestPoints) {
      bestPoints = points;
      bestRank = rank;
    }
  });

  return bestRank;
}

function getBestGamemode(player) {
  let bestMode = "None";
  let bestPoints = 0;

  modes.forEach((mode) => {
    const rank = player.ranks?.[mode] || "Unranked";
    const points = rankPoints[rank] || 0;

    if (points > bestPoints) {
      bestPoints = points;
      bestMode = mode;
    }
  });

  return bestMode;
}

function PlayerProfile({ player, players, onClose }) {
  if (!player) return null;

  const overallElo = getOverallElo(player);
  const sortedPlayers = [...players].sort(
    (a, b) => getOverallElo(b) - getOverallElo(a)
  );
  const overallRank =
    sortedPlayers.findIndex((p) => p.name === player.name) + 1;

  const totalRanked = modes.filter(
    (mode) => (player.ranks?.[mode] || "Unranked") !== "Unranked"
  ).length;

  const bestRank = getBestRank(player);
  const bestGamemode = getBestGamemode(player);

  return (
    <div className="profile-backdrop" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close" onClick={onClose}>×</button>

        <div className="profile-top">
          <img
            className="profile-head"
            src={`https://mc-heads.net/avatar/${player.skin || player.name}/160`}
            alt={player.name}
          />

          <div className="profile-title">
            <h2>{player.name}</h2>
            <span className="profile-rank-pill">🏆 #{overallRank} Overall</span>
          </div>

          <div className="profile-stat-card">
            <span>⭐ Overall ELO</span>
            <strong>{overallElo.toLocaleString()}</strong>
          </div>

          <div className="profile-stat-card">
            <span>👑 Overall Rank</span>
            <strong>#{overallRank}</strong>
          </div>
        </div>

        <div className="profile-section">
          <h3>🎮 Ranks by Gamemode</h3>

          <div className="profile-ranks-grid">
            {modes.map((mode) => {
              const rank = player.ranks?.[mode] || "Unranked";

              return (
                <div className="profile-rank-card" key={mode}>
                  <span>{mode}</span>
                  <strong className={`rank-${rank.toLowerCase()}`}>
                    {rank}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        <div className="profile-bottom">
          <div className="profile-info-card">
            <h3>👤 Player Info</h3>

            <p><span>Username</span><strong>{player.name}</strong></p>
            <p><span>Skin</span><strong>{player.skin || player.name}</strong></p>
            <p><span>Best Gamemode</span><strong>{bestGamemode}</strong></p>

            <img
              className="profile-body"
              src={`https://mc-heads.net/body/${player.skin || player.name}/170`}
              alt={player.name}
            />
          </div>

          <div className="profile-info-card">
            <h3>📊 Stats</h3>

            <p><span>Overall ELO</span><strong>{overallElo.toLocaleString()}</strong></p>
            <p><span>Overall Rank</span><strong>#{overallRank}</strong></p>
            <p><span>Total Ranked Gamemodes</span><strong>{totalRanked} / 9</strong></p>
            <p><span>Best Rank</span><strong>{bestRank}</strong></p>
          </div>
        </div>

        <button className="profile-close-bottom" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default PlayerProfile;