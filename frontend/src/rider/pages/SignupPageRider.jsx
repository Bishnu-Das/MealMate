import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRiderAuthStore } from "../store/riderAuthStore";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/skeleton/Navbar";

function SignupPageRider() {
  const navigate = useNavigate();
  const { signup, isSigningUp, authrider } = useRiderAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    vehicle_type: "",
    current_location: "",
  });

  useEffect(() => {
    if (authrider) {
      navigate("/rider");
    }
  }, [authrider, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Create a Rider Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Phone Number
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="+1234567890"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Vehicle Type
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Motorcycle"
                value={formData.vehicle_type}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_type: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Current Location
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Dhaka, Bangladesh"
                value={formData.current_location}
                onChange={(e) =>
                  setFormData({ ...formData, current_location: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full flex justify-center items-center gap-2 bg-primary-600 text-white py-2.5 px-5 rounded-lg font-medium hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign up"
              )}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <a
                href="/rider/login"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

export default SignupPageRider;