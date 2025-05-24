import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Coffee, Save } from 'lucide-react';

const ServiceForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== undefined;

  // Mock data for editing
  const service = isEditing
    ? {
        id: 1,
        name: 'Spa & Wellness',
        description: 'Relax and rejuvenate with our signature spa treatments featuring natural ingredients and traditional techniques.',
        image: 'https://images.pexels.com/photos/3188/love-romantic-bath-candlelight.jpg',
        price: 2500,
        duration: 90,
        available: true
      }
    : {
        id: null,
        name: '',
        description: '',
        image: '',
        price: 0,
        duration: 60,
        available: true
      };

  const [formData, setFormData] = useState(service);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === 'price' || name === 'duration') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // In a real application, this would be an API call
      console.log('Form submitted:', formData);
      navigate('/services');
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <button
              onClick={() => navigate('/services')}
              className="mr-2 text-gray-400 hover:text-gray-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Service' : 'Add New Service'}
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? 'Update service details'
              : 'Create a new service for your resort'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Service Information</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Service Name
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

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
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

              <div className="sm:col-span-6">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="image"
                    id="image"
                    value={formData.image}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.image ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                </div>
              </div>

              {formData.image && (
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Image Preview</label>
                  <div className="mt-1 aspect-w-16 aspect-h-9 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={formData.image}
                      alt="Service preview"
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (₹)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="duration"
                    id="duration"
                    min="0"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.duration ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
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

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            to="/services"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;