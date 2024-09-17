import React, { useState } from 'react';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Sample data list
  const items = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Grapes', 'Papaya'];

  // Function to handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value) {
      const filteredSuggestions = items.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion); // Set input to clicked suggestion
    setSuggestions([]);   // Clear suggestions
  };

  return (
    <div className="relative w-64 mx-auto mt-4">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border rounded shadow"
        placeholder="Search for a fruit..."
      />
      
      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 w-full bg-white border rounded shadow mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
