import React, { useState } from 'react';
import { Image, Search, Filter, UploadCloud, XCircle, Trash2 } from 'lucide-react';

const Gallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'All' },
    { id: 'accommodation', name: 'Accommodation' },
    { id: 'activities', name: 'Activities' },
    { id: 'nature', name: 'Nature' },
    { id: 'lakeside', name: 'Lake Side' },
  ];

  const galleryImages = [
    {
      id: 1,
      url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      title: 'Luxury Villa Interior',
      category: 'accommodation',
    },
    {
      id: 2,
      url: 'https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg',
      title: 'Garden Suite View',
      category: 'accommodation',
    },
    {
      id: 3,
      url: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg',
      title: 'Morning Lake View',
      category: 'lakeside',
    },
    {
      id: 4,
      url: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
      title: 'Kayaking Adventure',
      category: 'activities',
    },
    {
      id: 5,
      url: 'https://images.pexels.com/photos/1179156/pexels-photo-1179156.jpeg',
      title: 'Forest Trail Hike',
      category: 'activities',
    },
    {
      id: 6,
      url: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg',
      title: 'Mountain Sunrise',
      category: 'nature',
    },
    {
      id: 7,
      url: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg',
      title: 'Lake Front Sunset',
      category: 'lakeside',
    },
    {
      id: 8,
      url: 'https://images.pexels.com/photos/1438834/pexels-photo-1438834.jpeg',
      title: 'Family Bungalow',
      category: 'accommodation',
    },
    {
      id: 9,
      url: 'https://images.pexels.com/photos/2387069/pexels-photo-2387069.jpeg',
      title: 'Luxury Tent Exterior',
      category: 'accommodation',
    },
    {
      id: 10,
      url: 'https://images.pexels.com/photos/2113566/pexels-photo-2113566.jpeg',
      title: 'Evening Boat Ride',
      category: 'activities',
    },
    {
      id: 11,
      url: 'https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg',
      title: 'Mountain Landscape',
      category: 'nature',
    },
    {
      id: 12,
      url: 'https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg',
      title: 'Resort Front View',
      category: 'accommodation',
    },
  ];

  const filteredImages = galleryImages.filter(
    (image) =>
      (activeFilter === 'all' || image.category === activeFilter) &&
      (image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your resort's image gallery</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Images
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
            placeholder="Search gallery..."
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

      {/* Filter tabs */}
      <div className="sm:hidden">
        <select
          id="mobile-tabs"
          name="mobile-tabs"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
        >
          {filters.map((filter) => (
            <option key={filter.id} value={filter.id}>
              {filter.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`${
                  activeFilter === filter.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150`}
              >
                {filter.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {filteredImages.map((image) => (
          <div key={image.id} className="relative group rounded-lg overflow-hidden bg-gray-200">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                  <button className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50">
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button className="p-1.5 bg-white rounded-full text-blue-600 hover:bg-blue-50">
                    <Image className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
              <p className="text-white text-sm truncate">{image.title}</p>
              <span className="text-xs text-gray-300 capitalize">{image.category}</span>
            </div>
          </div>
        ))}

        {/* Upload Placeholder */}
        <div className="relative rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
          <div className="aspect-w-1 aspect-h-1 flex flex-col items-center justify-center p-4">
            <UploadCloud className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500 mt-2 text-center">Upload Image</p>
          </div>
        </div>
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-10">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;