import React, { useEffect, useState } from "react";

const HSChecksView = ({ hsChecks, user, selectedRestaurantId = "all" }) => {
  const [filterRestaurant, setFilterRestaurant] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const isAdmin = user.role === "admin";
  const restaurants = Array.from(
    new Set(hsChecks.map((check) => check.restaurantId)),
  );

  useEffect(() => {
    if (isAdmin) {
      setFilterRestaurant(selectedRestaurantId);
    }
  }, [isAdmin, selectedRestaurantId]);

  let filteredChecks = [...hsChecks];

  if (!isAdmin) {
    filteredChecks = filteredChecks.filter(
      (check) => check.restaurantId === user.restaurantId,
    );
  }

  if (filterRestaurant !== "all") {
    filteredChecks = filteredChecks.filter(
      (check) => check.restaurantId === filterRestaurant,
    );
  }

  if (filterStatus === "passed") {
    filteredChecks = filteredChecks.filter((check) => check.passed);
  } else if (filterStatus === "failed") {
    filteredChecks = filteredChecks.filter((check) => !check.passed);
  }

  filteredChecks = filteredChecks.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const totalChecks = filteredChecks.length;
  const passedChecks = filteredChecks.filter((c) => c.passed).length;
  const failedChecks = filteredChecks.filter((c) => !c.passed).length;
  const complianceRate =
    totalChecks > 0 ? ((passedChecks / totalChecks) * 100).toFixed(1) : "0";

  return (
    <div className="hs-checks-view">
      <h2>Health & Safety Checks</h2>

      <div className="hs-statistics">
        <div className="stat-card">
          <h3>Total Checks</h3>
          <p className="stat-number">{totalChecks}</p>
        </div>
        <div className="stat-card">
          <h3>Passed</h3>
          <p className="stat-number passed">{passedChecks}</p>
        </div>
        <div className="stat-card">
          <h3>Failed</h3>
          <p className="stat-number failed">{failedChecks}</p>
        </div>
        <div className="stat-card">
          <h3>Compliance Rate</h3>
          <p className="stat-number">{complianceRate}%</p>
        </div>
      </div>

      <div className="hs-filters">
        {isAdmin && selectedRestaurantId === "all" && (
          <div>
            <label>Filter by Location:</label>
            <select
              value={filterRestaurant}
              onChange={(e) => setFilterRestaurant(e.target.value)}
            >
              <option value="all">All Locations</option>
              {restaurants.map((restaurantId) => (
                <option key={restaurantId} value={restaurantId}>
                  Restaurant {restaurantId}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Checks</option>
            <option value="passed">Passed Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>
      </div>

      <div className="hs-table-container">
        <table className="hs-table">
          <thead>
            <tr>
              {isAdmin && <th>Location</th>}
              <th>Check Category</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Inspector</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredChecks.map((check) => (
              <tr
                key={check.id}
                className={check.passed ? "passed-row" : "failed-row"}
              >
                {isAdmin && <td>Restaurant {check.restaurantId}</td>}
                <td>{check.checkType}</td>
                <td>
                  <span
                    className={`status-badge ${check.passed ? "passed" : "failed"}`}
                  >
                    {check.passed ? "Compliant" : "Non-Compliant"}
                  </span>
                </td>
                <td>{check.notes || "-"}</td>
                <td>{check.user}</td>
                <td>{check.timestamp.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredChecks.length === 0 && (
        <div className="no-data-message">
          <p>No H&S checks found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default HSChecksView;
