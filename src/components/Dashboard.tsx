import React from 'react';
import { TemperatureReading, HSCheck, Checklist, User, Action } from '../types';

interface DashboardProps {
  temperatureReadings: TemperatureReading[];
  hsChecks: HSCheck[];
  checklists: Checklist[];
  actions: Action[];
  restaurantId: string;
  user: User;
  onEditTemperature: (reading: TemperatureReading) => void;
  onDeleteTemperature: (id: string) => void;
  onEditChecklist: (checklist: Checklist) => void;
  onDeleteChecklist: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  temperatureReadings,
  hsChecks,
  checklists,
  actions,
  restaurantId,
  user,
  onEditTemperature,
  onDeleteTemperature,
  onEditChecklist,
  onDeleteChecklist,
}) => {
  const isAdmin = user.role === 'admin';
  const restaurantReadings = isAdmin ? temperatureReadings : temperatureReadings.filter(r => r.restaurantId === restaurantId);
  const restaurantChecks = isAdmin ? hsChecks : hsChecks.filter(c => c.restaurantId === restaurantId);
  const restaurantChecklists = isAdmin ? checklists : checklists.filter(c => c.restaurantId === restaurantId);
  const restaurantActions = isAdmin ? actions : actions.filter(a => a.restaurantId === restaurantId);

  const summaryCards = [
    { label: 'Temperature Logs', value: restaurantReadings.length },
    { label: 'H&S Checks', value: restaurantChecks.length },
    { label: 'Checklists', value: restaurantChecklists.length },
    { label: 'Corrective Actions', value: restaurantActions.length },
  ];

  const renderEmptyRow = (message: string, columns: number) => (
    <tr>
      <td colSpan={columns} className="empty-row">
        {message}
      </td>
    </tr>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>
            {isAdmin
              ? 'Review activity across all restaurant locations.'
              : `Review recent activity for Restaurant ${restaurantId}.`}
          </p>
        </div>
      </div>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <div key={card.label} className="summary-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="section">
        <h3>Temperature Readings</h3>
        <p className="section-description">Track cooked, chilled, frozen, and refrigeration checks.</p>
        <table>
          <thead>
            <tr>
              {isAdmin && <th>Restaurant</th>}
              <th>Type</th>
              <th>Food Item</th>
              <th>Temperature</th>
              <th>Time</th>
              <th>User</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {restaurantReadings.length === 0 && renderEmptyRow('No temperature logs recorded yet.', isAdmin ? 7 : 6)}
            {restaurantReadings.map((reading) => (
              <tr key={reading.id}>
                {isAdmin && <td>Restaurant {reading.restaurantId}</td>}
                <td>{reading.type}</td>
                <td>{reading.foodItem}</td>
                <td>{reading.temperature}°{reading.unit}</td>
                <td>{reading.timestamp.toLocaleString()}</td>
                <td>{reading.user}</td>
                {isAdmin && (
                  <td>
                    <button onClick={() => onEditTemperature(reading)}>Edit</button>
                    <button onClick={() => onDeleteTemperature(reading.id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3>Health & Safety Checks</h3>
        <p className="section-description">See completed inspections and any failed compliance points.</p>
        <table>
          <thead>
            <tr>
              {isAdmin && <th>Restaurant</th>}
              <th>Check Type</th>
              <th>Passed</th>
              <th>Notes</th>
              <th>Time</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {restaurantChecks.length === 0 && renderEmptyRow('No health and safety checks recorded yet.', isAdmin ? 6 : 5)}
            {restaurantChecks.map((check) => (
              <tr key={check.id}>
                {isAdmin && <td>Restaurant {check.restaurantId}</td>}
                <td>{check.checkType}</td>
                <td>{check.passed ? 'Yes' : 'No'}</td>
                <td>{check.notes}</td>
                <td>{check.timestamp.toLocaleString()}</td>
                <td>{check.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3>Checklists</h3>
        <p className="section-description">Monitor opening and closing routines for consistency.</p>
        <table>
          <thead>
            <tr>
              {isAdmin && <th>Restaurant</th>}
              <th>Type</th>
              <th>Items Completed</th>
              <th>Time</th>
              <th>User</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {restaurantChecklists.length === 0 && renderEmptyRow('No opening or closing checklists have been submitted yet.', isAdmin ? 6 : 5)}
            {restaurantChecklists.map((checklist) => (
              <tr key={checklist.id}>
                {isAdmin && <td>Restaurant {checklist.restaurantId}</td>}
                <td>{checklist.type}</td>
                <td>{checklist.items.filter(item => item.checked).length}/{checklist.items.length}</td>
                <td>{checklist.timestamp.toLocaleString()}</td>
                <td>{checklist.user}</td>
                {isAdmin && (
                  <td>
                    <button onClick={() => onEditChecklist(checklist)}>Edit</button>
                    <button onClick={() => onDeleteChecklist(checklist.id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3>Corrective Actions</h3>
        <p className="section-description">Review follow-up actions taken after issues were found.</p>
        <table>
          <thead>
            <tr>
              {isAdmin && <th>Restaurant</th>}
              <th>Issue Type</th>
              <th>Description</th>
              <th>Action Taken</th>
              <th>Time</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {restaurantActions.length === 0 && renderEmptyRow('No corrective actions logged yet.', isAdmin ? 6 : 5)}
            {restaurantActions.map((action) => (
              <tr key={action.id}>
                {isAdmin && <td>Restaurant {action.restaurantId}</td>}
                <td>{action.issueType}</td>
                <td>{action.description}</td>
                <td>{action.actionTaken}</td>
                <td>{action.timestamp.toLocaleString()}</td>
                <td>{action.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;