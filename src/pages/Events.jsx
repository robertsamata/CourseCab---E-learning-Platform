import { useEffect, useState } from 'react';
import Layout from "../components/Layout";

function Events() {
  const [events, setEvents] = useState([]);
  const getImageLink = (imageName) => `/api/static/images/events/${imageName}`;

  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => setEvents(data.events))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

   // Inline styles for hiding the scrollbar
   const hiddenScrollbarStyle = {
    overflowY: 'auto',
    scrollbarWidth: 'none', /* For Firefox */
    msOverflowStyle: 'none'  /* For Internet Explorer 10+ */
  };

  // Style for webkit browsers like Chrome and Safari
  const webkitScrollbarStyle = {
    '&::-webkit-scrollbar': {
      display: 'none' /* For Chrome, Safari, and Opera */
    }
  };
  
  return (
    <Layout>
      <div className="page-container text-white text-center bg-gray-800 bg-opacity-40 justify-center h-full" style={{ padding: '4rem 10rem', ...hiddenScrollbarStyle, ...webkitScrollbarStyle, marginRight: '15%', marginLeft: '15%' }}>
        
        {events.map(events => (
           <div key={events.id} className="event-item flex flex-col md:flex-row items-center md:items-start p-4 border-b mb-10">
           <div className="flex-1">
             <h3 className="text-xl font-bold mb-10">{events.name}</h3>
             <p className="mt-auto ">{events.description}</p>
           </div>
          <div className="w-full md:w-40 lg:w-60 flex-shrink-0 mt-2 md:mt-0 " >
             <img
               className="h-full w-full object-cover ml-10"
               alt={`Image of ${events.name}`}
               src={getImageLink(events.picture)}
               onError={(e) => {
                 if (e.target.src !== getImageLink("default.png")) {
                   e.target.onerror = null;
                   e.target.src = getImageLink("default.png");
                 }
               }}
             />
            <div className="text-sm mt-4 ml-20">
              <p className="mt-10 mb-4 text-gray-500">{events.address}</p>
              <p><strong>Start:</strong> {new Date(events.start_date).toLocaleDateString()}</p>
              <p><strong>End:</strong> {events.end_date ? new Date(events.end_date).toLocaleDateString() : 'TBD'}</p>
            </div>
          </div>
         </div>
        ))}
      </div>
    </Layout>
  );
}

export default Events;

