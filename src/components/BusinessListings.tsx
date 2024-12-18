import React from 'react';
import { Business } from '@/types';
import { IconStar, IconPhone, IconMapPin } from '@tabler/icons-react';

interface BusinessListingsProps {
  businesses: Business[];
}

export default function BusinessListings({ businesses }: BusinessListingsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {businesses.map((business, index) => (
        <div 
          key={index}
          className="border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">{business.title}</h3>
          
          {business.rating && (
            <div className="flex items-center mb-2">
              <IconStar className="h-5 w-5 text-yellow-400" />
              <span className="ml-1">
                {business.rating.value} ({business.rating.votes_count} reviews)
              </span>
            </div>
          )}
          
          {business.address && (
            <div className="flex items-center mb-2">
              <IconMapPin className="h-5 w-5 text-gray-400" />
              <span className="ml-1 text-gray-600">{business.address}</span>
            </div>
          )}
          
          {business.phone && (
            <div className="flex items-center">
              <IconPhone className="h-5 w-5 text-gray-400" />
              <a 
                href={`tel:${business.phone}`}
                className="ml-1 text-blue-600 hover:underline"
              >
                {business.phone}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}