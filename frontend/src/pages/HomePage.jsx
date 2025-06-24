import React, { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import FeaturedRestaurants from "../components/FeaturedRestaurants";
import CTASection from "../components/CTASection";
import { useRestaurantStore } from "../store/useRestaurantStore";
import FeaturedCategories from "../Components/FeaturedCategory";
import Navbar from "../Components/skeleton/Navbar";

const Home = () => {
  const { restaurants, categories, getrestaurants, loading, getcategories } =
    useRestaurantStore();

  useEffect(() => {
    getrestaurants();
    getcategories();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />

      {loading ? (
        <div className="text-center py-20 text-xl text-gray-500">
          Loading restaurants...
        </div>
      ) : (
        <FeaturedRestaurants restaurants={restaurants} />
      )}

      <FeaturedCategories categories={categories} />
      <CTASection />
    </div>
  );
};

export default Home;
