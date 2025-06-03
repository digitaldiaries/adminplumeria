import React, { useState } from "react";
import { Pencil, XCircle, PlusCircle, Trash } from "lucide-react";

type Package = {
  id: number;
  title: string;
  image: string;
  description: string;
  features: string[];
  price: string;
  status: "active" | "inactive";
};

const initialPackages: Package[] = [
  {
    id: 1,
    title: "Luxury Resort",
    image: "resort-package.jpg",
    description: "Experience a luxurious stay with top-notch amenities.",
    features: ["Spa", "Private Beach", "All Meals Included"],
    price: "₹20,000/night",
    status: "active",
  },
  {
    id: 2,
    title: "Camping Adventure",
    image: "camping-package.jpg",
    description: "Enjoy a thrilling camping experience in nature.",
    features: ["Bonfire", "Guided Trek", "Tent Stay"],
    price: "₹5,000/night",
    status: "inactive",
  },
];

const Packages = () => {
  const [packages, setPackages] = useState(initialPackages);
  const [editPackage, setEditPackage] = useState<Package | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [newPackage, setNewPackage] = useState<Package | null>(null);

  const handleEditClick = (pkg: Package) => {
    setEditPackage(pkg);
  };

  const handleSaveChanges = () => {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === editPackage?.id ? editPackage : pkg))
    );
    setEditPackage(null);
    setNewFeature(""); // Reset feature input
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setNewPackage({
        ...newPackage!,
        features: [...newPackage!.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const handleAddPackage = () => {
    if (newPackage) {
      setPackages((prev) => [...prev, { ...newPackage, id: prev.length + 1 }]);
      setNewPackage(null);
      setNewFeature("");
    }
  };

  const handleDeletePackage = (id: number) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
      <p className="text-sm text-gray-500">
        Manage different accommodation packages for your resort.
      </p>

      {/* Add Package Button */}
      <button
        onClick={() =>
          setNewPackage({
            id: 0,
            title: "",
            image: "",
            description: "",
            features: [],
            price: "",
            status: "active",
          })
        }
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        <PlusCircle className="h-5 w-5 mr-2" /> Add Package
      </button>

      {/* Grid Layout for Packages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow p-4">
            <img
              src={pkg.image}
              alt={pkg.title}
              className="h-40 w-full rounded-md object-cover"
            />
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">{pkg.title}</h3>
              <p className="text-sm text-gray-600">{pkg.description}</p>
              <p className="mt-1 font-semibold text-gray-900">{pkg.price}</p>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  pkg.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => handleEditClick(pkg)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDeletePackage(pkg.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Package Modal */}
      {newPackage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Package</h2>
              <button
                onClick={() => setNewPackage(null)}
                className="text-red-500 hover:text-red-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-gray-700">Title</span>
                <input
                  type="text"
                  value={newPackage.title}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, title: e.target.value })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Image URL</span>
                <input
                  type="text"
                  value={newPackage.image}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, image: e.target.value })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Description</span>
                <textarea
                  value={newPackage.description}
                  onChange={(e) =>
                    setNewPackage({
                      ...newPackage,
                      description: e.target.value,
                    })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Features</span>
                <input
                  type="text"
                  placeholder="Add feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="block w-full mt-2 border-gray-300 rounded-md shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddFeature();
                  }}
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddPackage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;