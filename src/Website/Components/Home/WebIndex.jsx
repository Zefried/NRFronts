import React, { useState, useEffect } from 'react';
import './WebIndex.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TestHeader from '../../TestCompo/TestHeader';
import { AuthAction } from '../../../CustomStateManage/OrgUnits/AuthState';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { popularRoutes } from './PopularRoutes';
import { tourismHighlights } from './PopularRoutes';

const WebIndex = () => {
  AuthAction.initiateAuthState();
  const today = new Date().toISOString().split('T')[0];

  const [dateTrigger, setDateTrigger] = useState(false);
  const navigate = useNavigate();
  const [storeLocation, setStoreLocation] = useState({
    source: 'Guwahati',
    destination: 'Jorhat',
    date: today
  });

  const [activeField, setActiveField] = useState(null);
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dateTrigger) {
      handleSubmit();
      setDateTrigger(false);
    }
  }, [storeLocation.date]);

  const handleSearch = async (type, value) => {
    setActiveField(type);
    setStoreLocation(prev => ({ ...prev, [type]: value }));

    if (value.length > 1) {
      try {
        const res = await axios.post(`/api/location-search?type=search&query=${value}`);
        setSearchData(res.data.data);
      } catch (err) {
        console.error(`${type} search error:`, err);
      }
    } else {
      setSearchData([]);
    }
  };

  const selectSearchData = (item) => {
    if (activeField) {
      setStoreLocation(prev => ({ ...prev, [activeField]: item.location }));
      setSearchData([]);
    }
  };

  const handleSubmit = async () => {
    let { source, destination, date } = storeLocation;
    
    if (!source || !destination || !date) {
      alert("Please select date of journey");
      return;
    }

    if (source === destination) {
      alert("Source and destination can't be the same");
      return;
    }

    // Convert date format if needed
    if (date.includes('/')) {
      const [dd, mm, yy] = date.split('/');
      date = `20${yy}-${mm}-${dd}`;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('/api/search-bus', { source, destination, date });
      
      if (res.data.status === 200) {
        AuthAction.updateState({
          origin: source,
          destination,
          date_of_journey: date,
          parent_route: res.data.data[0]?.parent_route || '',
        });
        navigate('/bus-search-result', { state: res.data.data });
      } else if (res.data.message_status) {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search buses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToday = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    setStoreLocation(prev => ({ ...prev, date: `${day}/${month}/${year}` }));
    setDateTrigger(true);
  };

  const handleTomorrow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    setStoreLocation(prev => ({ ...prev, date: `${day}/${month}/${year}` }));
    setDateTrigger(true);
  };

  // Handle popular route click
  const handlePopularRouteClick = (from, to) => {
    setStoreLocation({
      source: from,
      destination: to,
      date: today
    });
    setDateTrigger(true);
  };

  const swapLocations = () => {
    setStoreLocation(prev => ({
      ...prev,
      source: prev.destination,
      destination: prev.source
    }));
  };

  return (
    <>
      <TestHeader/>
      <div className="booking-container">
        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="hero-content">
            <h1 className="hero-title">No. 1 Bus Booking Platform</h1>
            <p className="hero-subtitle">Travel across Assam with comfort and ease</p>
          </div>
        </div>

        {/* Search Form */}
        <div className="search-form-container">
          <div className="search-form">
            <h2 className="form-title">Book Your Bus Journey</h2>
            
            <div className="form-fields">
              {/* From Field */}
              <div className={`form-field ${activeField === 'source' ? 'active' : ''}`}>
                <div className="field-icon">
                  <i className="ri-map-pin-line"></i>
                </div>
                <div className="field-input">
                  <label>From</label>
                  <input
                    type="text"
                    value={storeLocation.source}
                    onChange={(e) => handleSearch('source', e.target.value)}
                    onFocus={() => setActiveField('source')}
                    placeholder="Enter source city"
                  />
                  {activeField === 'source' && searchData.length > 0 && (
                    <div className="search-dropdown">
                      {searchData.map(item => (
                        <div 
                          key={item.id} 
                          className="dropdown-item"
                          onClick={() => selectSearchData(item)}
                        >
                          {item.location}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <button className="swap-button" onClick={swapLocations}>
                <i className="ri-arrow-left-right-line"></i>
              </button>

              {/* To Field */}
              <div className={`form-field ${activeField === 'destination' ? 'active' : ''}`}>
                <div className="field-icon">
                  <i className="ri-map-pin-line"></i>
                </div>
                <div className="field-input">
                  <label>To</label>
                  <input
                    type="text"
                    value={storeLocation.destination}
                    onChange={(e) => handleSearch('destination', e.target.value)}
                    onFocus={() => setActiveField('destination')}
                    placeholder="Enter destination city"
                  />
                  {activeField === 'destination' && searchData.length > 0 && (
                    <div className="search-dropdown">
                      {searchData.map(item => (
                        <div 
                          key={item.id} 
                          className="dropdown-item"
                          onClick={() => selectSearchData(item)}
                        >
                          {item.location}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date Field */}
              <div className="form-field date-field">
                <div className="field-icon">
                  <i className="ri-calendar-line"></i>
                </div>
                <div className="field-input">
                  <label>Date of Journey</label>
                  <DatePicker
                    selected={(() => {
                      const [d, m, y] = storeLocation.date.split('/');
                      const today = new Date();
                      if (!d || !m || !y) return today;
                      return new Date(2000 + parseInt(y), parseInt(m) - 1, parseInt(d));
                    })()}
                    onChange={date => {
                      const day = String(date.getDate()).padStart(2, '0');
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const year = String(date.getFullYear()).slice(-2);
                      setStoreLocation(prev => ({ ...prev, date: `${day}/${month}/${year}` }));
                    }}
                    dateFormat="dd/MM/yy"
                    placeholderText="Select date"
                    minDate={new Date()}
                    className="date-picker-input"
                  />
                </div>
              </div>

              {/* Quick Date Buttons */}
              <div className="quick-date-buttons">
                <button className="date-button" onClick={handleToday}>
                  Today
                </button>
                <button className="date-button" onClick={handleTomorrow}>
                  Tomorrow
                </button>
              </div>
            </div>

            {/* Search Button */}
            <button 
              className="search-button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <i className="ri-search-line"></i>
                  Search Buses
                </>
              )}
            </button>
          </div>
        </div>

        {/* Popular Routes Section - RedBus style */}
        <div className="popular-routes-container">
          <div className="container">
            <h2 className="section-title">Popular Bus Routes in Assam</h2>
            <div className="popular-routes-grid">
              {popularRoutes.map(route => (
                <div 
                  key={route.id} 
                  className="route-card"
                  onClick={() => handlePopularRouteClick(route.from, route.to)}
                >
                  <div className="route-image" style={{ backgroundImage: `url(${route.image})` }}>
                    <div className="route-overlay"></div>
                    <div className="route-info">
                      <h3>{route.from} to {route.to}</h3>
                      <p>{route.duration} • From {route.price}</p>
                    </div>
                  </div>
                  <div className="route-footer">
                    <span>{route.operator}</span>
                    <button className="book-now-btn">Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assam Tourism Highlights */}
        <div className="tourism-highlights">
          <div className="container">
            <h2 className="section-title">Explore Assam's Treasures</h2>
            <div className="tourism-grid">
              {tourismHighlights.map(highlight => (
                <div key={highlight.id} className="tourism-card">
                  <div 
                    className="tourism-image" 
                    style={{ backgroundImage: `url(${highlight.image})` }}
                  >
                    <div className="tourism-overlay"></div>
                  </div>
                  <div className="tourism-content">
                    <h3>{highlight.title}</h3>
                    <p>{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="why-choose-us">
          <div className="container">
            <h2 className="section-title">Why Choose Assam Bus Travel?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <i className="ri-shield-check-line"></i>
                <h3>Safe Travel</h3>
                <p>GPS tracked buses with trained drivers</p>
              </div>
              <div className="feature-card">
                <i className="ri-24-hours-line"></i>
                <h3>24/7 Support</h3>
                <p>Always available customer care</p>
              </div>
              <div className="feature-card">
                <i className="ri-wallet-3-line"></i>
                <h3>Best Prices</h3>
                <p>Guaranteed lowest fares</p>
              </div>
              <div className="feature-card">
                <i className="ri-bus-line"></i>
                <h3>Modern Fleet</h3>
                <p>AC and Non-AC buses available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebIndex;