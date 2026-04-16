import React from 'react'
import Navbar from '../components/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05070f] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="mt-2 text-zinc-400">
          Welcome back.
        </p>
      </main>
    </div>
  )
}
