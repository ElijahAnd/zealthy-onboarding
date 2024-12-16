'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';;
import '../styles/onboarding.css';

interface DateOption {
  value: string;
  label: string;
}
interface BirthdateErrors {
  month?: string;
  day?: string;
  year?: string;
}
interface BirthdateFieldsProps {
  onNext: () => void;
  onBack: () => void;
  currentPage: 'home' | 'stepTwo' | 'stepThree';
}

const Select = dynamic(() => import('react-select'), {
ssr: false
}) as typeof import('react-select').default;

const BirthdateField = ({ onNext, onBack, currentPage }: BirthdateFieldsProps) => {
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

  const [errors, setErrors] = useState<BirthdateErrors>({});

  const validateField = (field: string, value: string) => {
    if (!value) {
      return `Please select a ${field}`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const monthError = validateField('month', birthdate.month);
    const dayError = validateField('day', birthdate.day);
    const yearError = validateField('year', birthdate.year);

    const newErrors = {
      month: monthError,
      day: dayError,
      year: yearError
    };

    setErrors(newErrors);

    if (!monthError && !dayError && !yearError && 
        birthdate.month && birthdate.day && birthdate.year) {
      onNext();
    }
  };

  const [birthdate, setBirthdate] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedBirthdate = localStorage.getItem('birthdateData');
      return savedBirthdate ? JSON.parse(savedBirthdate) : {
        month: '',
        day: '',
        year: ''
      };
    }
    return {
      month: '',
      day: '',
      year: ''
    };
  });

  const handleInputChange = (field: string, value: string) => {
    const newBirthdate = { ...birthdate, [field]: value };
    setBirthdate(newBirthdate);
    localStorage.setItem('birthdateData', JSON.stringify(newBirthdate));
  };

  // Generate options for months, days, and years
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2000, i).toLocaleString('default', { month: 'long' })
  }));

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1)
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i)
  }));

  const getStepNumber = () => {
    switch (currentPage) {
      case 'home': return '1';
      case 'stepTwo': return '2';
      case 'stepThree': return '3';
      default: return '1';
    }
  };

  return (
    <div className="container">
      <div className="overlay" />
      <div className="card">
        <div className="onboarding-header">
          <h2>Date of Birth</h2>
          <p>Step {getStepNumber()} of 3</p>
        </div>

        <form className="onboarding-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Month</label>
            {errors.month && <div className="error-message">{errors.month}</div>}
            <Select<DateOption>
              value={months.find(m => m.value === birthdate.month)}
              onChange={(option) => handleInputChange('month', option?.value || '')}
              options={months}
              className="state-select"
              placeholder="Select month"
            />
          </div>

          <div className="form-group">
            <label>Day</label>
            {errors.day && <div className="error-message">{errors.day}</div>}
            <Select<DateOption>
              value={days.find(d => d.value === birthdate.day)}
              onChange={(option) => handleInputChange('day', option?.value || '')}
              options={days}
              className="state-select"
              placeholder="Select day"
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            {errors.year && <div className="error-message">{errors.year}</div>}
            <Select<DateOption>
              value={years.find(y => y.value === birthdate.year)}
              onChange={(option) => handleInputChange('year', option?.value || '')}
              options={years}
              className="state-select"
              placeholder="Select year"
            />
          </div>

          {renderButtons()}
        </form>
      </div>
    </div>
  );
};

export default BirthdateField;