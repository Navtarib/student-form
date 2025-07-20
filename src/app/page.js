'use client';

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    course_name: '',
    mobile_number: '',
    email: '',
    gender: '',
    qualification: '',
    time_slot: '',
    class_days: '',
    user_id: '',
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const courses = [
    {
      category: 'Web Development',
      options: [
        // { value: 'AI Frontend Development', label: 'AI Frontend Development (2 months)' },
        // { value: 'AI Backend Development', label: 'AI Backend Development (2 months)' },
        // { value: 'UI/UX Design', label: 'UI/UX Design (2 months)' },
        // { value: 'Intro to Programming', label: 'Intro to Programming (2 months)' },
        { value: 'Full-Stack Web Development', label: 'Full-Stack Web Development (6 months)' },
        { value: 'Gen AI', label: 'Gen AI (2 months)' },
        { value: 'MS Office', label: 'MS Office (2 months)' },
        { value: 'Graphic Design', label: 'Graphic Design (4 months)' },
      ],
    },
    {
      category: 'English Language',
      options: [
        { value: 'Basic English', label: 'Basic English (2 months)' },
        // { value: 'Advanced English', label: 'Advanced English (2 months)' },
        { value: 'Business English', label: 'Business English (2 months)' },
      ],
    },
  ];

  const timeSlots = [
    // '3:00 PM - 4:00 PM',
    // '4:00 PM - 5:00 PM',
    // '5:00 PM - 6:00 PM',
    // '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM',
    '9:00 PM - 10:00 PM',
  ];

  const classDays = [
    'Mon-Wed-Fri',
    'Tue-Thu-Sat',
  ];

  useEffect(() => {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    setFormData((prev) => ({ ...prev, user_id: userId }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.course_name) newErrors.course_name = 'Please select a course';
    if (!formData.mobile_number || !/^\d{11}$/.test(formData.mobile_number))
      newErrors.mobile_number = 'Enter a valid 11-digit mobile number';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Enter a valid email';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    if (!formData.time_slot) newErrors.time_slot = 'Please select a time slot';
    if (!formData.class_days) newErrors.class_days = 'Please select class days';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1048576) {
        setErrors({ ...errors, file: 'Image size must be less than 1MB' });
        toast.error('Image size must be less than 1MB', { position: 'top-right', autoClose: 3000 });
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setErrors({ ...errors, file: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill all required fields correctly', { position: 'top-right', autoClose: 3000 });
      return;
    }

    let picUrl = '';
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('student-pics')
        .upload(fileName, file);

      if (error) {
        toast.error('Error uploading image: ' + error.message, { position: 'top-right', autoClose: 3000 });
        return;
      }
      picUrl = supabase.storage.from('student-pics').getPublicUrl(fileName).data.publicUrl;
    }

    const { error } = await supabase.from('students').insert({
      ...formData,
      pic_url: picUrl,
    });

    if (error) {
      toast.error('Error saving data: ' + error.message, { position: 'top-right', autoClose: 3000 });
    } else {
      toast.success('Student registered successfully!', {
        position: 'top-right',
        autoClose: 3000,
        onClose: () => router.push('/students'),
      });
      setFormData({
        name: '',
        course_name: '',
        mobile_number: '',
        email: '',
        gender: '',
        qualification: '',
        time_slot: '',
        class_days: '',
        user_id: formData.user_id,
      });
      setFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <style jsx>{`
        @media print {
          .bg-teal-500 {
            background-color: #14b8a6 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      `}</style>
      <div className="bg-white border rounded-2xl shadow-lg p-8 max_OVERFLOW_ max-w-3xl mx-auto">
        <div className="flex justify-center mb-8">
          <h1 className="font-extrabold text-yellow-500 text-4xl">NavTech</h1>
        </div>
        <div className="flex justify-center border rounded-xl mx-auto py-1 bg-gray-100 mb-8 max-w-sm">
          <h2 className="font-extrabold text-teal-500 text-sm">Learning Never Stops!</h2>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Student Registration
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-800 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="course_name" className="block text-gray-800 text-sm font-medium mb-2">
                Course
              </label>
              <select
                id="course_name"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
              >
                <option value="" className="text-gray-400">Select a Course</option>
                {courses.map((category) => (
                  <optgroup key={category.category} label={category.category} className="text-gray-800">
                    {category.options.map((course) => (
                      <option key={course.value} value={course.value} className="text-gray-800">
                        {course.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.course_name && (
                <p className="text-red-400 text-xs mt-1">{errors.course_name}</p>
              )}
            </div>
            <div>
              <label htmlFor="mobile_number" className="block text-gray-800 text-sm font-medium mb-2">
                Mobile Number
              </label>
              <input
                id="mobile_number"
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
              />
              {errors.mobile_number && (
                <p className="text-red-400 text-xs mt-1">{errors.mobile_number}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-800 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="qualification" className="block text-gray-800 text-sm font-medium mb-2">
                Qualification
              </label>
              <input
                id="qualification"
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Enter qualification"
                className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
              />
              {errors.qualification && (
                <p className="text-red-400 text-xs mt-1">{errors.qualification}</p>
              )}
            </div>
            <div>
              <label htmlFor="time_slot" className="block text-gray-800 text-sm font-medium mb-2">
                Time Slot
              </label>
              <select
                id="time_slot"
                name="time_slot"
                value={formData.time_slot}
                onChange={handleChange}
                className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
              >
                <option value="" className="text-gray-400">Select a Time Slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot} className="text-gray-800">
                    {slot}
                  </option>
                ))}
              </select>
              {errors.time_slot && (
                <p className="text-red-400 text-xs mt-1">{errors.time_slot}</p>
              )}
            </div>
            <div>
              <label htmlFor="class_days" className="block text-gray-800 text-sm font-medium mb-2">
                Class Days
              </label>
              <select
                id="class_days"
                name="class_days"
                value={formData.class_days}
                onChange={handleChange}
                className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
              >
                <option value="" className="text-gray-400">Select Class Days</option>
                {classDays.map((days) => (
                  <option key={days} value={days} className="text-gray-800">
                    {days}
                  </option>
                ))}
              </select>
              {errors.class_days && (
                <p className="text-red-400 text-xs mt-1">{errors.class_days}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-800 text-sm font-medium mb-2">Gender</label>
            <div className="flex space-x-6">
              {['Male', 'Female'].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={handleChange}
                    className="text-teal-500 focus:ring-teal-500 h-4 w-4"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
          </div>
          <div>
            <label htmlFor="file" className="block text-gray-800 text-sm font-medium mb-2">
              Profile Picture
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-500 file:text-white file:hover:bg-teal-600 transition duration-200"
            />
            {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file}</p>}
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-yellow-500"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 shadow-md"
          >
            Register Student
          </button>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
}