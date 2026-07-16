import { useState } from "react";
import {
  FiUploadCloud,
  FiFile,
  FiX,
  FiSend,
  FiSave,
} from "react-icons/fi";

export default function ComplaintForm() {
  const [file, setFile] = useState(null);

  const handleFile = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Complaint Submitted Successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm p-8"
    >
      {/* Heading */}

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-gray-800">
          Raise a Complaint
        </h2>

        <p className="text-gray-500 mt-2">
          Fill in the details below to submit your complaint.
        </p>

      </div>

      {/* Basic Details */}

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-semibold">
            Complaint Title
          </label>

          <input
            type="text"
            placeholder="Enter complaint title"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Category
          </label>

          <select className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-600">
            <option>Select Category</option>
            <option>Network</option>
            <option>Billing</option>
            <option>Software</option>
            <option>Payment</option>
            <option>Delivery</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Priority
          </label>

          <select className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-600">
            <option>Medium</option>
            <option>High</option>
            <option>Low</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Complaint Date
          </label>

          <input
            type="date"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>

      </div>

      {/* Description */}

      <div className="mt-8">

        <label className="block mb-2 font-semibold">
          Description
        </label>

        <textarea
          rows="6"
          placeholder="Describe your complaint in detail..."
          className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:border-blue-600"
        ></textarea>

      </div>

      {/* Upload */}

      <div className="mt-8">

        <label className="block mb-3 font-semibold">
          Attach Supporting File
        </label>

        {!file ? (
          <label className="border-2 border-dashed border-blue-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">

            <FiUploadCloud
              className="text-blue-600 mb-4"
              size={50}
            />

            <h4 className="font-semibold text-lg">
              Click to Upload
            </h4>

            <p className="text-gray-500 mt-2">
              PDF, JPG, PNG (Max 10 MB)
            </p>

            <input
              type="file"
              hidden
              onChange={handleFile}
            />

          </label>
        ) : (
          <div className="border rounded-2xl p-5 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <FiFile
                className="text-blue-600"
                size={30}
              />

              <div>

                <h4 className="font-semibold">
                  {file.name}
                </h4>

                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700"
            >
              <FiX size={24} />
            </button>

          </div>
        )}

      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-4 mt-10">

        <button
          type="button"
          className="px-6 py-3 border rounded-xl hover:bg-gray-100 flex items-center gap-2"
        >
          <FiSave />
          Save Draft
        </button>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2"
        >
          <FiSend />
          Submit Complaint
        </button>

      </div>

    </form>
  );
}