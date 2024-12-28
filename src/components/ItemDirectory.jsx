import React, { useState, useEffect } from 'react';

const ItemDirectory = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  const categories = [
    'All',
    'Armor',
    'Blueprint',
    'Clothing',
    'Component',
    'Cosmetic',
    'Deployable',
    'Furniture',
    'Module',
    'Resource',
    'Salvage',
    'Ship',
    'Turret',
    'Weapon'
  ];

  // Function to determine item background style based on name/type
  const getItemStyle = (item) => {
    if (item.FullName.includes('Ancient')) {
      return 'bg-yellow-900';
    } else if (item.FullName.includes('Dread')) {
      return 'bg-red-900';
    } else if (item.FullName.includes('Officers') || item.FullName.includes('Spectator')) {
      return 'bg-red-400';
    } else if (item.FullName.includes('Hybrid')) {
      return 'bg-purple-900';
    } else if (item.FullName.includes('Crystal')) {
      return 'bg-indigo-900';
    } else if (item.FullName.includes(' III')) {
      return 'bg-purple-800';
    } else if (item.FullName.includes(' II')) {
      return 'bg-blue-800';
    } else if (item.FullName.includes(' I')) {
      return 'bg-green-800';
    } else if (item.Type.includes('Cosmetic')) {
      return 'bg-pink-900';
    } else if (item.Type.includes('Ship')) {
      return 'bg-gray-900';
    }
    return 'bg-gray-800';
  };

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.FullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.Type.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return a.FullName.localeCompare(b.FullName);
    } else if (sortBy === 'price') {
      return a.Value - b.Value;
    }
    return 0;
  });

  // Load items from data.json
  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        // Flatten the array of arrays into a single array of items
        const flattenedItems = data.flat();
        setItems(flattenedItems);
      })
      .catch(error => console.error('Error loading items:', error));
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300 font-mono">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-4">
          <h2 className="text-lg mb-4">Item Directory</h2>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer px-2 py-1 rounded ${
                  selectedCategory === category 
                    ? 'bg-blue-900 text-white' 
                    : 'hover:bg-gray-800'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-800">
          <p className="mb-2">Filter results</p>
          <input
            type="text"
            placeholder="Item name"
            className="w-full bg-gray-800 border border-gray-700 px-2 py-1 rounded text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="p-4 border-t border-gray-800">
          <p className="mb-2">Order items by</p>
          <select 
            className="w-full bg-gray-800 border border-gray-700 px-2 py-1 rounded text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-900 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-1">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-2 hover:bg-gray-800 cursor-pointer rounded ${
                  selectedItem === item ? 'bg-gray-800' : ''
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className={`w-6 h-6 rounded ${getItemStyle(item)}`}>
                  {item.Icon && (
                    <img 
                      src={`icon/${item.Icon.replace("rbxassetid://", "")}.png`}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div>
                  <p>{item.FullName}</p>
                  <p className="text-gray-500 text-sm">{item.Type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Item Details */}
      <div className="w-72 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
        {selectedItem ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{selectedItem.FullName}</h3>
            <p className="text-sm text-gray-400">{selectedItem.Type}</p>

            <div>
              <p className="text-sm mb-1">Buy/Sell</p>
              <div className="flex space-x-2">
                <span className="text-red-500">{selectedItem.Value}</span>
                <span>/</span>
                <span className="text-green-500">{Math.floor(selectedItem.Value * 0.7)}</span>
              </div>
            </div>

            {selectedItem.Volume && (
              <div>
                <p className="text-sm mb-1">Volume</p>
                <p>{selectedItem.Volume} m³</p>
              </div>
            )}

            <div>
              <p className="text-sm mb-1">Description</p>
              <p className="text-sm text-gray-400">{selectedItem.Description}</p>
            </div>

            {selectedItem.Icon && (
              <div>
                <p className="text-sm mb-1">Icon</p>
                <img 
                  src={`icon/${selectedItem.Icon.replace("rbxassetid://", "")}.png`}
                  alt={selectedItem.FullName}
                  className="w-16 h-16 object-contain bg-gray-800 rounded p-1"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Select an item to view details</p>
        )}
      </div>
    </div>
  );
};

export default ItemDirectory;
