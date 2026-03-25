import { useState, useEffect } from 'react';
import './App.css';
import { TemperatureReading, HSCheck, User, Checklist, Action, Document } from './types';
import Login from './components/Login';
import TemperatureLogger from './components/TemperatureLogger';
import HSLogger from './components/HSLogger';
import ChecklistLogger from './components/ChecklistLogger';
import ActionLogger from './components/ActionLogger';
import HSChecksView from './components/HSChecksView';
import DocumentManager from './components/DocumentManager';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';

const viewLabels = {
  select: 'Welcome',
  temp: 'Temperature Logging',
  checklist: 'Opening & Closing Checklists',
  actions: 'Corrective Actions',
  hs_checks: 'Health & Safety Checks',
  hs_log: 'Record H&S Check',
  documents: 'Compliance Documents',
  dashboard: 'Operational Dashboard',
  reports: 'Management Reports',
} as const;

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [temperatureReadings, setTemperatureReadings] = useState<TemperatureReading[]>([]);
  const [hsChecks, setHSChecks] = useState<HSCheck[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentView, setCurrentView] = useState<'select' | 'dashboard' | 'checklist' | 'actions' | 'hs_checks' | 'hs_log' | 'documents' | 'temp' | 'reports'>('select');

  useEffect(() => {
    const savedReadings = localStorage.getItem('temperatureReadings');
    const savedChecks = localStorage.getItem('hsChecks');
    const savedChecklists = localStorage.getItem('checklists');
    const savedActions = localStorage.getItem('actions');
    const savedDocuments = localStorage.getItem('documents');
    if (savedReadings) {
      setTemperatureReadings(JSON.parse(savedReadings).map((r: any) => ({ ...r, timestamp: new Date(r.timestamp) })));
    }
    if (savedChecks) {
      setHSChecks(JSON.parse(savedChecks).map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })));
    }
    if (savedChecklists) {
      setChecklists(JSON.parse(savedChecklists).map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })));
    }
    if (savedActions) {
      setActions(JSON.parse(savedActions).map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) })));
    }
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments).map((d: any) => ({
        ...d,
        uploadDate: new Date(d.uploadDate),
        expiryDate: d.expiryDate ? new Date(d.expiryDate) : undefined
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('temperatureReadings', JSON.stringify(temperatureReadings));
  }, [temperatureReadings]);

  useEffect(() => {
    localStorage.setItem('hsChecks', JSON.stringify(hsChecks));
  }, [hsChecks]);

  useEffect(() => {
    localStorage.setItem('checklists', JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    localStorage.setItem('actions', JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const handleAddReading = (reading: TemperatureReading) => {
    setTemperatureReadings(prev => [...prev, reading]);
  };

  const handleAddChecklist = (checklist: Checklist) => {
    setChecklists(prev => [...prev, checklist]);
  };

  const handleAddAction = (action: Action) => {
    setActions(prev => [...prev, action]);
  };

  const handleAddDocument = (document: Document) => {
    setDocuments(prev => [...prev, document]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const totalAlerts = actions.length;
  const currentViewLabel = viewLabels[currentView];

  const navigationItems: Array<{
    key: 'dashboard' | 'checklist' | 'hs_checks' | 'hs_log' | 'actions' | 'temp' | 'documents' | 'reports';
    label: string;
    show: boolean;
  }> = [  { key: 'dashboard', label: 'Dashboard', show: true },
    { key: 'temp', label: 'Temperatures', show: true },
          { key: 'checklist', label: 'Checklists', show: true },
          { key: 'hs_log', label: 'Log H&S Check', show: currentUser?.role === 'manager' },
    { key: 'hs_checks', label: 'H&S Checks', show: true },
   
    { key: 'actions', label: 'Corrective Actions', show: true },
  
    { key: 'documents', label: 'Documents', show: currentUser?.role === 'admin' },
    { key: 'reports', label: 'Reports', show: currentUser?.role === 'admin' },
  ];

  const renderView = () => {
    if (!currentUser) {
      return <Login onLogin={setCurrentUser} />;
    }

    switch (currentView) {
      case 'temp':
        return (
          <TemperatureLogger
            restaurantId={currentUser.restaurantId}
            onAddReading={handleAddReading}
            onAddAction={handleAddAction}
          />
        );
      case 'checklist':
        return (
          <ChecklistLogger
            restaurantId={currentUser.restaurantId}
            onAddChecklist={handleAddChecklist}
          />
        );
      case 'actions':
        return (
          <ActionLogger
            restaurantId={currentUser.restaurantId}
            onAddAction={handleAddAction}
          />
        );
      case 'hs_checks':
        return (
          <HSChecksView
            hsChecks={hsChecks}
            user={currentUser}
          />
        );
      case 'hs_log':
        return (
          <HSLogger
            restaurantId={currentUser.restaurantId}
            onAddCheck={(check: HSCheck) => setHSChecks(prev => [...prev, check])}
            onAddAction={handleAddAction}
          />
        );
      case 'documents':
        return (
          <DocumentManager
            restaurantId={currentUser.restaurantId}
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            user={currentUser.username}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            temperatureReadings={temperatureReadings}
            hsChecks={hsChecks}
            checklists={checklists}
            actions={actions}
            restaurantId={currentUser.restaurantId}
            user={currentUser}
            onEditTemperature={(reading) => {
              // Placeholder for edit
              alert('Edit temperature: ' + reading.foodItem);
            }}
            onDeleteTemperature={(id) => {
              setTemperatureReadings(prev => prev.filter(r => r.id !== id));
            }}
            onEditChecklist={(checklist) => {
              // Placeholder for edit
              alert('Edit checklist: ' + checklist.type);
            }}
            onDeleteChecklist={(id) => {
              setChecklists(prev => prev.filter(c => c.id !== id));
            }}
          />
        );
      case 'reports':
        return (
          <Reports
            temperatureReadings={temperatureReadings}
            hsChecks={hsChecks}
            checklists={checklists}
            actions={actions}
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
            Keep temperatures, checks, corrective actions, and compliance records organised in one place.
          </p>
        </div>

        {currentUser && (
          <div className="app-toolbar">
            <div className="app-user-card">
              <span className="app-user-card__label">Signed in as</span>
              <strong>{currentUser.username}</strong>
              <span>
                {currentUser.role === 'admin' ? 'All restaurants' : `Restaurant ${currentUser.restaurantId}`}
              </span>
            </div>

            <div className="app-summary-strip">
              <div className="app-summary-item">
                <strong>{temperatureReadings.length}</strong>
                <span>Temp logs</span>
              </div>
              <div className="app-summary-item">
                <strong>{hsChecks.length}</strong>
                <span>H&amp;S checks</span>
              </div>
              <div className="app-summary-item">
                <strong>{totalAlerts}</strong>
                <span>Actions</span>
              </div>
            </div>

            <div className="nav">
              {navigationItems.filter((item) => item.show).map((item) => (
                <button
                  key={item.key}
                  className={currentView === item.key ? 'active' : ''}
                  onClick={() => setCurrentView(item.key)}
                >
                  {item.label}
                </button>
              ))}
              <button
                className="logout-button"
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView('select');
                }}
              >
                Logout
              </button>
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
                Use this area to keep records up to date and make it easier for staff and managers to find what they need.
              </p>
            </div>
          </section>
        )}

        <section className="page-panel">
          {renderView()}
        </section>
      </main>
    </div>
  );
}

export default App;