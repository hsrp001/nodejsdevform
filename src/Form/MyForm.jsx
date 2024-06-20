import React, { useState } from 'react';

const MyForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    resStreet1: '',
    resStreet2: '',
    permStreet1: '',
    permStreet2: '',
    sameAsResidential: false,
  });
  const [files, setFiles] = useState([{ filename: '', filetype: 'pdf', document: null }]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files: inputFiles } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        sameAsResidential: checked,
        permStreet1: checked ? prevData.resStreet1 : '',
        permStreet2: checked ? prevData.resStreet2 : '',
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (index, e) => {
    const { name, value, files: inputFiles } = e.target;
    const newFiles = [...files];
    if (name === 'document') {
      newFiles[index][name] = inputFiles[0];
    } else {
      newFiles[index][name] = value;
    }
    setFiles(newFiles);
  };

  const addFileInput = () => {
    setFiles([...files, { filename: '', filetype: 'pdf', document: null }]);
  };

  const removeFileInput = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'dob',
      'resStreet1',
      'resStreet2',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    const dob = new Date(formData.dob);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      newErrors.dob = 'You must be at least 18 years old';
    }

    files.forEach((file, index) => {
      if (!file.filename || !file.document) {
        newErrors[`file${index}`] = 'This field is required';
      }
    });

    if (files.length < 2) {
      newErrors.files = 'At least two file inputs are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      files.forEach((file, index) => {
        formDataToSend.append(`filename${index}`, file.filename);
        formDataToSend.append(`filetype${index}`, file.filetype);
        formDataToSend.append(`document${index}`, file.document);
      });
      fetch('/formsubmit', {
        method: 'POST',
        body: formDataToSend,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error:', error));
    }
  };

  return (
    <div className="flex flex-col items-center p-3 justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-10 rounded-lg shadow-lg min-w-full">
        <h1 className="text-3xl font-bold mb-4">Registration Form</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-800 font-bold mb-2">
                First Name <span className=' text-red-500'>*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-800 font-bold mb-2">
                Last Name <span className=' text-red-500'>*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-gray-800 font-bold mb-2">
                Email <span className=' text-red-500'>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="dob" className="block text-gray-800 font-bold mb-2">
                Date of Birth <span className=' text-red-500'>*</span>
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {errors.dob && <p className="text-red-500">{errors.dob}</p>}
            </div>
          </div>

          <div>
            <p className="text-lg font-bold text-gray-800 mb-2">Residential Address</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="resStreet1" className="block text-gray-800 mb-2">
                  Street 1 <span className=' text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  id="resStreet1"
                  name="resStreet1"
                  value={formData.resStreet1}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  placeholder="Street 1"
                />
                {errors.resStreet1 && <p className="text-red-500">{errors.resStreet1}</p>}
              </div>
              <div>
                <label htmlFor="resStreet2" className="block text-gray-800 mb-2">
                  Street 2 <span className=' text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  id="resStreet2"
                  name="resStreet2"
                  value={formData.resStreet2}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  placeholder="Street 2"
                />
                {errors.resStreet2 && <p className="text-red-500">{errors.resStreet2}</p>}
              </div>
            </div>
          </div>

          <div>
            <input
              type="checkbox"
              id="sameAsResidential"
              name="sameAsResidential"
              checked={formData.sameAsResidential}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="sameAsResidential" className="text-gray-800">
              Same as Residential Address
            </label>
          </div>

          <div>
            <p className="text-lg font-bold text-gray-800 mb-2">Permanent Address</p>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                id="permStreet1"
                name="permStreet1"
                value={formData.permStreet1}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Street 1"
                disabled={formData.sameAsResidential}
              />
              <input
                type="text"
                id="permStreet2"
                name="permStreet2"
                value={formData.permStreet2}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Street 2"
                disabled={formData.sameAsResidential}
              />
            </div>
          </div>

          <div>
            <label htmlFor="document" className="block text-gray-800 font-bold mb-2">
              Upload Document
            </label>
            {files.map((file, index) => (
  <div className="grid grid-cols-3 gap-10" key={index}>
    <div>
      <label htmlFor={`filename${index}`} className="block text-gray-800 mb-2">
        File Name <span className='text-red-500'>*</span>
      </label>
      <input
        type="text"
        id={`filename${index}`}
        name="filename"
        value={file.filename}
        onChange={(e) => handleFileChange(index, e)}
        className="w-full border border-gray-300 p-2 rounded-lg"
      />
      {errors[`file${index}`] && <p className="text-red-500">{errors[`file${index}`]}</p>}
    </div>
    <div>
      <label htmlFor={`filetype${index}`} className="block text-gray-800 mb-2">
        File Type <span className='text-red-500'>*</span>
      </label>
      <select
        name="filetype"
        id={`filetype${index}`}
        value={file.filetype}
        onChange={(e) => handleFileChange(index, e)}
        className="w-full h-11 border border-solid border-blue-500 px-3 rounded-md"
      >
        <option value="pdf">PDF</option>
        <option value="img">Image</option>
      </select>
    </div>
    <div className="flex items-end gap-2 justify-start">
      <div>
        <label htmlFor={`document${index}`} className="block text-gray-800 mb-2">
          Upload Document <span className='text-red-500'>*</span>
        </label>
        <input
          type="file"
          id={`document${index}`}
          name="document"
          onChange={(e) => handleFileChange(index, e)}
          className="w-full border border-gray-300 p-2 rounded-lg"
        />
      </div>
      {index === 0 ? (
        <div
          className="bg-black text-white p-3 max-h-12 px-4 rounded-md flex justify-center items-center cursor-pointer"
          onClick={addFileInput}
        >
          +
        </div>
      ) : (
        <div
          className="bg-black text-white p-3 max-h-12 px-4 rounded-md flex justify-center items-center cursor-pointer"
          onClick={() => removeFileInput(index)}
        >
          -
        </div>
      )}
    </div>
  </div>
))}

            {errors.files && <p className="text-red-500">{errors.files}</p>}
          </div>

          <div>
            <button type="submit" className="w-full rounded-3xl bg-black px-6 py-2 text-xl font-medium text-white">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyForm;
