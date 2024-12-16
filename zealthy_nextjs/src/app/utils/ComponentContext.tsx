'use client';

import { createContext, useState, useEffect } from 'react';

export const ComponentContext = createContext({
  pageOneComponent: 'address',
  pageTwoComponent: 'birthdate', 
  pageThreeComponent: 'about',
  setPageOneComponent: (component: string) => {},
  setPageTwoComponent: (component: string) => {},
  setPageThreeComponent: (component: string) => {}
});

export function ComponentProvider({ children }: { children: React.ReactNode }) {
  const [pageOneComponent, setPageOneComponent] = useState('address');
  const [pageTwoComponent, setPageTwoComponent] = useState('birthdate');
  const [pageThreeComponent, setPageThreeComponent] = useState('about');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPageOne = localStorage.getItem('pageOneComponent');
      const savedPageTwo = localStorage.getItem('pageTwoComponent');
      const savedPageThree = localStorage.getItem('pageThreeComponent');

      if (savedPageOne) setPageOneComponent(savedPageOne);
      if (savedPageTwo) setPageTwoComponent(savedPageTwo);
      if (savedPageThree) setPageThreeComponent(savedPageThree);
    }
  }, []);

  const updatePageOne = (component: string) => {
    setPageOneComponent(component);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pageOneComponent', component);
    }
  };

  const updatePageTwo = (component: string) => {
    setPageTwoComponent(component);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pageTwoComponent', component);
    }
  };

  const updatePageThree = (component: string) => {
    setPageThreeComponent(component);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pageThreeComponent', component);
    }
  };

  return (
    <ComponentContext.Provider value={{
      pageOneComponent,
      pageTwoComponent,
      pageThreeComponent,
      setPageOneComponent: updatePageOne,
      setPageTwoComponent: updatePageTwo,
      setPageThreeComponent: updatePageThree
    }}>
      {children}
    </ComponentContext.Provider>
  );
}
