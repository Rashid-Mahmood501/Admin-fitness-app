"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import BookingCard from "@/components/bookings/BookingCard";
import { Booking } from "@/components/bookings/types";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const dummyBookings: Booking[] = [
  {
    id: "1",
    name: "William Jones",
    time: "09:30 AM",
    type: "in-person",
    profileImage: "/placeholder.png",
  },
  {
    id: "2",
    name: "William Jones",
    time: "10:30 AM",
    type: "video",
    profileImage: "/placeholder.png",
  },
  {
    id: "3",
    name: "William Jones",
    time: "11:30 AM",
    type: "video",
    profileImage: "/placeholder.png",
  },
  {
    id: "4",
    name: "William Jones",
    time: "01:30 PM",
    type: "in-person",
    profileImage: "/placeholder.png",
  },
  {
    id: "5",
    name: "William Jones",
    time: "02:00 PM",
    type: "in-person",
    profileImage: "/placeholder.png",
  },
  {
    id: "6",
    name: "William Jones",
    time: "03:30 PM",
    type: "in-person",
    profileImage: "/placeholder.png",
  },
];

export default function BookingsPage() {
  const [value, setValue] = useState<Value>(new Date());

  const handleDateChange = (newValue: Value) => {
    setValue(newValue);
    if (newValue instanceof Date) {
      console.log("Selected date:", format(newValue, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-[#171616] mb-8">Bookings</h1>
        <div className="mb-8">
          <Calendar
            onChange={handleDateChange}
            value={value}
            className="w-full border-0 shadow-none"
            tileClassName={({ date, view }) => {
              if (view === "month") {
                const today = new Date();
                const selectedDate = value instanceof Date ? value : null;

                if (
                  selectedDate &&
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getFullYear() === selectedDate.getFullYear()
                ) {
                  return "bg-[#EC1D13] text-white rounded-lg";
                }

                if (
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear()
                ) {
                  return "bg-gray-100 rounded-lg";
                }
              }
              return "";
            }}
            formatShortWeekday={(locale, date) => {
              const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
              return days[date.getDay()];
            }}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#171616] mb-6 border-b-2 border-[#EC1D13] pb-2">
            Schedule Meetings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dummyBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
