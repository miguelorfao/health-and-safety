import React, { useState } from "react";

const HS_CHECK_CATEGORIES = [
  "Food Storage - Temperature Control",
  "Food Storage - Hygiene & Organization",
  "Preparation Area - Cleanliness",
  "Preparation Area - Cross Contamination",
  "Staff - Personal Hygiene",
  "Staff - Clothing & PPE",
  "Waste Management - Disposal",
  "Pest Control - Signs",
  "Equipment - Maintenance & Cleanliness",
  "Allergen Management",
  "Documentation - Records",
  "Training Records - Up to Date",
];

const HSLogger = ({ restaurantId, onAddCheck, onAddAction }) => {
  const [checkType, setCheckType] = useState(HS_CHECK_CATEGORIES[0]);
  const [passed, setPassed] = useState(true);
  const [notes, setNotes] = useState("");
  const [user, setUser] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkType || !user) return;

    const check = {
      id: Date.now().toString(),
      restaurantId,
      checkType,
      passed,
      notes,
      timestamp: new Date(),
      user,
    };

    if (!passed && onAddAction) {
      const action = {
        id: (Date.now() + 1).toString(),
        restaurantId,
        issueType: "hs_check",
        issueId: check.id,
        description: `H&S Check Failed: ${checkType}${notes ? " - " + notes : ""}`,
        actionTaken: "H&S check failure logged - corrective action required",
        timestamp: new Date(),
        user,
      };
      onAddAction(action);
    }

    onAddCheck(check);
    setCheckType(HS_CHECK_CATEGORIES[0]);
    setNotes("");
    setUser("");
    setPassed(true);
  };

  return (
    <div className="hs-logger">
      <h2>Health & Safety Check</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Check Category:</label>
          <select
            value={checkType}
            onChange={(e) => setCheckType(e.target.value)}
            required
          >
            {HS_CHECK_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Passed:</label>
          <select
            value={passed ? "yes" : "no"}
            onChange={(e) => setPassed(e.target.value === "yes")}
          >
            <option value="yes">Yes - Compliant</option>
            <option value="no">No - Non-Compliant</option>
          </select>
        </div>
        <div>
          <label>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any observations or details"
          />
        </div>
        <div>
          <label>Inspector/Staff Name:</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <button type="submit">Record Check</button>
      </form>
    </div>
  );
};

export default HSLogger;
