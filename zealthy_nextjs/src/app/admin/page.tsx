'use client';

import { useContext, useState } from 'react';
import { ComponentContext } from '../utils/ComponentContext';

export default function AdminPanel() {
const [message, setMessage] = useState('');
  const {
    pageOneComponent,
    pageTwoComponent, 
    pageThreeComponent,
    setPageOneComponent,
    setPageTwoComponent,
    setPageThreeComponent
  } = useContext(ComponentContext);

  const handleComponentChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setMessage('Component updated successfully! Check the onboarding flow.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Admin Control Panel</h1>
        {message && <div className="success-message">{message}</div>}
        
        <div className="form-group">
          <label> Onboarding Step One component </label>
          <select 
            value={pageOneComponent} 
            onChange={(e) => handleComponentChange(setPageOneComponent, e.target.value)}
          >
            <option value="address">Address Form</option>
            <option value="birthdate">Birthdate Form</option>
            <option value="about">About Form</option>
          </select>
        </div>

        <div className="form-group">
          <label> Onboarding Step Two component </label>
          <select 
            value={pageTwoComponent} 
            onChange={(e) => handleComponentChange(setPageTwoComponent, e.target.value)}
          >
            <option value="address">Address Form</option>
            <option value="birthdate">Birthdate Form</option>
            <option value="about">About Form</option>
          </select>
        </div>

        <div className="form-group">
          <label> Onboarding Step Three component </label>
          <select 
            value={pageThreeComponent} 
            onChange={(e) => handleComponentChange(setPageThreeComponent, e.target.value)}
          >
            <option value="address">Address Form</option>
            <option value="birthdate">Birthdate Form</option>
            <option value="about">About Form</option>
          </select>
        </div>
        
      </div>
    </div>
  );
}
