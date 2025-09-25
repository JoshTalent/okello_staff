// src/pages/Dashboard.jsx
import React from "react";
import DashboardWrapper from "../components/dashboardlayout";
import { Users, CalendarDays, Mail, Image } from "lucide-react";

const stats = [
  { id: 1, title: "Total Bookings", value: "128", icon: CalendarDays, color: "bg-blue-500" },
  { id: 2, title: "New Messages", value: "23", icon: Mail, color: "bg-green-500" },
  { id: 3, title: "Gallery Items", value: "54", icon: Image, color: "bg-purple-500" },
  { id: 4, title: "Registered Users", value: "312", icon: Users, color: "bg-orange-500" },
];

const Dashboard = () => {
  return (
    <DashboardWrapper>
      <div className="p-6 flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">Admin</span>
          </h1>
          <p className="text-gray-500 mt-1">Here’s a quick snapshot of your platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 hover:shadow-xl transition"
            >
              <div className={`p-3 rounded-xl text-white ${stat.color}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="divide-y divide-gray-100">
            <li className="py-3 flex justify-between items-center">
              <p className="text-gray-700">New booking from <span className="font-medium">John Doe</span></p>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">2h ago</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <p className="text-gray-700">Message received from <span className="font-medium">Jane Smith</span></p>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">5h ago</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <p className="text-gray-700">Gallery updated by <span className="font-medium">Admin</span></p>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">1d ago</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default Dashboard;
