import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Plus, X, Save, Trash2, Loader2, MapPin, Users, Package } from 'lucide-react';

// admin base URL - adjust this to match your backend URL
const admin_BASE_URL = 'https://plumeriaadminback-production.up.railway.app';

interface Accommodation {
  id?: number;
  name: string;
  description: string;
  type: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  price: number;
  features: string[];
  images: string[];
  available: boolean;
  ownerId?: number;
  cityId?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  amenityIds?: number[];
  packageName?: string;
  packageDescription?: string;
  packageImages?: string[];
  adultPrice?: number;
  childPrice?: number;
  maxGuests?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface City {
  id: number;
  name: string;
  country: string;
}

interface Amenity {
  id: number;
  name: string;
  icon: string;
}

const AccommodationForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== undefined;

  const [formData, setFormData] = useState<Accommodation>({
    name: '',
    description: '',
    type: '',
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 0,
    price: 0,
    features: [],
    images: [],
    available: true,
    ownerId: undefined,
    cityId: undefined,
    address: '',
    latitude: undefined,
    longitude: undefined,
    amenityIds: [],
    packageName: '',
    packageDescription: '',
    packageImages: [],
    adultPrice: 0,
    childPrice: 0,
    maxGuests: 2
  });

  const [users, setUsers] = useState<User[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newPackageImageUrl, setNewPackageImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [uploading, setUploading] = useState(false);

  // Fetch accommodation data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchAccommodation(id);
    }
  }, [isEditing, id]);

  // Fetch users, cities, and amenities
  useEffect(() => {
    fetchUsers();
    fetchCities();
    fetchAmenities();
  }, []);

  const fetchAccommodation = async (accommodationId: string) => {
    setFetching(true);
    try {
      const response = await fetch(`${admin_BASE_URL}/admin/accommodations/${accommodationId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setSubmitError('Accommodation not found');
          return;
        }
        throw new Error('Failed to fetch accommodation');
      }
      
      const data = await response.json();
      setFormData({
        id: data.id,
        name: data.name || '',
        description: data.description || '',
        type: data.type || '',
        capacity: data.capacity || 2,
        bedrooms: data.bedrooms || 1,
        bathrooms: data.bathrooms || 1,
        size: data.size || 0,
        price: data.price || 0,
        features: data.features || [],
        images: data.images || [],
        available: data.available !== undefined ? data.available : true,
        ownerId: data.ownerId,
        cityId: data.cityId,
        address: data.address || '',
        latitude: data.latitude,
        longitude: data.longitude,
        amenityIds: data.amenityIds || [],
        packageName: data.packageName || '',
        packageDescription: data.packageDescription || '',
        packageImages: data.packageImages || [],
        adultPrice: data.adultPrice || 0,
        childPrice: data.childPrice || 0,
        maxGuests: data.maxGuests || 2
      });
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      setSubmitError('Failed to load accommodation data');
    } finally {
      setFetching(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${admin_BASE_URL}/admin/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${admin_BASE_URL}/admin/cities`);
      if (response.ok) {
        const data = await response.json();
        setCities(data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchAmenities = async () => {
    try {
      const response = await fetch(`${admin_BASE_URL}/admin/amenities`);
      if (response.ok) {
        const data = await response.json();
        setAmenities(data);
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === 'price' || name === 'capacity' || name === 'bedrooms' || name === 'bathrooms' || name === 'size' || name === 'latitude' || name === 'longitude' || name === 'adultPrice' || name === 'childPrice' || name === 'maxGuests') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value),
      });
    } else if (name === 'ownerId' || name === 'cityId') {
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleAmenityChange = (amenityId: number) => {
    const currentAmenities = formData.amenityIds || [];
    if (currentAmenities.includes(amenityId)) {
      setFormData({
        ...formData,
        amenityIds: currentAmenities.filter(id => id !== amenityId)
      });
    } else {
      setFormData({
        ...formData,
        amenityIds: [...currentAmenities, amenityId]
      });
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    });
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      });
      setNewImageUrl('');
    }
  };

  const removeImage = (image: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img !== image),
    });
  };

  const addPackageImage = () => {
    if (newPackageImageUrl.trim() && !formData.packageImages?.includes(newPackageImageUrl.trim())) {
      setFormData({
        ...formData,
        packageImages: [...(formData.packageImages || []), newPackageImageUrl.trim()],
      });
      setNewPackageImageUrl('');
    }
  };

  const removePackageImage = (image: string) => {
    setFormData({
      ...formData,
      packageImages: formData.packageImages?.filter((img) => img !== image) || [],
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    if (formData.bedrooms <= 0) {
      newErrors.bedrooms = 'Bedrooms must be greater than 0';
    }
    if (formData.bathrooms <= 0) {
      newErrors.bathrooms = 'Bathrooms must be greater than 0';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    
    try {
      const url = isEditing 
        ? `${admin_BASE_URL}/admin/accommodations/${id}`
        : `${admin_BASE_URL}/admin/accommodations`;
        
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save accommodation');
      }

      const savedAccommodation = await response.json();
      console.log('Accommodation saved:', savedAccommodation);
      
      // Navigate back to accommodations list
      navigate('/accommodations');
    } catch (error) {
      console.error('Error saving accommodation:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save accommodation');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
          <span className="text-lg text-gray-600">Loading accommodation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <button
              onClick={() => navigate('/accommodations')}
              className="mr-2 text-gray-400 hover:text-gray-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Property' : 'Add New Property'}
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? 'Update property details'
              : 'Create a new property for your resort'}
          </p>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{submitError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <Building2 className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Property Name *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type *
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.type ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Type</option>
                    <option value="Villa">Villa</option>
                    <option value="Suite">Suite</option>
                    <option value="Cottage">Cottage</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Glamping">Glamping</option>
                    <option value="Standard">Standard Room</option>
                    <option value="Deluxe">Deluxe Room</option>
                  </select>
                  {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
                  Select Owner
                </label>
                <div className="mt-1">
                  <select
                    id="ownerId"
                    name="ownerId"
                    value={formData.ownerId || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select Owner</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="capacity"
                    id="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.capacity ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                  Bedrooms *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="bedrooms"
                    id="bedrooms"
                    min="1"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.bedrooms ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                  Bathrooms *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="bathrooms"
                    id="bathrooms"
                    min="1"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.bathrooms ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                  Size (m²)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="size"
                    id="size"
                    min="0"
                    value={formData.size}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price per night (₹) *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="available"
                    name="available"
                    type="checkbox"
                    checked={formData.available}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                    Available for booking
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Location</h2>
            </div>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="cityId" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="mt-1">
                  <select
                    id="cityId"
                    name="cityId"
                    value={formData.cityId || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}, {city.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1">
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="latitude"
                    id="latitude"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g., 18.5204"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="longitude"
                    id="longitude"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g., 73.8567"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features & Amenities */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Features & Amenities</h2>
            
            {/* Custom Features */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700">Custom Features</h3>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature) => (
                  <div
                    key={feature}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="ml-1.5 h-4 w-4 rounded-full text-blue-400 hover:text-blue-600 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a custom feature"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md rounded-r-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center px-4 py-2 border border-transparent border-l-0 shadow-sm text-sm font-medium rounded-none rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center">
                    <input
                      id={`amenity-${amenity.id}`}
                      type="checkbox"
                      checked={formData.amenityIds?.includes(amenity.id) || false}
                      onChange={() => handleAmenityChange(amenity.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`amenity-${amenity.id}`} className="ml-2 block text-sm text-gray-700">
                      {amenity.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Package */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Package Details</h2>
            </div>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="packageName" className="block text-sm font-medium text-gray-700">
                  Package Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="packageName"
                    id="packageName"
                    value={formData.packageName}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g., Weekend Getaway Package"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">
                  No. of Guests
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="maxGuests"
                    id="maxGuests"
                    min="1"
                    value={formData.maxGuests}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="packageDescription" className="block text-sm font-medium text-gray-700">
                  Package Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="packageDescription"
                    name="packageDescription"
                    rows={3}
                    value={formData.packageDescription}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Describe what's included in this package"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="adultPrice" className="block text-sm font-medium text-gray-700">
                  Adult Price (₹)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="adultPrice"
                    id="adultPrice"
                    min="0"
                    step="0.01"
                    value={formData.adultPrice}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="childPrice" className="block text-sm font-medium text-gray-700">
                  Child Price (₹)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="childPrice"
                    id="childPrice"
                    min="0"
                    step="0.01"
                    value={formData.childPrice}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Package Images */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Package Images</label>
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newPackageImageUrl}
                      onChange={(e) => setNewPackageImageUrl(e.target.value)}
                      placeholder="Add package image URL"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={addPackageImage}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {formData.packageImages?.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Package ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePackageImage(image)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Images */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Property Images</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Add image URL"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Image Preview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            to="/accommodations"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Property' : 'Create Property'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccommodationForm;