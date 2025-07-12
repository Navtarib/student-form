"use client"

import { useState } from 'react'
import supabase from './lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    course: '',
    phone: '',
    email: '',
    gender: '',
    qualification: '',
    image: null,
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm({ ...form, [name]: files ? files[0] : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.image) {
      alert("Please upload an image")
      return
    }

    try {
      // 1. Upload image
      const file = form.image
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = fileName

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('students-pics') // ✅ Bucket name
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) {
        console.error('Upload Error:', uploadError)
        alert(`Upload Failed: ${uploadError.message}`)
        return
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/students-pics/${filePath}`

      // 2. Insert data
      const { error: insertError } = await supabase
        .from('students')
        .insert([
          {
            name: form.name,
            course: form.course,
            phone: form.phone,
            email: form.email,
            gender: form.gender,
            qualification: form.qualification,
            image_url: imageUrl,
          },
        ])

      if (insertError) {
        console.error('Insert Error:', insertError)
        alert(`Insert Failed: ${insertError.message}`)
        return
      }

      alert('Student added successfully!')
      router.push('/students')

    } catch (err) {
      console.error('Unexpected Error:', err)
      alert("Something went wrong!")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <input
        required
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full border p-2"
      />

      <select
        required
        name="course"
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="">Select Course</option>
        <option value="Web Development">Web Development</option>
        <option value="Graphic Design">Graphic Design</option>
      </select>

      <input
        required
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        required
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full border p-2"
      />

      <select
        required
        name="gender"
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
      </select>

      <input
        required
        name="qualification"
        placeholder="Qualification"
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        required
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="w-full border p-2"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  )
}
