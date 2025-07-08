import React, { useEffect } from "react";
import RestaurantCard from "../Components/cards/RestaurantCard";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { Loader2 } from "lucide-react";
import Navbar from "../Components/skeleton/Navbar";

const RestaurantPage = () => {
  const { restaurants, getrestaurants } = useRestaurantStore();

  useEffect(() => {
    getrestaurants();
    {
      console.log(restaurants);
    }
  }, []);

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            All Restaurants
          </h1>
          {console.log("in restaurant page", restaurants)}

          {!restaurants ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
              <span className="ml-2 text-pink-500">Loading...</span>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.length === 0 ? (
                <p className="text-gray-500">No restaurants found.</p>
              ) : (
                restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default RestaurantPage;
