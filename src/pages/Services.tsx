import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Plus, Search, Filter, Edit, Trash2, Eye, XCircle } from 'lucide-react';

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const services = [
    {
      id: 1,
      name: 'Spa & Wellness',
      image: 'https://images.pexels.com/photos/3188/love-romantic-bath-candlelight.jpg',
      description: 'Relax and rejuvenate with our signature spa treatments.',
      price: '₹2,500',
      available: true,
    },
    {
      id: 2,
      name: 'Gourmet Dining',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
      description: 'Experience exquisite dining with our master chef.',
      price: '₹1,800',
      available: true,
    },
    {
      id: 3,
      name: 'Adventure Excursions',
      image: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg',
      description: 'Guided tours to nearby attractions and natural wonders.',
      price: '₹1,200',
      available: true,
    },
    {
      id: 4,
      name: 'Yoga Classes',
      image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg',
      description: 'Daily yoga sessions with experienced instructors.',
      price: '₹800',
      available: true,
    },
    {
      id: 5,
      name: 'Private Boat Tours',
      image: 'https://images.pexels.com/photos/2132015/pexels-photo-2132015.jpeg',
      description: 'Explore the lake with our guided private boat tours.',
      price: '₹3,500',
      available: false,
    },
    {
      id: 6,
      name: 'Cooking Classes',
      image: 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg',
      description: 'Learn local cuisine from our master chefs.',
      price: '₹1,500',
      available: true,
    },
  ];

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Extra Services</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your resort's additional services</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/services/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
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
            placeholder="Search services..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">Any Price</option>
                <option value="budget">Budget (Below ₹1,000)</option>
                <option value="mid">Mid-range (₹1,000-₹2,500)</option>
                <option value="premium">Premium (Above ₹2,500)</option>
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

      {/* Services Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {service.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <Coffee className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{service.description}</p>
              <div className="mt-2 text-lg font-semibold text-gray-900">{service.price}</div>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/services/${service.id}`}
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

      {filteredServices.length === 0 && (
        <div className="text-center py-10">
          <Coffee className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Services;