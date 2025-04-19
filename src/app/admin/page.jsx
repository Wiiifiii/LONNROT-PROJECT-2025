'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import BackgroundWrapper from "@/app/components/BackgroundWrapper";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

// Simple card component
function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-sm text-gray-400">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState(null);
  const [books, setBooks] = useState(null);
  const [interactions, setInteractions] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/metrics/users').then(r => r.json()),
      fetch('/api/admin/metrics/books').then(r => r.json()),
      fetch('/api/admin/metrics/interactions').then(r => r.json()),
    ])
      .then(([u, b, i]) => {
        setUsers(u);
        setBooks(b);
        setInteractions(i);
      })
      .catch(console.error);
  }, []);

  if (!users || !books || !interactions) {
    return <p className="text-white p-8">Loading dashboard…</p>;
  }

  const genderData = Object.entries(users.byGender).map(([name, value]) => ({ name, value }));
  const ageData = Object.entries(users.byAge).map(([bucket, count]) => ({ bucket, count }));
  const { readsLast10Days, downloadsLast10Days } = interactions;
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <BackgroundWrapper>
      <Navbar />
      <div className="pt-20 px-4 py-8 space-y-8">
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={users.totalUsers} />
            <StatCard title="Total Books" value={books.totalBooks} />
            <StatCard title="Total Reads" value={interactions.totalReads} />
            <StatCard title="Total Downloads" value={interactions.totalDownloads} />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Gender Pie */}
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Users by Gender</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {genderData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Age Bar */}
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Users by Age Group</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bucket" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Reads Line */}
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Reads (Last 10 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={readsLast10Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Downloads Line */}
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Downloads (Last 10 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={downloadsLast10Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
