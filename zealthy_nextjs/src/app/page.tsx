'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ComponentContext } from './utils/ComponentContext';
import BirthdateField from './components/birthdate';
import AddressFields from './components/address';
import About from './components/aboutme';

export default function Home() {
  const router = useRouter();
  const { pageOneComponent } = useContext(ComponentContext);

  const handleNext = () => {
    router.push('/OnboardingStepTwo');
  };
  const handleBack = () => {
    router.back();
  };

  const renderComponent = () => {
    switch (pageOneComponent) {
      case 'address':
        return <AddressFields onBack={handleBack} onNext={handleNext} currentPage="home" />;
      case 'birthdate':
        return <BirthdateField onBack={handleBack} onNext={handleNext} currentPage="home" />;
      case 'about':
        return <About onBack={handleBack} onNext={handleNext} currentPage="home"/>;
      default:
        return <AddressFields onBack={handleBack} onNext={handleNext} currentPage="home" />;
    }
  };

  return (
    <main>
      {renderComponent()}
    </main>
  );
}
