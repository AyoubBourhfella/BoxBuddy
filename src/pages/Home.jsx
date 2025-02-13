
import React from 'react';
import MapComponent from '../components/Map';
import AddComponent from '../components/AddComponent';
import ClickableMap from '../components/ClickableMap';
import Dashboard from '../components/Dashboard';
import Notifications from '../components/Notifications';

const Home = () => {
  return (
    <div className="home-container">
      <MapComponent/>
      <AddComponent/>
      <Dashboard/>
      <Notifications/>


    </div>
  );
};

export default Home;
