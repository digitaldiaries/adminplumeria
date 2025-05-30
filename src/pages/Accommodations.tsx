import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Filter, Edit, Trash2, Eye, XCircle, Loader } from 'lucide-react';

const Accommodations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    capacity: '',
    availability: ''
  });

  const API_BASE_URL = 'https://plumeriaadminback-production.up.railway.app/admin';

  // Fetch accommodations from backend
  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/accommodations`);
      if (!response.ok) {
        throw new Error('Failed to fetch accommodations');
      }
      const data = await response.json();
      setAccommodations(data);
      setError('');
    } catch (err) {
      setError('Failed to load accommodations. Please try again.');
      console.error('Error fetching accommodations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete accommodation
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this accommodation?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/accommodations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete accommodation');
      }
      
      // Remove from local state
      setAccommodations(accommodations.filter((acc: any) => acc.id !== id));
    } catch (err) {
      console.error('Error deleting accommodation:', err);
      alert('Failed to delete accommodation. Please try again.');
    }
  };

  // Toggle availability
  const toggleAvailability = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/accommodations/${id}/toggle-availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: !currentStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update availability');
      }
      
      // Update local state
      setAccommodations(accommodations.map((acc: any) => 
        acc.id === id ? { ...acc, available: !currentStatus } : acc
      ));
    } catch (err) {
      console.error('Error updating availability:', err);
      alert('Failed to update availability. Please try again.');
    }
  };

  // Apply filters
  const applyFilters = () => {
    // This would typically trigger a new API call with filter parameters
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      capacity: '',
      availability: ''
    });
  };

  // Filter accommodations based on search and filters
 const filteredAccommodations = accommodations.filter((accommodation: any) => {
  const title = accommodation.title || '';
  const description = accommodation.description || '';
  const matchesSearch =
    title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    description.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesSearch;
});

  // Format price for display
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading accommodations...</span>
      </div>
    );
  }

  if (error) {
    return (
  <div className="space-y-6 pb-16 md:pb-0">
    <div className="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Accommodations</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your resort's accommodations</p>
      </div>
      <div className="mt-4 sm:mt-0">
        <button
          onClick={() => window.location.href = '/accommodations/new'}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Accommodation
        </button>
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
              <select 
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
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
              <select 
                value={filters.capacity}
                onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Any Capacity</option>
                <option value="1-2">1-2 People</option>
                <option value="3-4">3-4 People</option>
                <option value="5+">5+ People</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select 
                value={filters.availability}
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply
            </button>
          </div>
        </div>
    )}

    {/* Error Message */}
    {error && (
      <div className="border-2 border-red-400 bg-red-50 text-red-700 px-4 py-6 rounded-md text-center font-medium">
        {error}
      </div>
    )}

    {/* Loading State */}
    {loading && (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading accommodations...</span>
      </div>
    )}

    {/* Accommodations Grid */}
    {!loading && !error && (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAccommodations.map((accommodation: any) => (
          <div className="relative h-48">
              <img
                src={accommodation.image_url || 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'}
                alt={accommodation.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg';
                }}
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                    accommodation.available
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                  onClick={() => toggleAvailability(accommodation.id, accommodation.available)}
                >
                  {accommodation.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
        ))}
      </div>
    )}

    {/* No Accommodations */}
    {!loading && !error && filteredAccommodations.length === 0 && (
      <div className="text-center py-10">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No accommodations found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    )}
  </div>
);
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accommodations</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your resort's accommodations</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => window.location.href = '/accommodations/new'}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Accommodation
          </button>
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
              <select 
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
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
              <select 
                value={filters.capacity}
                onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Any Capacity</option>
                <option value="1-2">1-2 People</option>
                <option value="3-4">3-4 People</option>
                <option value="5+">5+ People</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select 
                value={filters.availability}
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Accommodations Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAccommodations.map((accommodation: any) => (
          <div key={accommodation.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img
                src={accommodation.image_url || 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'}
                alt={accommodation.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg';
                }}
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                    accommodation.available
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                  onClick={() => toggleAvailability(accommodation.id, accommodation.available)}
                >
                  {accommodation.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">{accommodation.title}</h3>
              </div>
              {accommodation.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{accommodation.description}</p>
              )}
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <div>Rooms: {accommodation.available_rooms}</div>
                {accommodation.amenities && (
                  <div>Amenities: {accommodation.amenities.length}</div>
                )}
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {formatPrice(accommodation.price)}/night
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => window.location.href = `/accommodations/${accommodation.id}`}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(accommodation.id)}
                  className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => window.location.href = `/accommodations/${accommodation.id}/view`}
                  className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAccommodations.length === 0 && !loading && (
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