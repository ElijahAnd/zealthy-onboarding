'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ComponentContext } from '../utils/ComponentContext';
import BirthdateField from '../components/birthdate';
import AddressFields from '../components/address';
import About from '../components/aboutme';

export default function Home() {
  const router = useRouter();
  const { pageThreeComponent } = useContext(ComponentContext);

  const handleNext = async () => {
    const addressData = JSON.parse(localStorage.getItem('addressData') || '{}');
    const birthdateData = JSON.parse(localStorage.getItem('birthdateData') || '{}');
    const aboutData = JSON.parse(localStorage.getItem('aboutData') || '');
  
    const formData = {
      address: addressData,
      birthday: birthdateData,
      about: aboutData
    };
  
    const response = await fetch('/api/userData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
  
    if (response.ok) {
      localStorage.removeItem('addressData');
      localStorage.removeItem('birthdateData');
      localStorage.removeItem('aboutData');
      router.push('/data');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderComponent = () => {
    switch (pageThreeComponent) {
      case 'address':
        return <AddressFields onBack={handleBack} onNext={handleNext} currentPage="stepThree" />;
      case 'birthdate':
        return <BirthdateField onBack={handleBack} onNext={handleNext} currentPage="stepThree" />;
      case 'about':
        return <About onBack={handleBack} onNext={handleNext} currentPage="stepThree" />;
      default:
        return <About onBack={handleBack} onNext={handleNext} currentPage="stepThree" />;
    }
  };

  return (
    <main>
      {renderComponent()}
    </main>
  );
}