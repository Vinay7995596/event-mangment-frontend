import axios from "axios";
import { useNavigate } from "react-router-dom";

const Viewvides = () => {
    const navigate= useNavigate()
const currentEventId = localStorage.getItem('eventId')
const userId = localStorage.getItem('username')
const checkingdata = () => {
    console.log('after clicks', currentEventId, userId)
}
    // const handleLeaveEvent = async () => {
    //     const payload = {
    //         currentEventId, userId
    //     }
    //       const response = await axios.post(`http://localhost:5500/api/events/${currentEventId}/leave`,payload, {
    //         headers: { Authorization: localStorage.getItem('token') }
    //       });

    //       if (response.status === 200) {
    //         localStorage.setItem('eventId', null)
    //         navigate('/home')
    //       }
    //   };
    const handleLeaveEvent = async () => {
        const currentEventId = localStorage.getItem('eventId');
        if (!currentEventId) return;
      
        try {
          const response = await axios.post(
            `https://event-managment-hfd8.onrender.com/api/events/${currentEventId}/leave`,
            {}, // no need for payload, user is authenticated with token
            {
              headers: { Authorization: `${localStorage.getItem('token')}` },
            }
          );
      
          if (response.status === 200) {
            navigate('/home');
          }
        } catch (error) {
          console.error('Error leaving event:', error);
        }
      };
      
    return (
        <>
        <div>
            <h2>This is demo video</h2>
            <button onClick={handleLeaveEvent}>exit</button>
            <button onClick={checkingdata}>clicks me</button>
        </div>
        </>
    )
}

export default Viewvides