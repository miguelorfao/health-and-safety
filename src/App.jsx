import { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login";
import TemperatureLogger from "./components/TemperatureLogger";
import HSLogger from "./components/HSLogger";
import ChecklistLogger from "./components/ChecklistLogger";
import ActionLogger from "./components/ActionLogger";
import HSChecksView from "./components/HSChecksView";
import DocumentManager from "./components/DocumentManager";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";

const viewLabels = {
  select: "Welcome",
  temp: "Temperature Logging",
  checklist: "Opening & Closing Checklists",
  actions: "Corrective Actions",
  hs_checks: "Health & Safety Checks",
  hs_log: "Record H&S Check",
  documents: "Compliance Documents",
  dashboard: "Operational Dashboard",
  reports: "Management Reports",
};

const KNOWN_RESTAURANTS = ["Cafe Royal", "The Anchor", "Holly Cow"];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [temperatureReadings, setTemperatureReadings] = useState([]);
  const [hsChecks, setHSChecks] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [actions, setActions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [currentView, setCurrentView] = useState("select");
  const [adminRestaurantId, setAdminRestaurantId] = useState("all");

  useEffect(() => {
    const savedReadings = localStorage.getItem("temperatureReadings");
    const savedChecks = localStorage.getItem("hsChecks");
    const savedChecklists = localStorage.getItem("checklists");
    const savedActions = localStorage.getItem("actions");
    const savedDocuments = localStorage.getItem("documents");
    if (savedReadings) {
      setTemperatureReadings(
        JSON.parse(savedReadings).map((r) => ({
          ...r,
          timestamp: new Date(r.timestamp),
        })),
      );
    }
    if (savedChecks) {
      setHSChecks(
        JSON.parse(savedChecks).map((c) => ({
          ...c,
          timestamp: new Date(c.timestamp),
        })),
      );
    }
    if (savedChecklists) {
      setChecklists(
        JSON.parse(savedChecklists).map((c) => ({
          ...c,
          timestamp: new Date(c.timestamp),
        })),
      );
    }
    if (savedActions) {
      setActions(
        JSON.parse(savedActions).map((a) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        })),
      );
    }
    if (savedDocuments) {
      setDocuments(
        JSON.parse(savedDocuments).map((d) => ({
          ...d,
          uploadDate: new Date(d.uploadDate),
          expiryDate: d.expiryDate ? new Date(d.expiryDate) : undefined,
        })),
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "temperatureReadings",
      JSON.stringify(temperatureReadings),
    );
  }, [temperatureReadings]);

  useEffect(() => {
    localStorage.setItem("hsChecks", JSON.stringify(hsChecks));
  }, [hsChecks]);

  useEffect(() => {
    localStorage.setItem("checklists", JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    localStorage.setItem("actions", JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
  }, [documents]);

  const handleAddReading = (reading) => {
    setTemperatureReadings((prev) => [...prev, reading]);
  };

  const handleAddChecklist = (checklist) => {
    setChecklists((prev) => [...prev, checklist]);
  };

  const handleAddAction = (action) => {
    setActions((prev) => [...prev, action]);
  };

  const handleAddDocument = (document) => {
    setDocuments((prev) => [...prev, document]);
  };

  const handleDeleteDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const adminRestaurantOptions = Array.from(
    new Set([
      ...KNOWN_RESTAURANTS,
      ...temperatureReadings.map((r) => r.restaurantId),
      ...hsChecks.map((c) => c.restaurantId),
      ...checklists.map((c) => c.restaurantId),
      ...actions.map((a) => a.restaurantId),
      ...documents.map((d) => d.restaurantId),
    ]),
  ).filter(Boolean);

  const selectedRestaurantId =
    currentUser?.role === "admin"
      ? adminRestaurantId
      : currentUser?.restaurantId;

  const isAdminFilteredToOneSite =
    currentUser?.role === "admin" && adminRestaurantId !== "all";

  const visibleTemperatureReadings = isAdminFilteredToOneSite
    ? temperatureReadings.filter((r) => r.restaurantId === adminRestaurantId)
    : temperatureReadings;
  const visibleChecks = isAdminFilteredToOneSite
    ? hsChecks.filter((c) => c.restaurantId === adminRestaurantId)
    : hsChecks;
  const visibleActions = isAdminFilteredToOneSite
    ? actions.filter((a) => a.restaurantId === adminRestaurantId)
    : actions;

  const totalAlerts = visibleActions.length;
  const currentViewLabel = viewLabels[currentView];

  const navigationItems = [
    { key: "dashboard", label: "Dashboard", show: true },
    { key: "temp", label: "Temperatures", show: true },
    { key: "checklist", label: "Checklists", show: true },
    {
      key: "hs_log",
      label: "Log H&S Check",
      show: currentUser?.role === "manager",
    },
    { key: "hs_checks", label: "H&S Checks", show: true },
    { key: "actions", label: "Corrective Actions", show: true },
    {
      key: "documents",
      label: "Documents",
      show: currentUser?.role === "admin",
    },
    { key: "reports", label: "Reports", show: currentUser?.role === "admin" },
  ];

  const renderView = () => {
    if (!currentUser) {
      return <Login onLogin={setCurrentUser} />;
    }

    switch (currentView) {
      case "temp":
        return (
          <TemperatureLogger
            restaurantId={selectedRestaurantId}
            onAddReading={handleAddReading}
            onAddAction={handleAddAction}
          />
        );
      case "checklist":
        return (
          <ChecklistLogger
            restaurantId={selectedRestaurantId}
            onAddChecklist={handleAddChecklist}
          />
        );
      case "actions":
        return (
          <ActionLogger
            restaurantId={selectedRestaurantId}
            onAddAction={handleAddAction}
          />
        );
      case "hs_checks":
        return (
          <HSChecksView
            hsChecks={hsChecks}
            user={currentUser}
            selectedRestaurantId={
              currentUser.role === "admin" ? adminRestaurantId : "all"
            }
          />
        );
      case "hs_log":
        return (
          <HSLogger
            restaurantId={selectedRestaurantId}
            onAddCheck={(check) => setHSChecks((prev) => [...prev, check])}
            onAddAction={handleAddAction}
          />
        );
      case "documents":
        return (
          <DocumentManager
            restaurantId={selectedRestaurantId}
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            user={currentUser.username}
          />
        );
      case "dashboard":
        return (
          <Dashboard
            temperatureReadings={temperatureReadings}
            hsChecks={hsChecks}
            checklists={checklists}
            actions={actions}
            restaurantId={selectedRestaurantId}
            selectedRestaurantId={adminRestaurantId}
            user={currentUser}
            onEditTemperature={(reading) => {
              alert("Edit temperature: " + reading.foodItem);
            }}
            onDeleteTemperature={(id) => {
              setTemperatureReadings((prev) => prev.filter((r) => r.id !== id));
            }}
            onEditChecklist={(checklist) => {
              alert("Edit checklist: " + checklist.type);
            }}
            onDeleteChecklist={(id) => {
              setChecklists((prev) => prev.filter((c) => c.id !== id));
            }}
          />
        );
      case "reports":
        return (
          <Reports
            temperatureReadings={temperatureReadings}
            hsChecks={hsChecks}
            checklists={checklists}
            actions={actions}
            selectedRestaurantId={adminRestaurantId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__title">
          <span className="app-badge">Food Safety & Compliance</span>
          <h1>Restaurant Operations Hub</h1>
          <p>
            Keep temperatures, checks, corrective actions, and compliance
            records organised in one place.
          </p>
        </div>

        {currentUser && (
          <div className="app-toolbar">
            <div className="nav" role="tablist" aria-label="App sections">
              {navigationItems
                .filter((item) => item.show)
                .map((item) => (
                  <button
                    key={item.key}
                    role="tab"
                    aria-selected={currentView === item.key}
                    className={currentView === item.key ? "active" : ""}
                    onClick={() => setCurrentView(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              <button
                className="logout-button"
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView("select");
                }}
              >
                Logout
              </button>
            </div>

            <div className="app-user-card">
              <span className="app-user-card__label">Signed in as</span>
              <strong>{currentUser.username}</strong>
              <span>
                {currentUser.role === "admin"
                  ? adminRestaurantId === "all"
                    ? "All restaurants"
                    : `Restaurant ${adminRestaurantId}`
                  : `Restaurant ${currentUser.restaurantId}`}
              </span>
            </div>

            {currentUser.role === "admin" && (
              <div className="app-admin-filter">
                <label htmlFor="adminRestaurantId">Site view</label>
                <select
                  id="adminRestaurantId"
                  value={adminRestaurantId}
                  onChange={(e) => setAdminRestaurantId(e.target.value)}
                >
                  <option value="all">All restaurants</option>
                  {adminRestaurantOptions.map((restaurantId) => (
                    <option key={restaurantId} value={restaurantId}>
                      {restaurantId}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="app-summary-strip">
              <div className="app-summary-item">
                <strong>{visibleTemperatureReadings.length}</strong>
                <span>Temp logs</span>
              </div>
              <div className="app-summary-item">
                <strong>{visibleChecks.length}</strong>
                <span>H&amp;S checks</span>
              </div>
              <div className="app-summary-item">
                <strong>{totalAlerts}</strong>
                <span>Actions</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="app-main">
        {currentUser && (
          <section className="page-intro">
            <div>
              <span className="page-intro__eyebrow">Current workspace</span>
              <h2>{currentViewLabel}</h2>
              <p>
                Use this area to keep records up to date and make it easier for
                staff and managers to find what they need.
              </p>
            </div>
          </section>
        )}

        <section className="page-panel">{renderView()}</section>
      </main>
    </div>
  );
}

export default App;
