import maleDefaultDp from "../../assets/male_default_dp.png";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/skeleton/Navbar";
import { axiosInstance } from "../../../lib/axios";
import { Loader2, User, Phone, Car, Edit3, Save, X, Check, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRiderAuthStore } from "../store/riderAuthStore";

const ProfilePageRider = () => {
  const { authrider, checkAuthRider } = useRiderAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    vehicle_type: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/rider/data/profile");
        setProfile(res.data);
        setFormData({
          name: res.data.name,
          phone_number: res.data.phone_number,
          vehicle_type: res.data.vehicle_type,
        });
      } catch (err) {
        console.error("Error fetching rider profile:", err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (authrider) {
      fetchProfile();
    }
  }, [authrider]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/rider/data/profile", formData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      checkAuthRider(); // Refresh auth state to update name in Navbar
      // Re-fetch profile to ensure UI is updated with latest data
      const res = await axiosInstance.get("/rider/data/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      const newAvailability = !profile.is_available;
      await axiosInstance.put("/rider/data/availability", { is_available: newAvailability });
      setProfile({ ...profile, is_available: newAvailability });
      toast.success(`Availability set to ${newAvailability ? "Available" : "Unavailable"}`);
    } catch (err) {
      console.error("Error updating availability:", err);
      toast.error("Failed to update availability.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Loader2 className="size-10 animate-spin text-blue-600 mx-auto" />
            <p className="text-gray-600 mt-4 text-center">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <section className="container mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="size-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Profile Data</h2>
            <p className="text-gray-600">No profile data available.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <section className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rider Profile</h1>
          <p className="text-gray-600">Manage your profile information and availability</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mr-4">
                  <img src={maleDefaultDp} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                  <p className="text-blue-100">{profile.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
              >
                {isEditing ? (
                  <>
                    <X className="size-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="size-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
                    <div className="flex items-center gap-2">
                      <User className="size-4" />
                      Full Name
                    </div>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="phone_number">
                    <div className="flex items-center gap-2">
                      <Phone className="size-4" />
                      Phone Number
                    </div>
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Vehicle Type Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="vehicle_type">
                    <div className="flex items-center gap-2">
                      <Car className="size-4" />
                      Vehicle Type
                    </div>
                  </label>
                  <input
                    type="text"
                    id="vehicle_type"
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your vehicle type"
                    required
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save className="size-5" />
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Details</h3>
                {/* Profile Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="size-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">Full Name</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="size-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">Phone Number</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{profile.phone_number}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Car className="size-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">Vehicle Type</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{profile.vehicle_type}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Check className="size-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">Email Address</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Availability Status</h3>
                      <p className="text-sm text-gray-600">Toggle your availability to receive ride requests</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        profile.is_available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {profile.is_available ? "Available" : "Unavailable"}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                          checked={profile.is_available}
                          onChange={handleAvailabilityToggle}
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePageRider;