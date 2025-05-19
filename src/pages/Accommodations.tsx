import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Search, Filter, Edit, Trash2, Eye, XCircle } from 'lucide-react';

const Accommodations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const accommodations = [
    {
      id: 1,
      name: 'Lake View Villa',
      image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
      type: 'Villa',
      capacity: '2-4',
      pricePerDay: '₹12,500',
      available: true,
    },
    {
      id: 2,
      name: 'Garden Suite',
      image: 'https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg',
      type: 'Suite',
      capacity: '2',
      pricePerDay: '₹8,500',
      available: true,
    },
    {
      id: 3,
      name: 'Mountain View Cottage',
      image: 'https://images.pexels.com/photos/2416472/pexels-photo-2416472.jpeg',
      type: 'Cottage',
      capacity: '2-3',
      pricePerDay: '₹9,500',
      available: true,
    },
    {
      id: 4,
      name: 'Family Bungalow',
      image: 'https://images.pexels.com/photos/1438834/pexels-photo-1438834.jpeg',
      type: 'Bungalow',
      capacity: '4-6',
      pricePerDay: '₹15,000',
      available: false,
    },
    {
      id: 5,
      name: 'Luxury Tent',
      image: 'https://images.pexels.com/photos/2387069/pexels-photo-2387069.jpeg',
      type: 'Glamping',
      capacity: '2',
      pricePerDay: '₹11,000',
      available: true,
    },
  ];

  const filteredAccommodations = accommodations.filter(accommodation =>
    accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accommodation.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accommodations</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your resort's accommodations</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/accommodations/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Accommodation
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search accommodations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFilterOpen(!filterOpen)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white p-4 rounded-md shadow space-y-4">
          <h3 className="font-medium text-gray-700">Filter Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">All Types</option>
                <option value="villa">Villa</option>
                <option value="suite">Suite</option>
                <option value="cottage">Cottage</option>
                <option value="bungalow">Bungalow</option>
                <option value="glamping">Glamping</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">Any Capacity</option>
                <option value="1-2">1-2 People</option>
                <option value="3-4">3-4 People</option>
                <option value="5+">5+ People</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Accommodations Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAccommodations.map((accommodation) => (
          <div key={accommodation.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img
                src={accommodation.image}
                alt={accommodation.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    accommodation.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {accommodation.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">{accommodation.name}</h3>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <div>Type: {accommodation.type}</div>
                <div>Capacity: {accommodation.capacity}</div>
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {accommodation.pricePerDay}/night
              </div>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/accommodations/${accommodation.id}`}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                <button className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAccommodations.length === 0 && (
        <div className="text-center py-10">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No accommodations found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Accommodations;