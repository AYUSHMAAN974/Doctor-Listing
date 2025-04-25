import React, { useState, useEffect } from 'react';
import AutocompleteSearch from './AutocompleteSearch';
import FilterPanel from './FilterPanel';
import DoctorList from './DoctorList';
import DoctorDetail from './DoctorDetail';
import '../styles/App.css';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch doctors data');
        }
        
        const data = await response.json();
        setDoctors(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err.message);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  // Update URL with query parameters
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      
      // Load filters from URL on initial load
      if (!searchTerm && !consultationType && selectedSpecialties.length === 0 && !sortBy) {
        const searchParam = params.get('search');
        const consultParam = params.get('consultType');
        const specialtiesParam = params.get('specialties');
        const sortParam = params.get('sort');

        if (searchParam) setSearchTerm(searchParam);
        if (consultParam) setConsultationType(consultParam);
        if (specialtiesParam) setSelectedSpecialties(specialtiesParam.split(','));
        if (sortParam) setSortBy(sortParam);
      } else {
        // Update URL when filters change
        if (searchTerm) params.set('search', searchTerm);
        else params.delete('search');
        
        if (consultationType) params.set('consultType', consultationType);
        else params.delete('consultType');
        
        if (selectedSpecialties.length > 0) params.set('specialties', selectedSpecialties.join(','));
        else params.delete('specialties');
        
        if (sortBy) params.set('sort', sortBy);
        else params.delete('sort');
        
        // Update URL without reloading the page
        window.history.pushState({}, '', `${window.location.pathname}?${params}`);
      }
    } catch (err) {
      console.error('Error updating URL:', err);
    }
  }, [searchTerm, consultationType, selectedSpecialties, sortBy]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        
        setSearchTerm(params.get('search') || '');
        setConsultationType(params.get('consultType') || '');
        setSelectedSpecialties(params.get('specialties') ? params.get('specialties').split(',') : []);
        setSortBy(params.get('sort') || '');
      } catch (err) {
        console.error('Error handling popstate:', err);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Get all unique specialties for filter options
  const allSpecialties = React.useMemo(() => {
    try {
      if (!doctors || !Array.isArray(doctors)) return [];
      const specialtySet = new Set();
      doctors.forEach(doctor => {
        if (doctor && doctor.specialities && Array.isArray(doctor.specialities)) {
          doctor.specialities.forEach(specialty => {
            if (specialty && specialty.name) specialtySet.add(specialty.name);
          });
        }
      });
      return Array.from(specialtySet).sort();
    } catch (err) {
      console.error('Error getting specialties:', err);
      return [];
    }
  }, [doctors]);

  // Filter doctors based on search, consultation type, and specialties
  const filteredDoctors = React.useMemo(() => {
    try {
      if (!doctors || !Array.isArray(doctors)) return [];
      
      return doctors.filter(doctor => {
        // Skip invalid doctors
        if (!doctor) return false;
        
        // Filter by search term
        const matchesSearch = !searchTerm || 
          (doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Filter by consultation type
        const matchesConsultationType = !consultationType || 
          (consultationType === 'Video Consult' && doctor.video_consult) ||
          (consultationType === 'In Clinic' && doctor.in_clinic);
        
        // Filter by specialties
        const matchesSpecialties = selectedSpecialties.length === 0 || 
          (doctor.specialities && Array.isArray(doctor.specialities) && 
           selectedSpecialties.every(specialty => 
             doctor.specialities.some(spec => spec.name === specialty)
           ));
        
        return matchesSearch && matchesConsultationType && matchesSpecialties;
      });
    } catch (err) {
      console.error('Error filtering doctors:', err);
      return [];
    }
  }, [doctors, searchTerm, consultationType, selectedSpecialties]);

  // Sort doctors based on sort criteria
  const sortedDoctors = React.useMemo(() => {
    try {
      if (!filteredDoctors || !Array.isArray(filteredDoctors)) return [];
      
      return [...filteredDoctors].sort((a, b) => {
        if (sortBy === 'fees') {
          // Extract numeric value from fees string, handle various formats
          const getFeeValue = (feeStr) => {
            if (!feeStr) return 0;
            const numericValue = parseInt(feeStr.replace(/[^\d]/g, ''));
            return isNaN(numericValue) ? 0 : numericValue;
          };
          
          return getFeeValue(a.fees) - getFeeValue(b.fees); // Sort by fees ascending
        } else if (sortBy === 'experience') {
          // Extract years of experience as a number
          const getExperienceValue = (expStr) => {
            if (!expStr) return 0;
            const match = expStr.match(/(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          };
          
          return getExperienceValue(b.experience) - getExperienceValue(a.experience); // Sort by experience descending
        }
        return 0;
      });
    } catch (err) {
      console.error('Error sorting doctors:', err);
      return filteredDoctors;
    }
  }, [filteredDoctors, sortBy]);

  // Function to clear all filters - FIXED
  const clearAllFilters = () => {
    // Reset all filter states
    setSearchTerm('');
    setConsultationType('');
    setSelectedSpecialties([]);
    setSortBy('');
    
    // Also clear URL parameters
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Doctors List</h1>
        <AutocompleteSearch 
          doctors={doctors || []} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
      </header>
      
      <div className="main-content">
        <aside className="filter-sidebar">
          <FilterPanel 
            allSpecialties={allSpecialties}
            consultationType={consultationType}
            setConsultationType={setConsultationType}
            selectedSpecialties={selectedSpecialties}
            setSelectedSpecialties={setSelectedSpecialties}
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearAllFilters={clearAllFilters}
          />
        </aside>
        
        <main className="results-container">
          {loading ? (
            <div className="loading">Loading doctors...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : sortedDoctors.length === 0 ? (
            <div className="no-results">No doctors found matching your criteria.</div>
          ) : (
            <DoctorList 
              doctors={sortedDoctors} 
              onDoctorSelect={setSelectedDoctor}
            />
          )}
        </main>
      </div>

      {selectedDoctor && (
        <DoctorDetail 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
        />
      )}
    </div>
  );
}

export default App;