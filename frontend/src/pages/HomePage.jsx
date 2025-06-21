import React, { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import FeaturedRestaurants from "../components/FeaturedRestaurants";
import CTASection from "../components/CTASection";
import { useRestaurantStore } from "../store/useRestaurantStore";
import FeaturedCategories from "../Components/FeaturedCategory";

const Home = () => {
  const { restaurants, getrestaurants, loading } = useRestaurantStore();

  useEffect(() => {
    getrestaurants();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />

      {loading ? (
        <div className="text-center py-20 text-xl text-gray-500">
          Loading restaurants...
        </div>
      ) : (
        <FeaturedRestaurants restaurants={restaurants} />
      )}

      <FeaturedCategories />
      <CTASection />
    </div>
  );
};

export default Home;
