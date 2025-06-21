import { Link } from "react-router-dom";

const CTASection = () => (
  <div className="py-20 bg-gradient-to-r from-primary to-secondary">
    <div className="max-w-4xl mx-auto text-center px-4">
      <h2 className="text-4xl font-bold text-white mb-6">
        Ready to order? Let's get started!
      </h2>
      <p className="text-xl text-white/90 mb-8">
        Join thousands of satisfied customers who trust FoodPanda for their food
        delivery needs.
      </p>
      <Link to="/restaurants" className="btn btn-warning btn-lg px-12">
        Browse Restaurants
      </Link>
    </div>
  </div>
);

export default CTASection;
