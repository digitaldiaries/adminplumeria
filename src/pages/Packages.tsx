import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Search, Filter, Edit, Trash2, Eye, XCircle, RefreshCw, AlertCircle, CheckCircle, BarChart3, Users, Calendar, IndianRupee, Save, X } from 'lucide-react';

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
  created_at?: string;
  updated_at?: string;
}

interface PackageStats {
  total: number;
  active: number;
  inactive: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

const API_BASE_URL = 'https://plumeriaadminback-production.up.railway.app/admin';

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [stats, setStats] = useState<PackageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    max_guests: '',
    image: '',
    includes: [''],
    active: true
  });
  const [filters, setFilters] = useState({
    priceRange: '',
    duration: '',
    guests: '',
    active: ''
  });
  const [refreshing, setRefreshing] = useState(false);

  // API functions
  const fetchPackages = useCallback(async () => {
    try {
      setError('');
      const queryParams = new URLSearchParams();
      
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filters.priceRange) queryParams.append('priceRange', filters.priceRange);
      if (filters.duration) queryParams.append('duration', filters.duration);
      if (filters.guests) queryParams.append('guests', filters.guests);
      if (filters.active) queryParams.append('active', filters.active);

      const response = await fetch(`${API_BASE_URL}/packages?${queryParams}`);
      const data: ApiResponse<PackageType[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch packages');
      }

      if (data.success) {
        setPackages(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch packages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch packages');
      console.error('Error fetching packages:', err);
    }
  }, [searchTerm, filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages/stats/summary`);
      const data: ApiResponse<PackageStats> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stats');
      }

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const savePackage = async () => {
    try {
      setError('');
      const url = editingPackage 
        ? `${API_BASE_URL}/packages/${editingPackage.id}`
        : `${API_BASE_URL}/packages`;
      
      const method = editingPackage ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        max_guests: parseInt(formData.max_guests),
        includes: formData.includes.filter(item => item.trim() !== '')
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse<any> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save package');
      }

      if (data.success) {
        setSuccessMessage(editingPackage ? 'Package updated successfully' : 'Package created successfully');
        setShowForm(false);
        setEditingPackage(null);
        resetForm();
        fetchPackages();
        fetchStats();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(data.message || 'Failed to save package');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save package');
    }
  };

  const deletePackage = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
        method: 'DELETE',
      });

      const data: ApiResponse<any> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete package');
      }

      if (data.success) {
        setSuccessMessage('Package deleted successfully');
        fetchPackages();
        fetchStats();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(data.message || 'Failed to delete package');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete package');
      console.error('Error deleting package:', err);
    }
  };

  const togglePackageStatus = async (id: number, name: string, currentStatus: boolean) => {
    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/packages/${id}/toggle`, {
        method: 'PATCH',
      });

      const data: ApiResponse<{ active: boolean }> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update package status');
      }

      if (data.success) {
        setSuccessMessage(`Package "${name}" ${data.data.active ? 'activated' : 'deactivated'} successfully`);
        fetchPackages();
        fetchStats();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(data.message || 'Failed to update package status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update package status');
      console.error('Error toggling package status:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchPackages(), fetchStats()]);
    setRefreshing(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      max_guests: '',
      image: '',
      includes: [''],
      active: true
    });
  };

  const openAddForm = () => {
    resetForm();
    setEditingPackage(null);
    setShowForm(true);
  };

  const openEditForm = (pkg: PackageType) => {
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration.toString(),
      max_guests: pkg.max_guests.toString(),
      image: pkg.image,
      includes: pkg.includes.length > 0 ? pkg.includes : [''],
      active: pkg.active
    });
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const addIncludeItem = () => {
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, '']
    }));
  };

  const removeIncludeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const updateIncludeItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => i === index ? value : item)
    }));
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPackages(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, [fetchPackages, fetchStats]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const clearFilters = () => {
    setFilters({ priceRange: '', duration: '', guests: '', active: '' });
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || Object.values(filters).some(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading packages...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your resort's holiday packages</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={openAddForm}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Packages</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Inactive</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.inactive}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Price</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatPrice(stats.avgPrice)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-400 hover:text-green-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

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
          className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            hasActiveFilters 
              ? 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100' 
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter {hasActiveFilters && '(Active)'}
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white p-4 rounded-md shadow border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <select
                id="priceRange"
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Prices</option>
                <option value="budget">Budget (&lt; ₹20,000)</option>
                <option value="mid">Mid-range (₹20,000 - ₹50,000)</option>
                <option value="luxury">Luxury (&gt; ₹50,000)</option>
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <select
                id="duration"
                value={filters.duration}
                onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Durations</option>
                <option value="short">Short (1-2 days)</option>
                <option value="medium">Medium (3-5 days)</option>
                <option value="long">Long (6+ days)</option>
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                Max Guests
              </label>
              <select
                id="guests"
                value={filters.guests}
                onChange={(e) => setFilters(prev => ({ ...prev, guests: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Guest Counts</option>
                <option value="couple">Couple (2 guests)</option>
                <option value="family">Family (3-4 guests)</option>
                <option value="group">Group (5+ guests)</option>
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label htmlFor="active" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="active"
                value={filters.active}
                onChange={(e) => setFilters(prev => ({ ...prev, active: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="aspect-w-16 aspect-h-9">
              <img 
                className="w-full h-48 object-cover" 
                src={pkg.image || '/api/placeholder/400/200'} 
                alt={pkg.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/api/placeholder/400/200';
                }}
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900 truncate">{pkg.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pkg.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pkg.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{pkg.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  <span className="font-medium text-gray-900">{formatPrice(pkg.price)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{pkg.duration} days</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{pkg.max_guests} guests</span>
                </div>
              </div>

              {pkg.includes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {pkg.includes.slice(0, 3).map((item, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {item}
                      </span>
                    ))}
                    {pkg.includes.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{pkg.includes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => openEditForm(pkg)}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => togglePackageStatus(pkg.id, pkg.name, pkg.active)}
                  className={`flex-1 inline-flex justify-center items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    pkg.active
                      ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500'
                      : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500'
                  }`}
                >
                  {pkg.active ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={() => deletePackage(pkg.id, pkg.name)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No packages found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {hasActiveFilters ? 'Try adjusting your search or filters.' : 'Get started by creating a new package.'}
          </p>
          {!hasActiveFilters && (
            <div className="mt-6">
              <button
                onClick={openAddForm}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Package Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPackage(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); savePackage(); }} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (days) *
                  </label>
                  <input
                    type="number"
                    id="duration"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="max_guests" className="block text-sm font-medium text-gray-700">
                    Max Guests *
                  </label>
                  <input
                    type="number"
                    id="max_guests"
                    required
                    min="1"
                    value={formData.max_guests}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_guests: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Includes
                </label>
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateIncludeItem(index, e.target.value)}
                      placeholder="e.g., Free breakfast, WiFi, etc."
                      className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {formData.includes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIncludeItem(index)}
                        className="inline-flex items-center px-2 py-2 border border-red-300 rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIncludeItem}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>

              <div className="flex items-center">
                <input
                  id="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active (available for booking)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPackage(null);
                    resetForm();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;