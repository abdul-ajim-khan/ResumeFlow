import { useState, useContext } from "react";
import {
  FaBars,
  FaTimes,
  FaCog,
  FaFileAlt,
  FaPlus,
  FaPalette,
  FaUser,
} from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import MyResumesTab from "../tabs/MyResumesTab";
import TemplatesTab from "../tabs/TemplatesTab";
import SettingsTab from "../tabs/SettingsTab";
import NewResumeModal from "../modals/NewResumeModal";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("resumes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newResumeOpen, setNewResumeOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState(null);

  const handleCreateClick = () => {
    if (activeTab !== "resumes") setActiveTab("resumes");
    setPendingTemplate(null);
    setNewResumeOpen(true);
  };

  const navItems = [
    { id: "resumes", label: "My Resumes", icon: <FaFileAlt /> },
    { id: "templates", label: "Templates", icon: <FaPalette /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="dashboard">
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">CV</span>
          <span className="logo-text">ResumeBuilder</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>


        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
          <div>
            <p className="sidebar-name">{user?.name?.toUpperCase() || "User"}</p>
            <p className="sidebar-email">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)}></div>

      <main className="dashboard-main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
          <div className="topbar-title">
            <h2>{navItems.find((i) => i.id === activeTab)?.label}</h2>
          </div>
          {/* <button className="topbar-create" onClick={handleCreateClick}>
            <FaPlus />
            <span>New Resume</span>
          </button> */}
        </header>

        <div className="dashboard-content">
          {activeTab === "resumes" && <MyResumesTab onNewResume={handleCreateClick} />}
          {activeTab === "templates" && <TemplatesTab onUseTemplate={(tpl) => { setActiveTab("resumes"); setPendingTemplate(tpl); setNewResumeOpen(true); }} />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>

      {newResumeOpen && (
        <NewResumeModal
          initialTemplate={pendingTemplate?.id}
          onClose={() => {
            setNewResumeOpen(false);
            setPendingTemplate(null);
          }}
        />
      )}
    </div>
  );
}