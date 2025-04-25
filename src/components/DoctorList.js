import React from 'react';
import DoctorCard from './DoctorCard';
import '../styles/DoctorList.css';

function DoctorList({ doctors = [], onDoctorSelect }) {
  if (!Array.isArray(doctors) || doctors.length === 0) {
    return <div className="no-results">No doctors found matching your criteria.</div>;
  }

  return (
    <div className="doctor-list">
      {doctors.map((doctor, index) => (
        <DoctorCard 
          key={doctor.id || index} 
          doctor={doctor} 
          onClick={() => onDoctorSelect(doctor)}
        />
      ))}
    </div>
  );
}

export default DoctorList;