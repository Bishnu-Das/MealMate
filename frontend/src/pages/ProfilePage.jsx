import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAuthStore } from "../store/userAuthStore";
import Navbar from "../Components/skeleton/Navbar";
import LocationPickerModal from "../Components/LocationPickerModal";

function Profile() {
  const navigate = useNavigate();
  const { authUser, updateProfile } = userAuthStore();
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: { lat: "", lng: "" },
  });

  const setLocation = (coords) => {
    setFormData((prev) => ({
      ...prev,
      location: { lat: coords.lat, lng: coords.lng },
    }));
  };

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    } else {
      setFormData({
        name: authUser.name || "",
        phone: authUser.phone || "",
        email: authUser.email || "",
        location: {
          lat: authUser.location?.lat || "",
          lng: authUser.location?.lng || "",
        },
      });
    }
  }, [authUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["lat", "lng"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    console.log("Profile Updated:", formData);
  };

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Your Profile
          </h2>
          <form onSubmit={handleSave} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email (cannot change)
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full p-2.5 border rounded-lg bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white opacity-70 cursor-not-allowed"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="+8801XXXXXXXXX"
              />
            </div>

            {/* Location Coordinates */}
            <div className="flex gap-4 items-end">
              <div className="w-1/2">
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Pick Location
                </button>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Latitude
                </label>
                <input
                  type="text"
                  name="lat"
                  value={formData.location.lat}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Longitude
                </label>
                <input
                  type="text"
                  name="lng"
                  value={formData.location.lng}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="bg-[#e21b70] hover:bg-[#c51b61] text-white py-2.5 px-6 rounded-lg font-semibold w-full"
            >
              Save Changes
            </button>
          </form>
        </div>

        <LocationPickerModal
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          onSelect={setLocation}
          initialLocation={formData.location}
        />
      </section>
    </>
  );
}

export default Profile;
