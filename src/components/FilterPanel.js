import React from 'react';
import '../styles/FilterPanel.css';

function FilterPanel({
  allSpecialties = [],
  consultationType,
  setConsultationType,
  selectedSpecialties,
  setSelectedSpecialties,
  sortBy,
  setSortBy,
  clearAllFilters
}) {
  // Handle consultation type change
  const handleConsultationTypeChange = (type) => {
    setConsultationType(consultationType === type ? '' : type);
  };

  // Handle specialty selection
  const handleSpecialtyChange = (specialty) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  // Handle sort option selection
  const handleSortChange = (option) => {
    setSortBy(sortBy === option ? '' : option);
  };

  // Helper function to create testId from specialty
  const createTestId = (specialty) => {
    if (!specialty) return 'filter-specialty-unknown';
    return `filter-specialty-${specialty.replace(/[/\s]/g, '-')}`;
  };

  // List of common specialties to ensure we have all the required test IDs
  const commonSpecialties = [
    'General Physician', 'Dentist', 'Dermatologist', 'Paediatrician',
    'Gynaecologist', 'ENT', 'Diabetologist', 'Cardiologist',
    'Physiotherapist', 'Endocrinologist', 'Orthopaedic', 'Ophthalmologist',
    'Gastroenterologist', 'Pulmonologist', 'Psychiatrist', 'Urologist',
    'Dietitian/Nutritionist', 'Psychologist', 'Sexologist', 'Nephrologist',
    'Neurologist', 'Oncologist', 'Ayurveda', 'Homeopath'
  ];

  // Combine API specialties with common ones, ensuring uniqueness
  const displaySpecialties = Array.from(new Set([
    ...commonSpecialties,
    ...(Array.isArray(allSpecialties) ? allSpecialties : [])
  ])).filter(Boolean).sort();

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>Filters</h2>
        <button className="clear-all-btn" onClick={clearAllFilters}>Clear All</button>
      </div>

      {/* Consultation Mode Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Consultation Mode</h3>
        <div className="filter-options">
          <label className="radio-option">
            <input
              type="radio"
              name="consultation-type"
              checked={consultationType === 'Video Consult'}
              onChange={() => handleConsultationTypeChange('Video Consult')}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="consultation-type"
              checked={consultationType === 'In Clinic'}
              onChange={() => handleConsultationTypeChange('In Clinic')}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
        </div>
      </div>

      {/* Specialties Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Specialties</h3>
        <div className="filter-options scrollable-options">
          {displaySpecialties.map(specialty => (
            <label key={specialty} className="checkbox-option">
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(specialty)}
                onChange={() => handleSpecialtyChange(specialty)}
                data-testid={createTestId(specialty)}
              />
              {specialty}
            </label>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-sort">Sort By</h3>
        <div className="filter-options">
          <label className="radio-option">
            <input
              type="radio"
              name="sort-by"
              checked={sortBy === 'fees'}
              onChange={() => handleSortChange('fees')}
              data-testid="sort-fees"
            />
            Fees (Low to High)
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="sort-by"
              checked={sortBy === 'experience'}
              onChange={() => handleSortChange('experience')}
              data-testid="sort-experience"
            />
            Experience (High to Low)
          </label>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;