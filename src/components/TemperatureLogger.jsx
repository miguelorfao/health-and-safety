import React, { useState } from "react";

const TemperatureLogger = ({ restaurantId, onAddReading, onAddAction }) => {
  const [type, setType] = useState("cold");
  const [foodItem, setFoodItem] = useState("");
  const [temperature, setTemperature] = useState("");
  const [unit, setUnit] = useState("C");
  const [user, setUser] = useState("");
  const [error, setError] = useState("");

  const validateTemperature = (temp, valueType, valueUnit) => {
    const tempC = valueUnit === "F" ? ((temp - 32) * 5) / 9 : temp;

    switch (valueType) {
      case "cold":
        return tempC < 8;
      case "hot":
        return tempC > 75;
      case "frozen":
        return tempC < -18;
      case "fridge":
        return tempC < 4;
      default:
        return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodItem || !temperature || !user) return;

    const tempValue = parseFloat(temperature);
    const isValid = validateTemperature(tempValue, type, unit);

    const reading = {
      id: Date.now().toString(),
      restaurantId,
      type,
      foodItem,
      temperature: tempValue,
      unit,
      timestamp: new Date(),
      user,
    };

    if (!isValid) {
      const action = {
        id: (Date.now() + 1).toString(),
        restaurantId,
        issueType: "temperature",
        issueId: reading.id,
        description: `Temperature violation: ${type} ${foodItem} recorded at ${tempValue}°${unit} (out of acceptable range)`,
        actionTaken:
          "Temperature logged with violation - corrective action required",
        timestamp: new Date(),
        user,
      };
      onAddAction(action);
      setError(
        `Temperature out of range for ${type} food/equipment. Action has been logged!`,
      );
    } else {
      setError("");
    }

    onAddReading(reading);
    setFoodItem("");
    setTemperature("");
    setUser("");
  };

  return (
    <div className="temperature-logger">
      <h2>Log Food Temperature</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="cold">Cold Food (under 8°C)</option>
            <option value="hot">Hot Food (above 75°C)</option>
            <option value="frozen">Frozen Equipment (below -18°C)</option>
            <option value="fridge">Fridge Equipment (below 4°C)</option>
          </select>
        </div>
        <div>
          <label>Food Item:</label>
          <input
            type="text"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Temperature:</label>
          <input
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            required
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="C">°C</option>
            <option value="F">°F</option>
          </select>
        </div>
        <div>
          <label>User:</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Log Temperature</button>
      </form>
    </div>
  );
};

export default TemperatureLogger;
