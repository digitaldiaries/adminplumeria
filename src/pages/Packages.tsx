import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Edit, Trash2, Eye, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PackageType {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  max_guests: number;
  image: string;
  includes: string[];
  active: boolean;
}

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: '',
    duration: '',
    guests: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    setPackages([
      {
        id: 1,
        name: 'Honeymoon Package',
        description: 'Perfect for newlyweds, includes romantic dinner and spa treatment',
        price: 25000,
        duration: 3,
        max_guests: 2,
        image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg',
        includes: ['Luxury Room', 'Romantic Dinner', 'Couples Spa', 'Lake View'],
        active: true
      },
      {
        id: 2,
        name: 'Family Getaway',
        description: 'Fun for the whole family with activities for all ages',
        price: 35000,
        duration: 4,
        max_guests: 4,
        image: 'https://images.pexels.com/photos/1449729/pexels-photo-1449729.jpeg',
        includes: ['Family Suite', 'Adventure Activities', 'Kids Club', 'All Meals'],
        active: true
      }
    ]);
    setLoading(false);
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your resort's holiday packages</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/packages/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Package
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
            placeholder="Search packages..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select 
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Any Price</option>
                <option value="budget">Budget (Below ₹20,000)</option>
                <option value="mid">Mid-range (₹20,000-₹50,000)</option>
                <option value="luxury">Luxury (Above ₹50,000)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select 
                value={filters.duration}
                onChange={(e) => setFilters({...filters, duration: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Any Duration</option>
                <option value="short">Short (1-2 days)</option>
                <option value="medium">Medium (3-5 days)</option>
                <option value="long">Long (6+ days)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <select 
                value={filters.guests}
                onChange={(e) => setFilters({...filters, guests: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Any Size</option>
                <option value="couple">Couple (2 guests)</option>
                <option value="family">Family (3-4 guests)</option>
                <option value="group">Group (5+ guests)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setFilters({ priceRange: '', duration: '', guests: '' })}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg';
                }}
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pkg.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {pkg.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <Package className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">{pkg.name}</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{pkg.description}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{pkg.duration} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Max Guests:</span>
                  <span className="font-medium">{pkg.max_guests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Price:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatPrice(pkg.price)}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Includes:</h4>
                <div className="flex flex-wrap gap-2">
                  {pkg.includes.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/packages/${pkg.id}`}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(pkg.id)}
                  className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
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

      {/* Empty State */}
      {filteredPackages.length === 0 && (
        <div className="text-center py-10">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No packages found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.values(filters).some(Boolean)
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first package.'}
          </p>
          {!searchTerm && !Object.values(filters).some(Boolean) && (
            <div className="mt-6">
              <Link
                to="/packages/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Packages;