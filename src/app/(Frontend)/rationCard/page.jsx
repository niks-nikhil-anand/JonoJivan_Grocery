"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { generateRationCardPDF } from "@/lib/generateRationCardPDF";

const RationCardForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    whatsappNo: "",
    email: "",
    dob: "",
    address: "",
    state: "",
    pincode: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    profilePicture: null,
    aadhaarCardNumber: "",
    panCardNumber: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
      case "fatherName":
      case "address":
      case "state":
      case "bankName":
      case "accountNumber":
        if (!value.trim()) error = "This field is required";
        break;
      case "email":
        if (value && !/\S+@\S+\.\S+/.test(value)) error = "Invalid email address";
        break;
      case "whatsappNo":
        if (value && !/^\d{10}$/.test(value)) error = "Must be 10 digits";
        break;
      case "pincode":
         if (!value) error = "Required";
         else if (!/^\d{6}$/.test(value)) error = "Must be 6 digits";
         break;
      case "ifscCode":
         if(!value) error = "Required";
         break;
      case "aadhaarCardNumber":
          if (!value) error = "Required";
          else if (!/^\d{12}$/.test(value)) error = "Must be 12 digits";
          break;
      case "panCardNumber":
          if (!value) error = "Required";
          else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) error = "Invalid PAN format (e.g. ABCDE1234F)";
          break;
      case "dob":
          if(!value) error = "Required";
          break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    let newValue = value;
    if (type === "file") {
      newValue = files[0];
      setFormData({ ...formData, [name]: newValue });
      // Validate file presence if needed, mostly for profile pic
      if(name === 'profilePicture' && !newValue) {
         setErrors(prev => ({ ...prev, [name]: "Profile picture is required" }));
      } else {
         setErrors(prev => {
            const newErrs = { ...prev };
            delete newErrs[name];
            return newErrs;
         });
      }

    } else {
      // Uppercase PAN
      if(name === 'panCardNumber') newValue = value.toUpperCase();
      
      setFormData({ ...formData, [name]: newValue });
      
      const error = validateField(name, newValue);
      setErrors(prev => {
        const newErrs = { ...prev };
        if (error) newErrs[name] = error;
        else delete newErrs[name];
        return newErrs;
      });
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    const fieldsToValidate = [];
    if (currentStep === 1) fieldsToValidate.push("name", "fatherName", "dob", "email", "whatsappNo");
    if (currentStep === 2) fieldsToValidate.push("profilePicture", "aadhaarCardNumber", "panCardNumber");
    if (currentStep === 3) fieldsToValidate.push("address", "state", "pincode", "bankName", "accountNumber", "ifscCode");

    fieldsToValidate.forEach(field => {
        if(field === "profilePicture") {
            if(!formData.profilePicture) {
                newErrors[field] = "Profile picture is required";
                isValid = false;
            }
        } else {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
        if (step < 3) setStep(step + 1);
    } else {
        toast.error("Please fix the errors before proceeding.");
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) {
        toast.error("Please fix the errors.");
        return;
    }
    
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      const response = await axios.post("/api/rationCard", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Ration Card Application Submitted Successfully!");
        
        // Generate and Download PDF
        try {
            // Note: response.data.data refers to the ration card object returned by the API
            await generateRationCardPDF(response.data.data);
            toast.success("Downloading Application Receipt...");
        } catch (pdfError) {
            console.error("PDF Generation Error:", pdfError);
            toast.error("Application submitted, but failed to download receipt.");
        }

        setFormData({
            name: "", fatherName: "", whatsappNo: "", email: "", dob: "",
            address: "", state: "", pincode: "",
            accountNumber: "", ifscCode: "", bankName: "",
            profilePicture: null, aadhaarCardNumber: "", panCardNumber: "",
        });
        setStep(1);
        setErrors({});
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error submitting application.");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = [
    { id: 1, label: "Personal Details" },
    { id: 2, label: "Documents" },
    { id: 3, label: "Address & Bank" },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <Toaster />
      <motion.h1
        className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-8 drop-shadow-sm"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="text-green-600">Ration Card</span> Application
      </motion.h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-6 md:p-10 rounded-3xl shadow-2xl space-y-8 border border-gray-100"
      >
        <div className="w-full mb-6">
          <StepProgressBar stepLabels={stepLabels} step={step} />
          <div className="mt-8 border-b-2 border-gray-100" />
        </div>

        <div className="min-h-[400px]">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Full Name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                error={errors.name} 
                required 
              />
              <InputField 
                label="Father's Name" 
                name="fatherName" 
                value={formData.fatherName} 
                onChange={handleInputChange} 
                error={errors.fatherName} 
                required 
              />
              <InputField 
                label="Date of Birth" 
                name="dob" 
                type="date" 
                value={formData.dob} 
                onChange={handleInputChange} 
                error={errors.dob} 
                required 
              />
              <InputField 
                label="Email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                error={errors.email} 
              />
              <InputField 
                label="WhatsApp Number" 
                name="whatsappNo" 
                type="tel" 
                maxLength={10} 
                prefix="+91"
                value={formData.whatsappNo} 
                onChange={handleInputChange} 
                error={errors.whatsappNo} 
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Verification Documents</h2>
            <div className="space-y-6">
               <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700">Profile Picture <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                        type="file"
                        name="profilePicture"
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all"
                        accept="image/*"
                    />
                     <AnimatePresence>
                        {errors.profilePicture && (
                            <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-500 text-sm mt-1 absolute"
                            >
                            {errors.profilePicture}
                            </motion.p>
                        )}
                    </AnimatePresence>
                  </div>
               </div>

              <InputField 
                label="Aadhaar Card Number" 
                name="aadhaarCardNumber" 
                maxLength={12} 
                placeholder="12 digit number" 
                value={formData.aadhaarCardNumber} 
                onChange={handleInputChange} 
                error={errors.aadhaarCardNumber} 
                required 
              />
              
              <InputField 
                label="PAN Card Number" 
                name="panCardNumber" 
                maxLength={10} 
                placeholder="ABCDE1234F" 
                value={formData.panCardNumber} 
                onChange={handleInputChange} 
                error={errors.panCardNumber} 
                required 
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Address & Bank */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Address & Bank Details</h2>
            
            <div className="space-y-6 mb-8">
               <div>
                <label className="block mb-2 font-semibold text-gray-700">Address <span className="text-red-500">*</span></label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-shadow ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  rows="3"
                ></textarea>
                <AnimatePresence>
                    {errors.address && (
                        <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm mt-1"
                        >
                        {errors.address}
                        </motion.p>
                    )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <InputField 
                    label="State" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    error={errors.state} 
                    required 
                />
                <InputField 
                    label="Pincode" 
                    name="pincode" 
                    maxLength={6} 
                    value={formData.pincode} 
                    onChange={handleInputChange} 
                    error={errors.pincode} 
                    required 
                />
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Bank Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                        label="Bank Name" 
                        name="bankName" 
                        value={formData.bankName} 
                        onChange={handleInputChange} 
                        error={errors.bankName} 
                        required 
                    />
                    <InputField 
                        label="Account Number" 
                        name="accountNumber" 
                        value={formData.accountNumber} 
                        onChange={handleInputChange} 
                        error={errors.accountNumber} 
                        required 
                    />
                    <div className="md:col-span-2">
                        <InputField 
                            label="IFSC Code" 
                            name="ifscCode" 
                            value={formData.ifscCode} 
                            onChange={handleInputChange} 
                            error={errors.ifscCode} 
                            required 
                        />
                    </div>
                </div>
            </div>
          </motion.div>
        )}
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-between pt-6 gap-4">
          {step > 1 && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrevious}
              className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-sm w-full md:w-auto"
              disabled={loading}
            >
              Previous
            </motion.button>
          )}
          {step < 3 ? (
            <motion.button
              key="next-button"
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-200 ml-auto w-full md:w-auto"
            >
              Next Step
            </motion.button>
          ) : (
            <motion.button
              key="submit-button"
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 ml-auto flex items-center justify-center min-w-[160px] w-full md:w-auto"
              disabled={loading}
            >
               {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              {loading ? "Submitting..." : "Submit Application"}
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, error, required, placeholder, maxLength, prefix }) => (
    <div className="flex flex-col w-full relative pb-4">
      <label className="mb-2 font-semibold text-gray-700 text-sm md:text-base">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative flex items-center">
        {prefix && (
            <span className="absolute left-3 text-gray-500 font-medium">{prefix}</span>
        )}
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full p-3 border rounded-xl outline-none transition-all duration-300
                ${prefix ? 'pl-12' : ''}
                ${error 
                    ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 hover:border-green-400 hover:shadow-sm'
                }`}
        />
      </div>
      <AnimatePresence>
        {error && (
            <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-xs mt-1 absolute -bottom-1 left-0"
            >
            {error}
            </motion.p>
        )}
      </AnimatePresence>
    </div>
);

const StepProgressBar = ({ stepLabels, step }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-lg mx-auto px-4">
      {stepLabels.map(({ id, label }) => (
        <div key={id} className="flex flex-col items-center relative flex-1">
          <motion.div
            className={`w-12 h-12 flex items-center justify-center rounded-full font-bold border-2 shadow-md z-10 
              ${step >= id
                ? "bg-green-500 border-green-500 text-white"
                : "bg-white border-gray-200 text-gray-400"
              }`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {step > id ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            ) : id}
          </motion.div>
          <p
            className={`text-xs md:text-sm mt-3 font-semibold text-center transition-colors duration-300 ${
              step >= id ? "text-green-700" : "text-gray-400"
            }`}
          >
            {label}
          </p>
           {/* Line Connector */}
           {id !== stepLabels.length && (
            <div className="absolute top-6 left-[50%] w-full h-[3px] -z-0 bg-gray-200">
               <motion.div 
                 className="h-full bg-green-500"
                 initial={{ width: "0%" }}
                 animate={{ width: step > id ? "100%" : "0%" }}
                 transition={{ duration: 0.5, delay: 0.1 }}
               />
            </div>
           )}
        </div>
      ))}
    </div>
  );
};

export default RationCardForm;
