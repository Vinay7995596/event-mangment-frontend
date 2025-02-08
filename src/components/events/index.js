import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './index.css'
import * as React from 'react';
// import { Box } from '@mui/material';
// import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


const socket = io('https://event-managment-hfd8.onrender.com');

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};

const Homepage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [filter, setFilter] = useState(null);
  const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // Fetch events whenever the filter changes
    fetchEvents(filter);
    
    socket.on('attendee_updated', ({ eventId, attendees }) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, attendees } : event
        )
      );
    });

    return () => {
      socket.off('attendee_updated');
    };
  }, [filter]);

  const fetchEvents = (filterValue) => {
    let query = '';
    if (filterValue) {
      switch (filterValue) {
        case 'Yesterday':
          query = 'date=yesterday';
          break;
        case 'Today':
          query = 'date=today';
          break;
        case 'Tomorrow':
          query = 'date=tomorrow';
          break;
        default:
          query = ''; // For custom calendar dates
      }
    }

    fetch(`https://event-managment-hfd8.onrender.com/api/events${query ? `?${query}` : ''}`, {
      headers: { Authorization: `${localStorage.getItem('token')}` },
    })
      .then((response) => response.json())
      .then(setEvents)
      .catch((error) => console.error('Error fetching events:', error));
  };

  const handleJoinEvent = (eventId) => {
    setCurrentEventId(eventId);
    fetch(`https://event-managment-hfd8.onrender.com/api/events/${eventId}/attendees`, {
      method: 'POST',
      headers: { Authorization: `${localStorage.getItem('token')}` }
    });
    navigate('/view');
    localStorage.setItem('eventId', eventId);
  };

  const filterChange = (e) => {
    setFilter(e.target.value);
  };

  const addingButton = () => {
    const isGuest = localStorage.getItem('guest')
    if (isGuest) {
      setOpen(true)
    } else {
      navigate('/add')
    }
  }

  const username = localStorage.getItem('username');

  return (
    <div className="homepage">
      <h1 className="homepage-title">Events Dashboard of {username}</h1>
      <div>
        <select className="filter-select" onChange={filterChange}>
          <option value="Yesterday">Yesterday</option>
          <option value="Today">Today</option>
          <option value="Tomorrow">Tomorrow</option>
          <option value="Custom">Choose calendar</option>
        </select>
      </div>
      <div><button onClick={addingButton}>Add</button></div>
      {events.map((event) => (
        <div key={event._id} className="event-card">
          <h2 className="event-name">{event.name}</h2>
          <p className="event-description">{event.description}</p>
          <p className="attendees-info">Attendees: {event.attendees.length}</p>
          <button className="join-button" onClick={() => handleJoinEvent(event._id)}>
            Join {event.name}
          </button>
        </div>
      ))}
      <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} borderRadius="15px">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Login
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please Login .
          </Typography>
        </Box>
      </Modal>
    </div>
    </div>
  );
};

export default Homepage;
