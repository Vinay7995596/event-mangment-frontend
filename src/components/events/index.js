import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './index.css'

const socket = io('https://event-managment-hfd8.onrender.com');

const Homepage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [filter, setFilter] = useState(null);

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
    navigate('/add')
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
    </div>
  );
};

export default Homepage;
