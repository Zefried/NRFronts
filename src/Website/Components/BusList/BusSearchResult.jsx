import React, { useEffect } from 'react';
import TestHeader from '../../TestCompo/TestHeader';
import './BusSearchResult.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthAction } from '../../../CustomStateManage/OrgUnits/AuthState';
import axios from 'axios';


const BusSearchResult = () => {

  const { state: data } = useLocation();
  const navigate = useNavigate();
  const {operator_id, parent_route} = AuthAction.getState('auth');
  
  const fetchFair = async () => {
    let payload = { operator_id:operator_id, parent_route:parent_route }
    const res = await axios.post('/api/fetch-fair', payload)
    console.log(res.data.data);
  }

  useEffect(()=>{
    fetchFair();
  },[])

  const to12Hour = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hr = hour % 12 || 12;
    return `${hr}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const toDuration = (min) => `${Math.floor(min / 60)}h ${min % 60}m`;

  const generateLayout = async (operator_id) => {
    const { date_of_journey, parent_route } = AuthAction.getState('auth');
    let payload = {
      type: 'generate',
      operator_id: operator_id,
      date: date_of_journey,
      parent_route: parent_route,
    };
    
    return await axios.post('/api/generate-layout', payload);
  };

  const handleNavigate = async (index) => {
    let operator_id = data[index]?.operator_id;
    const res = await generateLayout(operator_id);
    AuthAction.updateState({ operator_id: operator_id });
    
    if (res.data.status == 200) {
      navigate('/select-seat');
    }
  };

  return (
    <>
      <TestHeader />

      <div className="search-bus-section">
        <div className="location-header">
          <div className="container">
            {data.length > 0 ? (
              <div className="result-header">
                <h1 className="result-title">Bus Search Results</h1>
                <span className="result-count">{data.length} buses found</span>
              </div>
            ) : (
              <h1 className="result-title">No buses found</h1>
            )}
          </div>
        </div>

        <div className="container bus-results-container">
          <div className="results-wrapper">
            <div className="filters-panel">
              <h4 className="filters-title">Filter buses</h4>
              <div className="filters-divider"></div>
              <div className="filter-buttons">
                <button className="filter-btn">Seater</button>
                <button className="filter-btn">Sleeper</button>
                <button className="filter-btn">AC</button>
                <button className="filter-btn">Non AC</button>
              </div>
            </div>

            <div className="bus-listings">
              {data.map((item, index) => (
                <div className="bus-card" key={index} onClick={() => handleNavigate(index)}>
                  <div className="bus-card-header">
                    <div className="bus-info">
                      <div className="bus-meta">
                        <p className="bus-type">Operator</p>
                        <h3 className="bus-name">
                          {item.bus_name} {item.ac_status ? 'A/C' : 'Non A/C'} Seater
                        </h3>
                      </div>

                      <div className="bus-rating">
                        <div className="rating-badge">
                          <i className="ri-star-fill" /> 4.5
                        </div>
                        <span className="rating-count">241 reviews</span>
                      </div>
                    </div>

                    <div className="timing-info">
                      <div className="time-block">
                        <p className="time-label">Departure</p>
                        <p className="time-value">{to12Hour(item.boarding_time)}</p>
                        <span className="duration">{toDuration(item.estimated_duration)}</span>
                      </div>
                      <div className="time-divider">
                        <div className="route-line"></div>
                        <i className="ri-bus-2-line route-icon"></i>
                      </div>
                      <div className="time-block">
                        <p className="time-label">Arrival</p>
                        <p className="time-value">{to12Hour(item.dropping_time)}</p>
                        <span className="availability">Available</span>
                      </div>
                    </div>

                    <div className="price-info">
                      <p className="current-price">₹{item.fare.final}</p>
                      <span className="original-price">₹{item.fare.actual}</span>
                    </div>
                  </div>

                  <div className="bus-card-footer">
                    <div className="bus-actions">
                      <button className="action-link">
                        <i className="ri-map-pin-line"></i> Boarding Points
                      </button>
                      <button className="action-link">
                        <i className="ri-camera-line"></i> Bus Photos
                      </button>
                    </div>
                    <button className="view-seats-btn">
                      View Seats <i className="ri-arrow-right-line"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusSearchResult;