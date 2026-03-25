import React from "react";

const RestaurantSelector = ({ restaurants, selectedRestaurant, onSelect }) => {
  return (
    <div className="restaurant-selector">
      <h2>Select Restaurant</h2>
      <div className="restaurant-buttons">
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            className={selectedRestaurant === restaurant.id ? "selected" : ""}
            onClick={() => onSelect(restaurant.id)}
          >
            {restaurant.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RestaurantSelector;
