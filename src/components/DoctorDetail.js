import React, { useEffect, useRef } from 'react';
import '../styles/DoctorDetail.css';

function DoctorDetail({ doctor, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    // Add class to body to prevent scrolling
    document.body.classList.add('modal-open');
    
    // Focus trap and escape key handler
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Format fee
  const formattedFees = doctor.fees ? 
    (doctor.fees.includes('₹') ? doctor.fees.trim() : `₹${doctor.fees}`) : 
    '₹ N/A';

  // Get specialties as string
  const specialtiesString = doctor.specialities ? 
    doctor.specialities.map(spec => spec.name).join(', ') : 
    'Specialty not available';

  // Get languages as string
  const languagesString = doctor.languages ? 
    doctor.languages.join(', ') : 
    'Not specified';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="doctor-detail-modal" 
        ref={modalRef} 
        onClick={e => e.stopPropagation()}
      >
        <div className="detail-header">
          <h2>Doctor Details</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="detail-content">
          <div className="detail-top">
            <div className="detail-photo">
              <img 
                src={doctor.photo || 'https://via.placeholder.com/100'} 
                alt={doctor.name} 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200'; }}
              />
            </div>
            
            <div className="detail-primary-info">
              <h3 className="detail-name">{doctor.name}</h3>
              <div className="detail-specialty">{specialtiesString}</div>
              <div className="detail-experience">{doctor.experience}</div>
              
              <div className="detail-consultation-types">
                {doctor.video_consult && <span className="consult-badge video">Video Consult</span>}
                {doctor.in_clinic && <span className="consult-badge clinic">In Clinic</span>}
              </div>
              
              <div className="detail-fee">
                <strong>Consultation Fee:</strong> {formattedFees}
              </div>
            </div>
          </div>
          
          <div className="detail-sections">
            {doctor.doctor_introduction && (
              <div className="detail-section">
                <h4>About Doctor</h4>
                <p>{doctor.doctor_introduction}</p>
              </div>
            )}
            
            <div className="detail-section">
              <h4>Languages Spoken</h4>
              <p>{languagesString}</p>
            </div>
            
            {doctor.clinic && (
              <div className="detail-section">
                <h4>Clinic Information</h4>
                <div className="clinic-detail">
                  <strong>Name:</strong> {doctor.clinic.name}
                </div>
                
                {doctor.clinic.address && (
                  <div className="clinic-detail">
                    <strong>Address:</strong>
                    <p>
                      {doctor.clinic.address.address_line1 && 
                        <span>{doctor.clinic.address.address_line1}<br /></span>
                      }
                      {doctor.clinic.address.locality && 
                        <span>{doctor.clinic.address.locality}, </span>
                      }
                      {doctor.clinic.address.city && 
                        <span>{doctor.clinic.address.city}</span>
                      }
                    </p>
                  </div>
                )}
                
                {doctor.clinic.address && doctor.clinic.address.logo_url && (
                  <div className="clinic-logo">
                    <img 
                      src={doctor.clinic.address.logo_url} 
                      alt={`${doctor.clinic.name} logo`}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="detail-footer">
            <button className="book-appointment-btn large-btn" disabled>
              Book Appointment <small>(Coming Soon)</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetail;