'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { US_STATES } from '../utils/us_states';
import '../styles/onboarding.css';
import { SingleValue } from 'react-select';

interface StateOption {
    value: string;
    label: string;
  }

interface AddressErrors {
  street?: string;
  city?: string;
  zipCode?: string;
  state?: string;
}

interface AddressFieldsProps {
  onNext: () => void;
  onBack: () => void;
  currentPage: 'home' | 'stepTwo' | 'stepThree';
}

const Select = dynamic(() => import('react-select'), {
  ssr: false
}) as typeof import('react-select').default;

const AddressFields = ({ onNext, onBack, currentPage }: AddressFieldsProps) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const streetError = validateField('street', address.street);
    const cityError = validateField('city', address.city);
    const zipError = validateField('zipCode', address.zipCode);
    const stateError = !address.state ? 'Please select a state' : '';
    
    const newErrors = {
      street: streetError,
      city: cityError,
      zipCode: zipError,
      state: stateError
    };
    
    setErrors(newErrors);

    if (!streetError && !cityError && !zipError && !stateError &&
        address.street && address.city && address.state && address.zipCode) {
      onNext();
    }
  };

  const [errors, setErrors] = useState<AddressErrors>({});
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'street':
        if (!/^[a-zA-Z0-9\s.]{2,65}$/.test(value)) {
          return 'Street address must be 2-65 alphanumeric characters';
        }
        break;
      case 'city':
        if (!/^[a-zA-Z\s]{2,45}$/.test(value)) {
          return 'City must be 2-45 alphabetic characters';
        }
        break;
      case 'zipCode':
        if (!/^\d{5}$/.test(value)) {
          return 'ZIP code must be exactly 5 numeric characters';
        }
        break;
    }
    return '';
  };

  const [address, setAddress] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('addressData');
      return savedAddress ? JSON.parse(savedAddress) : {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      };
    }
    return {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    };
  });

  const handleStateChange = (option: SingleValue<StateOption>) => {
    setAddress({ ...address, state: option?.value || '' });
  };

  const handleInputChange = (field: string, value: string) => {
    const error = validateField(field, value);
    const newErrors = { ...errors, [field]: error };
    setErrors(newErrors);

    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    localStorage.setItem('addressData', JSON.stringify(newAddress));
  };

  const getStepNumber = () => {
    switch (currentPage) {
      case 'home': return '1';
      case 'stepTwo': return '2';
      case 'stepThree': return '3';
      default: return '1';
    }
  };
  
  const renderButtons = () => {
    switch (currentPage) {
      case 'home':
        return (
          <button type="submit" className="next-button">
            Next Step
          </button>
        );
      case 'stepTwo':
        return (
          <div className="button-container">
            <button type="button" className="back-button" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="next-button">
              Next Step
            </button>
          </div>
        );
      case 'stepThree':
        return (
          <div className="button-container">
            <button type="button" className="back-button" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        );
    }
  }

  return (
    <div className="container">
      <div className="overlay" />
      <div className="card">
      <div className="onboarding-header">
          <h2>Address Information</h2>
          <p>Step {getStepNumber()} of 3</p>
        </div>

        <form className="onboarding-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Street Address</label>
            {errors.street && <div className="error-message">{errors.street}</div>}
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="123 Main St"
            />
          </div>

          <div className="form-group">
            <label>City</label>
            {errors.city && <div className="error-message">{errors.city}</div>}
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="San Francisco"
            />
          </div>

          <div className="form-group">
            <label>State</label>
            {errors.state && <div className="error-message">{errors.state}</div>}
            <Select
              value={US_STATES.find(state => state.value === address.state)}
              onChange={(option) => handleInputChange('state', option?.value || '')}
              options={US_STATES}
              className="state-select"
              placeholder="Select a state..."
            />
          </div>

          <div className="form-group">
            <label>ZIP Code</label>
            {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
            <input
              type="text"
              value={address.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              placeholder="94105"
              maxLength={5}
            />
          </div>
          {renderButtons()}
        </form>
      </div>
    </div>
  );
};

export default AddressFields;