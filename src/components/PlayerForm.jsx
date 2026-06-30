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

const rankOrder = [
  "Unranked",
  "LT5",
  "HT5",
  "LT4",
  "HT4",
  "LT3",
  "HT3",
  "LT2",
  "HT2",
  "LT1",
  "HT1",
];

function PlayerForm({
  playerName,
  setPlayerName,
  ranks,
  setRanks,
  onSave,
  saveText = "Save Player",
}) {
  function changeRank(mode, direction) {
    const currentRank = ranks[mode] || "Unranked";
    const currentIndex = rankOrder.indexOf(currentRank);

    const nextIndex =
      direction === "next"
        ? Math.min(currentIndex + 1, rankOrder.length - 1)
        : Math.max(currentIndex - 1, 0);

    setRanks({
      ...ranks,
      [mode]: rankOrder[nextIndex],
    });
  }

  return (
    <div className="add-player-box">
      <input
        type="text"
        placeholder="Player Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />

      <div className="rank-picker-list">
        {modes.map((mode) => (
          <div className="rank-picker-row" key={mode}>
            <span>{mode}</span>

            <div className="rank-picker-controls">
              <button onClick={() => changeRank(mode, "prev")}>◀</button>

              <strong className={`rank-badge rank-${(ranks[mode] || "Unranked").toLowerCase()}`}>
                {ranks[mode] || "Unranked"}
              </strong>

              <button onClick={() => changeRank(mode, "next")}>▶</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onSave}>{saveText}</button>
    </div>
  );
}

export default PlayerForm;