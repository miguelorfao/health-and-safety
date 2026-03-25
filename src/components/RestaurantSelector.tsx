import React from 'react';
import { Restaurant } from '../types';

interface RestaurantSelectorProps {
  restaurants: Restaurant[];
  selectedRestaurant: string | null;
  onSelect: (id: string) => void;
}

const RestaurantSelector: React.FC<RestaurantSelectorProps> = ({
  restaurants,
  selectedRestaurant,
  onSelect,
}) => {
  return (
    <div className="restaurant-selector">
      <h2>Select Restaurant</h2>
      <div className="restaurant-buttons">
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            className={selectedRestaurant === restaurant.id ? 'selected' : ''}
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