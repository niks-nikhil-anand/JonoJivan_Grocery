"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const VendorRegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    noOfEmployee: "",
    businessAddress: "",
    adhaarCard: null,
    panCard: null,
    bankPassbook: null,
    msmsCertificate: null,
    gstCertificate: null,
    tradeLicence: null,
    shopPhoto: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await axios.post("/api/auth/vendorRegistration", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Registration successful!");
    } catch (error) {
      toast.error("Error submitting the form. Please try again.");
    }
  };

  const stepLabels = [
    { id: 1, label: "Personal Information" },
    { id: 2, label: "Business Information" },
    { id: 3, label: "Documents" },
  ];

  return (
    <div className="flex flex-col items-center w-full p-4 md:p-8 bg-gray-50 min-h-screen">
      <motion.h1
        className="text-2xl md:text-4xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Vendor Registration
      </motion.h1>
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <div className="w-full max-w-lg mb-8">
        <div className="">
      <StepProgressBar stepLabels={stepLabels} step={step} />
    </div>
      </div>
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <label className="block mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <label className="block mt-4 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <label className="block mt-4 mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              maxLength={10}
              required
            />
            <label className="block mt-4 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <label className="block mt-4 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <label className="block mb-2">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <label className="block mt-4 mb-2">Number of Employees</label>
            <input
              type="number"
              name="noOfEmployee"
              value={formData.noOfEmployee}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <label className="block mt-4 mb-2">Business Address</label>
            <textarea
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            {[
              "adhaarCard",
              "panCard",
              "bankPassbook",
              "msmsCertificate",
              "gstCertificate",
              "tradeLicence",
              "shopPhoto",
            ].map((doc, index) => (
              <div key={index} className="mt-4">
                <label className="block mb-2 capitalize">{doc.replace(/([A-Z])/g, " $1").trim()}</label>
                <input
                  type="file"
                  name={doc}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            ))}
          </motion.div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={handlePrevious}
              className="px-6 py-2 bg-gray-200 rounded"
            >
              Previous
            </motion.button>
          )}
          {step < 3 && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={handleNext}
              className="px-6 py-2 bg-green-500 text-white rounded"
            >
              Next
            </motion.button>
          )}
          {step === 3 && (
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};


const StepProgressBar = ({ stepLabels, step }) => {
    return (
      <div className="flex justify-between items-center flex-wrap gap-4">
        {stepLabels.map(({ id, label }) => (
          <motion.div
            key={id}
            className={`flex-1 text-center relative ${
              id < step ? "text-green-500" : id === step ? "text-blue-500" : "text-gray-400"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className={`w-8 md:w-10 h-10 md:h-12 rounded-full mx-auto flex items-center justify-center font-bold border-2 ${
                id <= step
                  ? id === step
                    ? "border-blue-500 bg-blue-100"
                    : "border-green-500 bg-green-100"
                  : "border-gray-400 bg-gray-100"
              }`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {id}
            </motion.div>
            <p className="text-xs md:text-sm font-medium pt-2">{label}</p>
          </motion.div>
        ))}
      </div>
    );
  };
  

export default VendorRegistrationForm;
