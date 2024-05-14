// src/components/RoomForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomForm = ({ room, hostels, onSubmit }) => {
  const [roomNumber, setRoomNumber] = useState(room ? room.roomNumber : '');
  const [type, setType] = useState(room ? room.type : '');
  const [capacity, setCapacity] = useState(room ? room.capacity : '');
  const [remainingBeds, setRemainingBeds] = useState(room ? room.remainingCapacity : '');
  const [hostelId, setHostelId] = useState(room ? room.hostelId : '');
  const [price, setPrice] = useState(room ? room.price : '');
  const [error, setError] = useState('');
  const [existingRoomNumbers, setExistingRoomNumbers] = useState([]);

  useEffect(() => {
    axios.get('https://beiyo-admin.vercel.app/api/rooms')
      .then(response => {
        const roomNumbers = response.data.map(room => room.roomNumber);
        setExistingRoomNumbers(roomNumbers);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomNumber || !type || !capacity || !remainingBeds || !hostelId || !price) {
      setError('Please fill out all fields.');
      return;
    }

  
      // setError('Room number already exists. Please choose a different room number.');
      // return;
      if (roomNumber.hostelId === hostelId) {
        if (existingRoomNumbers.includes(roomNumber)) {
        setError('Room number already exists in the same hostel. Please choose a different room number.');
        return;
      }
    }

    const data = {
      roomNumber,
      type,
      capacity,
      remainingCapacity: remainingBeds,
      hostelId,
      price,
      hostel: hostels.find(hostel => hostel._id === hostelId).name
    };
    if (room) {
      await axios.patch(`https://beiyo-admin.vercel.app/api/rooms/${room._id}`, data);
    } else {
      await axios.post('https://beiyo-admin.vercel.app/api/rooms', data);
    }
    onSubmit();
  };

  return (
    <div>
      <h2>{room ? 'Update Room' : 'Add Room'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Room Number:
          <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
        </label>
        <label>
          Price:
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
            <option value="triple">Flat</option>
          </select>
        </label>
        <label>
          Capacity:
          <select value={capacity} onChange={(e) => setCapacity(e.target.value)}>
            <option value="">Select Capacity</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="3">4</option>
            {/* Add more capacity options as needed */}
          </select>
        </label>
        <label>
          Remaining Beds:
          <select value={remainingBeds} onChange={(e) => setRemainingBeds(e.target.value)}>
            <option value="">Select Remaining Beds</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <label>
          Hostel:
          <select value={hostelId} onChange={(e) => setHostelId(e.target.value)}>
            <option value="">Select Hostel</option>
            {hostels.map(hostel => (
              <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">{room ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
};

export default RoomForm;
