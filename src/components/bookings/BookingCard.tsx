import { Booking } from './types';

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md py-4 pr-6 pl-4 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center space-x-6">
        <div className="flex-shrink-0">
          <img
            src={booking.profileImage ? booking.profileImage : "/placeholder.png"}
            alt="profile image"
            className="w-20 h-20 rounded-lg object-cover"
            width={100}
            height={100}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#171616] truncate mb-1">
            {booking.name}
          </p>
          <p className="text-gray-500 text-sm mb-1">
            {booking.email}
          </p>
          <p className="text-gray-500 text-sm">
            {booking.time}
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EC1D13]">
            {booking.type === 'video' ? (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 