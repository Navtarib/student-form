"use client"
import { useEffect, useState } from 'react'
import supabase from './lib/supabase'

export default function Students() {
  const [students, setStudents] = useState([])

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await supabase.from('students').select('*')
      setStudents(data)
    }
    fetchStudents()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {students.map((s) => (
        <div key={s.id} className="border p-4 rounded shadow">
          <img src={s.image_url} alt={s.name} className="w-full h-40 object-cover" />
          <h2>{s.name}</h2>
          <p><strong>Course:</strong> {s.course}</p>
          <p><strong>Email:</strong> {s.email}</p>
          <p><strong>Phone:</strong> {s.phone}</p>
          <p><strong>Gender:</strong> {s.gender}</p>
          <p><strong>Qualification:</strong> {s.qualification}</p>
        </div>
      ))}
    </div>
  )
}
