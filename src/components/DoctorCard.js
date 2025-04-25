import React from 'react';
import '../styles/DoctorCard.css';

function DoctorCard({ doctor, onClick }) {
  if (!doctor) return null;

  // Fix double rupee sign issue by removing the rupee symbol from the API if present
  const formattedFees = doctor.fees ? 
    (doctor.fees.includes('₹') ? doctor.fees.trim() : `₹${doctor.fees}`) : 
    '₹ N/A';

  // Get specialties as string
  const specialtiesString = doctor.specialities ? 
    doctor.specialities.map(spec => spec.name).join(', ') : 
    'Specialty not available';

  // Get location string
  const locationString = doctor.clinic && doctor.clinic.address ? 
    `${doctor.clinic.address.locality || ''} ${doctor.clinic.address.city ? (doctor.clinic.address.locality ? ', ' : '') + doctor.clinic.address.city : ''}`.trim() : 
    '';

  return (
    <div className="doctor-card" data-testid="doctor-card" onClick={onClick}>
      <div className="doctor-image">
        <img 
          src={doctor.photo || 'https://via.placeholder.com/100'} 
          alt={doctor.name || 'Doctor'} 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
          className="doctor-profile-image"
        />
      </div>
      
      <div className="doctor-info">
        <h2 className="doctor-name" data-testid="doctor-name">
          {doctor.name || 'Unknown Doctor'}
        </h2>
        
        <div className="doctor-specialty" data-testid="doctor-specialty">
          {specialtiesString}
        </div>
        
        <div className="doctor-experience" data-testid="doctor-experience">
          {doctor.experience || 'Experience not specified'}
        </div>
        
        <div className="doctor-clinic">
          {doctor.clinic && doctor.clinic.name && (
            <div className="clinic-name">
              <span className="clinic-icon">🏥</span> {doctor.clinic.name}
            </div>
          )}
          
          {locationString && (
            <div className="clinic-location">
              <span className="location-icon">📍</span> {locationString}
            </div>
          )}
        </div>
      </div>
      
      <div className="doctor-card-right">
        <div className="doctor-fee" data-testid="doctor-fee">
          {formattedFees}
        </div>
        
        <div className="doctor-consultation-types">
          {doctor.video_consult && <span className="consult-badge video">Video Consult</span>}
          {doctor.in_clinic && <span className="consult-badge clinic">In Clinic</span>}
        </div>
        
        <button className="book-appointment-btn">Book Appointment</button>
      </div>
      
      <div className="card-click-hint">
        <span>Click for details</span>
      </div>
    </div>
  );
}

export default DoctorCard;