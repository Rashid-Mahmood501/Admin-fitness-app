"use client";

import BookingCard from "@/components/bookings/BookingCard";
import { Booking } from "@/components/bookings/types";
import Loader from "@/components/Loader";
import { fetchWrapper } from "@/utils/fetchwraper";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function BookingsPage() {
  const [value, setValue] = useState<Value>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDateChange = (newValue: Value) => {
    setValue(newValue);
    if (newValue instanceof Date) {
      console.log("Selected date:", format(newValue, "yyyy-MM-dd"));
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetchWrapper("/admin/meeting/all");      
      setBookings(
        response.data.map((item: any) => ({
          id: item._id,
          name: item.userId?.fullname || "Unknown",
          time: item.time,
          email: item.userId?.email || "Unknown",
          type: item.location === "Zoom" ? "video" : "in-person",
          profileImage: item.userId?.profileImage || "/placeholder.png",
          _rawDate: item.date,
        }))
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = bookings.filter((booking: Booking) => {
    const bookingDate = new Date(booking._rawDate);
    return (
      bookingDate.toISOString().slice(0, 10) ===
      (value instanceof Date
        ? value.toISOString().slice(0, 10)
        : (value as [ValuePiece, ValuePiece])[0]?.toISOString().slice(0, 10))
    );
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const meetingDates = new Set(
    (bookings || [])
      .map((b: any) => b._rawDate)
      .filter(Boolean)
      .map((date: string) => new Date(date).toISOString().slice(0, 10))
  );

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
            tileContent={({ date, view }) => {
              if (view === "month") {
                const dateString = date.toISOString().slice(0, 10);
                if (meetingDates.has(dateString)) {
                  return (
                    <span
                      style={{
                        display: "block",
                        margin: "0 auto",
                        marginTop: 2,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#EC1D13",
                      }}
                    />
                  );
                }
              }
              return null;
            }}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#171616] mb-6 border-b-2 border-[#EC1D13] pb-2">
            Schedule Meetings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="flex justify-center items-center py-4 col-span-full">
                <Loader />
              </div>
            ) : filterBookings.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No bookings found for this date
              </div>
            ) : (
              filterBookings.map((booking: Booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
