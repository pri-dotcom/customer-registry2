import { useState } from "react";
import {
  FiCamera,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiSave,
} from "react-icons/fi";

export default function ProfileForm() {
  const [profile, setProfile] = useState({
    name: "Bobby Johnson",
    email: "bobby@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street",
    city: "Hyderabad",
    state: "Telangana",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile Updated Successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm p-8"
    >
      {/* Profile Picture */}

      <div className="flex flex-col items-center">

        <div className="relative">

          <img
            src="https://i.pravatar.cc/180?img=12"
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-blue-600"
          />

          <button
            type="button"
            className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
          >
            <FiCamera />
          </button>

        </div>

        <h2 className="text-2xl font-bold mt-5">
          {profile.name}
        </h2>

        <p className="text-gray-500">
          Customer
        </p>

      </div>

      {/* Personal Information */}

      <div className="mt-10">

        <h3 className="text-xl font-bold mb-6">
          Personal Information
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="font-medium mb-2 flex items-center gap-2">
              <FiUser />
              Full Name
            </label>

            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
            />

          </div>

          <div>

            <label className="font-medium mb-2 flex items-center gap-2">
              <FiMail />
              Email
            </label>

            <input
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
            />

          </div>

          <div>

            <label className="font-medium mb-2 flex items-center gap-2">
              <FiPhone />
              Phone
            </label>

            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
            />

          </div>

          <div>

            <label className="font-medium mb-2 flex items-center gap-2">
              <FiMapPin />
              Address
            </label>

            <input
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
            />

          </div>

          <div>

            <label className="font-medium mb-2">
              City
            </label>

            <input
              name="city"
              value={profile.city}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
            />

          </div>

          <div>

            <label className="font-medium mb-2">
              State
            </label>

            <input
              name="state"
              value={profile.state}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
            />

          </div>

        </div>

      </div>

      {/* Change Password */}

      <div className="mt-12">

        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FiLock />
          Change Password
        </h3>

        <div className="grid md:grid-cols-3 gap-6">

          <input
            type="password"
            name="oldPassword"
            value={profile.oldPassword}
            onChange={handleChange}
            placeholder="Current Password"
            className="border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
          />

          <input
            type="password"
            name="newPassword"
            value={profile.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className="border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
          />

          <input
            type="password"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
          />

        </div>

      </div>

      {/* Save Button */}

      <div className="flex justify-end mt-10">

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2"
        >
          <FiSave />
          Save Changes
        </button>

      </div>

    </form>
  );
}