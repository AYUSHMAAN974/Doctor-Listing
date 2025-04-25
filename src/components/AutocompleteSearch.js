import React, { useState, useEffect, useRef } from 'react';
import '../styles/AutocompleteSearch.css';

function AutocompleteSearch({ doctors = [], searchTerm = '', setSearchTerm }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Update suggestions when search term changes
  useEffect(() => {
    try {
      if (!searchTerm || !searchTerm.trim() || !Array.isArray(doctors)) {
        setSuggestions([]);
        return;
      }

      const filteredSuggestions = doctors
        .filter(doctor => 
          doctor && doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(doctor => doctor.name)
        .slice(0, 3); // Show only top 3 matches

      setSuggestions(filteredSuggestions);
    } catch (err) {
      console.error('Error updating suggestions:', err);
      setSuggestions([]);
    }
  }, [searchTerm, doctors]);

  // Handle clicking outside of the search bar
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="autocomplete" ref={searchRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Search for doctors..."
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        data-testid="autocomplete-input"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index} 
              onClick={() => handleSuggestionClick(suggestion)}
              data-testid="suggestion-item"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteSearch;