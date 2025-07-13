import { supabase } from '../lib/supabase';
import Image from 'next/image';

export default async function Students() {
  const { data: students, error } = await supabase.from('students').select('*');

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <p className="text-red-500">Error fetching data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Registered Students
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 duration-300"
          >
            {student.pic_url && (
              <Image
                src={student.pic_url}
                alt={student.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
            <p className="text-gray-600"><strong>Course:</strong> {student.course_name}</p>
            <p className="text-gray-600"><strong>Mobile:</strong> {student.mobile_number}</p>
            <p className="text-gray-600"><strong>Email:</strong> {student.email}</p>
            <p className="text-gray-600"><strong>Gender:</strong> {student.gender}</p>
            <p className="text-gray-600"><strong>Qualification:</strong> {student.qualification}</p>
          </div>
        ))}
      </div>
    </div>
  );
}