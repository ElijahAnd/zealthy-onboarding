'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import '../styles/onboarding.css';

interface AboutProps {
  onNext: () => void;
  onBack: () => void;
  currentPage: 'home' | 'stepTwo' | 'stepThree';
}
interface AboutErrors {
  text?: string;
}

const About = ({ onNext, onBack, currentPage }: AboutProps) => {
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

  const [errors, setErrors] = useState<AboutErrors>({});

  const validateField = (value: string) => {
    if (!/^[a-zA-Z0-9\s.,]{2,150}$/.test(value)) {
      return 'Text must be 2-150 alphanumeric characters';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateField(aboutText);
    setErrors({ text: error });

    if (!error && aboutText) {
      onNext();
    }
  };

  const [aboutText, setAboutText] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedAbout = localStorage.getItem('aboutData');
      return savedAbout ? JSON.parse(savedAbout) : '';
    }
    return '';
  });
  
  const handleInputChange = (value: string) => {
    const error = validateField(value);
    setErrors({ text: error });
    setAboutText(value);
    localStorage.setItem('aboutData', JSON.stringify(value));
  };

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
          <h2>About me</h2>
          {errors.text && <div className="error-message">{errors.text}</div>}
          <p>Step {getStepNumber()} of 3</p>
        </div>

        <form className="onboarding-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              value={aboutText}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={6}
              className="about-textarea"
            />
          </div>
          {renderButtons()}
        </form>
      </div>
    </div>
  );
}

export default About;