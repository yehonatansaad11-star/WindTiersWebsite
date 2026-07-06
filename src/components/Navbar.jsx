const tabs = [
  "Overall",
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

function Navbar({
  activeTab,
  setActiveTab,
  user,
  login,
  logout,
}) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">WT</div>
        <span>WINDTIERS</span>
      </div>

      <nav className="navbar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="navbar-user">
        {!user ? (
          <button className="login-btn" onClick={login}>
            Login
          </button>
        ) : (
          <button className="login-btn" onClick={logout}>
            👤
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;