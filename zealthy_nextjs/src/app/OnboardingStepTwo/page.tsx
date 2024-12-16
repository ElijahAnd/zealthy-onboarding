'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ComponentContext } from '../utils/ComponentContext';
import BirthdateField from '../components/birthdate';
import AddressFields from '../components/address';
import About from '../components/aboutme';

export default function Home() {
  const router = useRouter();
  const { pageTwoComponent } = useContext(ComponentContext);

  const handleNext = () => {
    router.push('/OnboardingStepThree');
  };
  const handleBack = () => {
    router.back();
  };

  const renderComponent = () => {
    switch (pageTwoComponent) {
      case 'address':
        return <AddressFields onBack={handleBack} onNext={handleNext} currentPage="stepTwo"/>;
      case 'birthdate':
        return <BirthdateField onBack={handleBack} onNext={handleNext} currentPage="stepTwo" />;
      case 'about':
        return <About onBack={handleBack} onNext={handleNext} currentPage="stepTwo" />;
      default:
        return <BirthdateField onBack={handleBack} onNext={handleNext} currentPage="stepTwo" />;
    }
  };

  return (
    <main>
      {renderComponent()}
    </main>
  );
}