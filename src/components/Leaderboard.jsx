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

const shortModes = ["CRY", "SWD", "MACE", "AXE", "UHC", "POT", "DIA", "SMP", "SPEAR"];

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
    const rank = player.ranks[mode] || "Unranked";
    return total + (rankPoints[rank] || 0);
  }, 0);
}

function getModeElo(player, mode) {
  const rank = player.ranks[mode] || "Unranked";
  return rankPoints[rank] || 0;
}

function RankBadge({ rank }) {
  const safeRank = rank || "Unranked";

  if (safeRank === "Unranked") {
    return <span className="unranked-text">Unranked</span>;
  }

  return (
    <span className={`rank-badge rank-${safeRank.toLowerCase()}`}>
      {safeRank}
    </span>
  );
}

function Leaderboard({ activeTab, players, onSelectPlayer }) {
  const isOverall = activeTab === "Overall";

  const sortedPlayers = [...players].sort((a, b) => {
    const eloA = isOverall ? getOverallElo(a) : getModeElo(a, activeTab);
    const eloB = isOverall ? getOverallElo(b) : getModeElo(b, activeTab);
    return eloB - eloA;
  });

  return (
    <section className="leaderboard">
      <div className="table-wrap">
        <table className="leaderboard-table">
          <tbody>
            {sortedPlayers.map((player, index) => {
              const elo = isOverall ? getOverallElo(player) : getModeElo(player, activeTab);
              const shownModes = isOverall ? modes : [activeTab];
              const shownShortModes = isOverall ? shortModes : [activeTab.toUpperCase()];

              return (
                <tr
                  key={player.name}
                  onClick={() => onSelectPlayer(player)}
                  style={{ cursor: "pointer" }}
                  className={index === 0 ? "row-gold" : index === 1 ? "row-silver" : index === 2 ? "row-bronze" : ""}
                >
                  <td className="place-cell">
                    {index === 0 ? "🏆" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </td>

                  <td className="player-cell">
                    <img src={`https://mc-heads.net/avatar/${player.skin}/32`} alt={player.name} />
                    <span>{player.name}</span>
                  </td>

                  <td className="ranks-cell">
                    <div className="mini-modes">
                      {shownShortModes.map((mode) => (
                        <span key={mode}>{mode}</span>
                      ))}
                    </div>

                    <div className="mini-ranks">
                      {shownModes.map((mode) => (
                        <RankBadge key={mode} rank={player.ranks[mode]} />
                      ))}
                    </div>
                  </td>

                  <td className="total-elo">
                    <div className="elo-title">ELO</div>
                    <div>{elo.toLocaleString()}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Leaderboard;