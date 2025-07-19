'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Image from 'next/image';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('No user ID found. Please register a student first.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        setError('Error fetching data: ' + error.message);
      } else {
        setStudents(data);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-8">
        <h1 className="text-4xl font-bold text-center text-white mb-10">
          Registered Students
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[...Array(1)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-lg animate-pulse flex flex-col"
            >
              <div className="w-16 h-6 bg-gray-700 rounded mb-4 mx-auto"></div>
              <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-1"></div>
            </div>
          ))}
          {[...Array(1)].map((_, index) => (
            <div
              key={index + 1}
              className="bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-lg animate-pulse flex flex-col"
            >
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <p className="text-gray-300">No students registered for this user.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Registered Students
      </h1>
      <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto">
        {students.map((student) => (
          <div key={student.id} className="flex">
            <div className="bg-white border w-[280px] h-auto rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-teal-500 h-4 w-full rounded-t-2xl"></div>
              <div className="p-4 text-center">
                <div className="flex justify-center mb-3">
                  <h1 className="font-extrabold text-yellow-500 text-2xl">NavTech</h1>
                </div>
                  <div className="flex justify-center border rounded-xl py-1 bg-gray-200 mb-3">
                  <h1 className="font-extrabold text-teal-500 text-md">Learning Never Stops</h1>
                </div>
                <div className="flex justify-center mb-4">
                  <Image
                    src={student.pic_url || '/default-avatar.png'}
                    alt={student.name}
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-yellow-500"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{student.name}</h2>
                <p className="text-gray-600">{student.course_name}</p>
                <p className="text-gray-600">{student.time_slot || 'Not assigned'}</p>
              </div>
              <div className="bg-teal-500 h-4 w-full rounded-b-2xl"></div>
            </div>
            <div className="bg-white border relative w-[280px] h-auto rounded-2xl shadow-lg ml-4 overflow-hidden">
              <div className="bg-teal-500 h-4 w-full rounded-t-2xl"></div>
              <div className="p-4 text-center">
                <p className="text-yellow-500 font-semibold">For More</p>
                <p className="text-gray-800"><strong>Name:</strong>  {student.name}</p>
                <p className="text-gray-600"><strong>Gender:</strong> {student.gender}</p>
                <p className="text-gray-600"><strong>Mobile:</strong> {student.mobile_number}</p>
                <p className="text-gray-600"><strong>Email:</strong> {student.email}</p>
              </div>
              <div className="text-center bg-amber-500 h-40 m-4 flex flex-col">
<p className='border-b border-black mx-auto w-96'></p>
              </div>
              <div className="bg-teal-500 h-4 absolute bottom-0 w-full rounded-b-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}