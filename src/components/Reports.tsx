import React from 'react';
import { TemperatureReading, HSCheck, Checklist, Action } from '../types';

interface ReportsProps {
  temperatureReadings: TemperatureReading[];
  hsChecks: HSCheck[];
  checklists: Checklist[];
  actions: Action[];
}

const Reports: React.FC<ReportsProps> = ({
  temperatureReadings,
  hsChecks,
  checklists,
  actions,
}) => {
  // Calculate statistics
  const totalReadings = temperatureReadings.length;
  const readingsByRestaurant = temperatureReadings.reduce((acc, reading) => {
    acc[reading.restaurantId] = (acc[reading.restaurantId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const outOfRangeReadings = temperatureReadings.filter(reading => {
    const tempC = reading.unit === 'F' ? (reading.temperature - 32) * 5/9 : reading.temperature;
    switch (reading.type) {
      case 'cold': return tempC >= 8;
      case 'hot': return tempC <= 75;
      case 'frozen': return tempC >= -18;
      case 'fridge': return tempC >= 4;
      default: return false;
    }
  });

  const totalChecks = hsChecks.length;
  const passedChecks = hsChecks.filter(check => check.passed).length;
  const failedChecks = totalChecks - passedChecks;

  const totalChecklists = checklists.length;
  const openingChecklists = checklists.filter(c => c.type === 'opening').length;
  const closingChecklists = checklists.filter(c => c.type === 'closing').length;

  const totalActions = actions.length;
  const actionsByType = actions.reduce((acc, action) => {
    acc[action.issueType] = (acc[action.issueType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const reportCards = [
    { label: 'Temperature logs', value: totalReadings },
    { label: 'Failed H&S checks', value: failedChecks },
    { label: 'Checklists', value: totalChecklists },
    { label: 'Corrective actions', value: totalActions },
  ];

  return (
    <div className="reports">
      <div className="reports-header">
        <h2>Full Report - All Locations</h2>
        <p>Use this overview to review compliance performance and focus on sites that need support.</p>
      </div>

      <div className="summary-grid">
        {reportCards.map((card) => (
          <div key={card.label} className="summary-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="report-section">
        <h3>Temperature Readings Summary</h3>
        <p>Total Readings: {totalReadings}</p>
        <p>Out of Range: {outOfRangeReadings.length}</p>
        <h4>Readings by Restaurant:</h4>
        <ul>
          {Object.entries(readingsByRestaurant).map(([restaurantId, count]) => (
            <li key={restaurantId}>Restaurant {restaurantId}: {count} readings</li>
          ))}
        </ul>
        <h4>Out of Range Readings:</h4>
        {outOfRangeReadings.length === 0 ? (
          <p className="empty-note">No out of range readings recorded.</p>
        ) : (
          <ul>
            {outOfRangeReadings.map(reading => (
            <li key={reading.id}>
              Restaurant {reading.restaurantId} - {reading.type} - {reading.foodItem}: {reading.temperature}°{reading.unit}
            </li>
            ))}
          </ul>
        )}
      </div>

      <div className="report-section">
        <h3>Health & Safety Checks Summary</h3>
        <p>Total Checks: {totalChecks}</p>
        <p>Passed: {passedChecks}</p>
        <p>Failed: {failedChecks}</p>
        <p>Pass Rate: {totalChecks > 0 ? ((passedChecks / totalChecks) * 100).toFixed(1) : 0}%</p>
      </div>

      <div className="report-section">
        <h3>Checklists Summary</h3>
        <p>Total Checklists: {totalChecklists}</p>
        <p>Opening Checklists: {openingChecklists}</p>
        <p>Closing Checklists: {closingChecklists}</p>
      </div>

      <div className="report-section">
        <h3>Corrective Actions Summary</h3>
        <p>Total Actions: {totalActions}</p>
        <h4>Actions by Issue Type:</h4>
        {Object.keys(actionsByType).length === 0 ? (
          <p className="empty-note">No corrective actions logged yet.</p>
        ) : (
          <ul>
            {Object.entries(actionsByType).map(([type, count]) => (
            <li key={type}>{type}: {count} actions</li>
            ))}
          </ul>
        )}
      </div>

      <div className="report-section">
        <h3>Detailed Temperature Readings</h3>
        <table>
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Type</th>
              <th>Food Item</th>
              <th>Temperature</th>
              <th>Time</th>
              <th>User</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {temperatureReadings.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-row">No temperature readings available for reporting.</td>
              </tr>
            )}
            {temperatureReadings.map((reading) => {
              const tempC = reading.unit === 'F' ? (reading.temperature - 32) * 5/9 : reading.temperature;
              let status = 'OK';
              switch (reading.type) {
                case 'cold': if (tempC >= 8) status = 'OUT OF RANGE'; break;
                case 'hot': if (tempC <= 75) status = 'OUT OF RANGE'; break;
                case 'frozen': if (tempC >= -18) status = 'OUT OF RANGE'; break;
                case 'fridge': if (tempC >= 4) status = 'OUT OF RANGE'; break;
              }
              return (
                <tr key={reading.id}>
                  <td>Restaurant {reading.restaurantId}</td>
                  <td>{reading.type}</td>
                  <td>{reading.foodItem}</td>
                  <td>{reading.temperature}°{reading.unit}</td>
                  <td>{reading.timestamp.toLocaleString()}</td>
                  <td>{reading.user}</td>
                  <td style={{ color: status === 'OUT OF RANGE' ? 'red' : 'green' }}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="report-section">
        <h3>Detailed Corrective Actions</h3>
        <table>
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Issue Type</th>
              <th>Description</th>
              <th>Action Taken</th>
              <th>Time</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {actions.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-row">No corrective actions available for reporting.</td>
              </tr>
            )}
            {actions.map((action) => (
              <tr key={action.id}>
                <td>Restaurant {action.restaurantId}</td>
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

export default Reports;