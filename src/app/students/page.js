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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-4xl font-bold text-center text-black mb-10">
          Student ID Card
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[...Array(1)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-lg animate-pulse flex flex-col"
            >
              <div className="w-16 h-6 bg-gray-300 rounded mb-4 mx-auto"></div>
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
            </div>
          ))}
          {[...Array(1)].map((_, index) => (
            <div
              key={index + 1}
              className="bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-lg animate-pulse flex flex-col"
            >
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
      <style jsx>{`
        @media print {
          .bg-teal-500 {
            background-color: #14b8a6 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      `}</style>
      <div className="flex justify-center items-center max-w-6xl mx-auto mb-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Student ID Card
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto">
        {students.map((student) => (
          <div key={student.id} className="sm:flex-row flex flex-col gap-4 mx-auto">
            <div className="bg-white border w-[250px] h-auto rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-teal-500 h-4 w-full rounded-t-2xl"></div>
              <div className="p-4 text-center">
                <div className="flex justify-center mb-3">
                  <h1 className="font-extrabold text-yellow-500 text-3xl">NavTech</h1>
                </div>
                <div className="flex justify-center border rounded-xl mx-5 py-1 bg-gray-100 mb-3">
                  <h1 className="font-extrabold text-teal-500 text-sm">Learning Never Stops!</h1>
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
            <div className="bg-white border text-sm relative w-[250px] h-auto rounded-2xl shadow-lg overflow-hidden">
              {/* <div className="absolute top-40 left-2 text-gray-100 text-6xl">NavTech</div> */}
              <div className="bg-teal-500 h-4 w-full rounded-t-2xl"></div>
              <div className="p-4">
                <p className="text-gray-800"><strong>Name:</strong>  {student.name}</p>
                <p className="text-gray-600"><strong>Gender:</strong> {student.gender}</p>
                <p className="text-gray-600"><strong>Mobile:</strong> {student.mobile_number}</p>
                <p className="text-gray-600"><strong>Email:</strong> {student.email}</p>
              </div>
              <div className="text-center relative text-black h-54 mt-1 mx-4 flex flex-col">
                <p className='text-[10px]'><strong>Note:</strong> This card is for <strong>NavTech</strong> premises only. <br /> If found please return to <strong>NavTech</strong></p>
                <p className='border-b border-black border-1 absolute bottom-13 sm:bottom-5 left-7 sm:left-9 w-40'></p>
                <p className='bottom-7 sm:-bottom-1 absolute left-0 right-0'>Issuing authority</p>
              </div>
              <div className="bg-teal-500 h-4 absolute bottom-0 w-full rounded-b-2xl"></div>
            </div>
          </div>
        ))}
        <button
          onClick={handlePrint}
          className="bg-teal-500 mx-auto text-white w-44 px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
        >
          Download Card
        </button>
      </div>
    </div>
  );
}