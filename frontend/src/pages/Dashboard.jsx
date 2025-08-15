import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FoodTable from '../pages/FoodTable'; // import FoodTable
import styles from '../css/Sidebar.module.css';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('home'); // mặc định là home

  const renderContent = () => {
    switch (activePage) {
      case 'nguyenlieu':
        return <FoodTable />;
      case 'home':
      default:
        return <h2>Chào mừng đến Dashboard</h2>;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onNavigate={setActivePage} /> 
      <main style={{ flex: 1, padding: '20px' }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
