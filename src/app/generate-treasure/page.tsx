"use client";
import React, { useState } from "react";

const AwesomeForm = () => {
  const [formData, setFormData] = useState({
    location: "",
    latitude: "",
    longitude: "",
    name: "",
    tokenAddress: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Handle form submission logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-[90%] rounded-lg bg-neutral-800 p-8 text-white shadow-2xl shadow-lime-500">
        <h2 className="mb-6 text-center text-2xl font-bold">
          🎁 Create Treasure
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-neutral-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter location"
            />
          </div>

          {/* Latitude */}
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium">
              Latitude
            </label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-neutral-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter latitude"
            />
          </div>

          {/* Longitude */}
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium">
              Longitude
            </label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-neutral-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter longitude"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Token Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-neutral-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Wallet Address */}
          <div>
            <label htmlFor="tokenAddress" className="block text-sm font-medium">
              Token Address
            </label>
            <input
              type="text"
              id="tokenAddress"
              name="tokenAddress"
              value={formData.tokenAddress}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-neutral-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter token address"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-lime-600 py-2 font-semibold text-white transition hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AwesomeForm;
