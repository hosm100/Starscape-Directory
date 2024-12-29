import React, { useState, useEffect } from 'react';

const ItemDirectory = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [listStyle, setListStyle] = useState('List1');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const categories = [
    'All',
    'Armor',
    'Blueprint',
    'Clothing',
    'Component',
    'Decoration',
    'Cosmetic',
    'Deployable',
    'Furniture',
    'Module',
    'Resource',
    'Salvage',
    'Ship',
    'Skin',
    'Turret',
    'Weapon',
  ];

  const getItemStyle = (item) => {
    if (item.FullName.includes('Ancient')) return 'bg-yellow-900';
    if (item.FullName.includes('Dread')) return 'bg-red-900';
    if (item.FullName.includes('Officers') || item.FullName.includes('Spectator')) return 'bg-red-400';
    if (item.FullName.includes('Hybrid')) return 'bg-purple-900';
    if (item.FullName.includes('Crystal')) return 'bg-indigo-900';
    if (item.FullName.includes(' III')) return 'bg-purple-800';
    if (item.FullName.includes(' II')) return 'bg-blue-800';
    if (item.FullName.includes(' I')) return 'bg-green-800';
    if (item.Type.includes('Cosmetic')) return 'bg-pink-900';
    if (item.Type.includes('Ship')) return 'bg-gray-900';
    return 'bg-gray-800';
  };

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = item.FullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.Type.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => (sortBy === 'name' ? a.FullName.localeCompare(b.FullName) : a.Value - b.Value));

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (window.innerWidth < 768) {
      // Auto-open the right sidebar on mobile
      setIsRightSidebarOpen(true);
    }
  };

  useEffect(() => {
    fetch('./data.json')
      .then((response) => response.json())
      .then((data) => setItems(data.flat()))
      .catch((error) => console.error('Error loading items:', error));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 font-mono overflow-hidden">
      {/* Mobile Sidebar Toggles */}
      <div className="md:hidden flex justify-between p-2 bg-blue-900 text-white">
        <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}>
          {isLeftSidebarOpen ? 'Close Filters' : 'Open Filters'}
        </button>
        <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}>
          {isRightSidebarOpen ? 'Close Details' : 'Open Details'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={`${
            isLeftSidebarOpen ? 'block' : 'hidden'
          } md:block w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0 overflow-y-auto`}
        >
          <div className="p-4">
            <h2 className="text-lg mb-4">Item Directory</h2>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li
                  key={category}
                  className={`cursor-pointer px-2 py-1 rounded ${
                    selectedCategory === category ? 'bg-blue-900 text-white' : 'hover:bg-gray-800'
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
              className="w-full bg-gray-800 border border-gray-700 px-2 py-1 rounded text-sm mb-4"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>

            {/* Styles Section */}
            <p className="mb-2">List styles</p>
            <div className="flex space-x-2">
              <button
                className={`flex-1 px-2 py-1 text-sm rounded ${
                  listStyle === 'List1' ? 'bg-blue-900 text-white' : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setListStyle('List1')}
              >
                List1
              </button>
              <button
                className={`flex-1 px-2 py-1 text-sm rounded ${
                  listStyle === 'List2' ? 'bg-blue-900 text-white' : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setListStyle('List2')}
              >
                List2
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {listStyle === 'List1' ? (
            <div className="space-y-2">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-2 hover:bg-gray-800 cursor-pointer rounded ${
                    selectedItem === item ? 'bg-gray-800' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className={`w-6 h-6 rounded ${getItemStyle(item)}`}>
                    {item.Icon && (
                      <img
                        src={`icon/${item.Icon.replace('rbxassetid://', '')}.png`}
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-2 hover:bg-gray-800 cursor-pointer rounded ${
                    selectedItem === item ? 'bg-gray-800' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className={`w-6 h-6 rounded ${getItemStyle(item)}`}>
                    {item.Icon && (
                      <img
                        src={`icon/${item.Icon.replace('rbxassetid://', '')}.png`}
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
          )}
        </div>

        {/* Right Sidebar */}
        <div
          className={`${
            isRightSidebarOpen ? 'block' : 'hidden'
          } md:block w-full md:w-72 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto`}
        >
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
                    src={`icon/${selectedItem.Icon.replace('rbxassetid://', '')}.png`}
                    alt={selectedItem.FullName}
                    className="w-24 h-24"
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No item selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDirectory;
