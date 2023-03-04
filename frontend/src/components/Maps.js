import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { AiFillStar } from 'react-icons/ai';
import { format } from 'timeago.js';
import { Room } from '@mui/icons-material';
import Register from './Register';
import Login from './Login';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../style/maps.css';

const Maps = () => {
  const storage = window.localStorage;
  const [currentUser, setCurrenUser] = useState(storage.getItem('user'));
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [rating, setRating] = useState(0);
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [viewport, setViewport] = useState({
    longitude: 106.816666,
    latitude: -6.2,
    zoom: 9,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/pins');
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getPins();
  }, []);

  const handlerMarker = (id, long, lat) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, longitude: long, latitude: lat });
  };

  const handlerNewPlace = (e) => {
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;
    setNewPlace({ lng, lat });
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    };

    try {
      const res = await axios.post('/pins', newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handlerLogout = () => {
    storage.removeItem('user');
    setCurrenUser(null);
  };

  return (
    <Map
      initialViewState={viewport}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{ height: '100vh' }}
      onDblClick={handlerNewPlace}
    >
      {pins.map((pin) => (
        <div key={pin._id}>
          <Marker longitude={pin.long} latitude={pin.lat} anchor="bottom">
            <Room
              style={{
                fontSize: 40,
                color: pin.username === currentUser ? '#2a9134' : 'tomato',
                cursor: 'pointer',
              }}
              onClick={() => handlerMarker(pin._id, pin.long, pin.lat)}
            />
          </Marker>

          {pin._id === currentPlaceId && (
            <Popup
              longitude={pin.long}
              latitude={pin.lat}
              anchor="left"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              maxWidth="300px"
            >
              <div>
                <div className="place">
                  <p className="title">Place</p>
                  <p className="desc">{pin.title}</p>
                </div>
                <div className="review">
                  <p className="title">Review</p>
                  <p className="desc">{pin.desc}</p>
                </div>
                <div className="rating">
                  <p className="title">Rating</p>
                  <div className="stars">
                    {Array(pin.rating).fill(<AiFillStar />)}
                  </div>
                </div>
                <div className="information">
                  <p className="title">Information</p>
                  <p className="desc">
                    Created by <span className="username">{pin.username}</span>
                  </p>
                  <p>{format(pin.createdAt)}</p>
                </div>
              </div>
            </Popup>
          )}
        </div>
      ))}
      {newPlace && (
        <Popup
          longitude={newPlace.lng}
          latitude={newPlace.lat}
          anchor="left"
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handlerSubmit}>
              <div className="form_input">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter your title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form_input">
                <label>Review</label>
                <textarea
                  rows="4"
                  cols="30"
                  placeholder="Enter your review"
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <div className="form_input">
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <button type="submit">Add Pin</button>
            </form>
          </div>
        </Popup>
      )}
      <div className="buttons">
        {currentUser ? (
          <button className="btnLogout" onClick={handlerLogout}>
            Logout
          </button>
        ) : (
          <>
            <button className="btnLogin" onClick={() => setLogin(true)}>
              Login
            </button>
            <button className="btnRegister" onClick={() => setRegister(true)}>
              Register
            </button>
          </>
        )}
      </div>
      {register && <Register closeRegister={setRegister} />}
      {login && (
        <Login
          closeLogin={setLogin}
          storage={storage}
          currentUser={setCurrenUser}
        />
      )}
    </Map>
  );
};

export default Maps;
