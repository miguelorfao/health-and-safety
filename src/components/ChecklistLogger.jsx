import React, { useState } from "react";

const openingItems = [
  "Check all equipment is clean and functional",
  "Verify refrigerator and freezer temperatures",
  "Check stock levels and expiry dates",
  "Inspect premises for cleanliness",
  "Ensure all safety equipment is in place",
  "Check lighting and ventilation",
  "Verify cash register and POS system",
  "Review daily specials and menu items",
];

const closingItems = [
  "Secure all cash and valuables",
  "Turn off all equipment and appliances",
  "Clean and sanitize all surfaces",
  "Dispose of waste properly",
  "Check and secure all doors and windows",
  "Set alarms and security systems",
  "Record end-of-day inventory",
  "Complete daily sales report",
];

const ChecklistLogger = ({ restaurantId, onAddChecklist }) => {
  const [checklistType, setChecklistType] = useState("opening");
  const [items, setItems] = useState([]);
  const [user, setUser] = useState("");

  React.useEffect(() => {
    const defaultItems = (
      checklistType === "opening" ? openingItems : closingItems
    ).map((item, index) => ({
      id: index.toString(),
      item,
      checked: false,
      notes: "",
    }));
    setItems(defaultItems);
  }, [checklistType]);

  const handleItemChange = (id, checked, notes) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked, notes } : item)),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    const checklist = {
      id: Date.now().toString(),
      restaurantId,
      type: checklistType,
      items,
      timestamp: new Date(),
      user,
    };

    onAddChecklist(checklist);
    setItems(items.map((item) => ({ ...item, checked: false, notes: "" })));
    setUser("");
  };

  return (
    <div className="checklist-logger">
      <h2>{checklistType === "opening" ? "Opening" : "Closing"} Checklist</h2>

      <div className="checklist-type-selector">
        <button
          className={checklistType === "opening" ? "active" : ""}
          onClick={() => setChecklistType("opening")}
        >
          Opening
        </button>
        <button
          className={checklistType === "closing" ? "active" : ""}
          onClick={() => setChecklistType("closing")}
        >
          Closing
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="checklist-items">
          {items.map((item) => (
            <div key={item.id} className="checklist-item">
              <label>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) =>
                    handleItemChange(
                      item.id,
                      e.target.checked,
                      item.notes || "",
                    )
                  }
                />
                {item.item}
              </label>
              <textarea
                placeholder="Notes (optional)"
                value={item.notes || ""}
                onChange={(e) =>
                  handleItemChange(item.id, item.checked, e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <div className="user-input">
          <label>User:</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>

        <button type="submit">Submit {checklistType} Checklist</button>
      </form>
    </div>
  );
};

export default ChecklistLogger;
