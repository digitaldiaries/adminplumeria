import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Plus, X, Save, Trash2, Loader2 } from 'lucide-react';

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
    available: true
  });

  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
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
        available: data.available !== undefined ? data.available : true
      });
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      setSubmitError('Failed to load accommodation data');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === 'price' || name === 'capacity' || name === 'bedrooms' || name === 'bathrooms' || name === 'size') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value),
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

  const handleImageUpload = async (file: File | string) => {
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      
      if (typeof file === 'string') {
        // Handle URL upload
        const response = await fetch(`${admin_BASE_URL}/admin/accommodations/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: file,
            title: formData.name || 'Accommodation Image',
            alt_text: formData.name || 'Accommodation Image',
            description: formData.description || ''
          }),
        });
        
        const data = await response.json();
        if (data.imageUrl) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, data.imageUrl]
          }));
        }
      } else {
        // Handle file upload
        uploadFormData.append('image', file);
        uploadFormData.append('title', formData.name || 'Accommodation Image');
        uploadFormData.append('alt_text', formData.name || 'Accommodation Image');
        uploadFormData.append('description', formData.description || '');
        
        const response = await fetch(`${admin_BASE_URL}/admin/accommodations/upload`, {
          method: 'POST',
          body: uploadFormData,
        });
        
        const data = await response.json();
        if (data.imageUrl) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, data.imageUrl]
          }));
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({
        ...prev,
        imageUrl: 'Failed to upload image'
      }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (image: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img !== image),
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
              {isEditing ? 'Edit Accommodation' : 'Add New Accommodation'}
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? 'Update accommodation details'
              : 'Create a new accommodation for your resort'}
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
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Accommodation Name *
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

        {/* Features */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Features & Amenities</h2>
            <div className="space-y-4">
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
                  placeholder="Add a feature (e.g., WiFi, Pool)"
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
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Images</h2>
            
            {/* Image Upload Method Toggle */}
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setUploadMethod('file')}
                className={`px-4 py-2 rounded-md ${
                  uploadMethod === 'file'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('url')}
                className={`px-4 py-2 rounded-md ${
                  uploadMethod === 'url'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Add URL
              </button>
            </div>

            {/* File Upload */}
            {uploadMethod === 'file' && (
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            )}

            {/* URL Upload */}
            {uploadMethod === 'url' && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newImageUrl.trim()) {
                      handleImageUpload(newImageUrl.trim());
                      setNewImageUrl('');
                    }
                  }}
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Accommodation ${index + 1}`}
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
                {isEditing ? 'Update Accommodation' : 'Create Accommodation'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccommodationForm;