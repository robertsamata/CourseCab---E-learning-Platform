import Layout from "../components/Layout";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Locations() {
  const [locations, setLocations] = useState([]);
  const { type } = useParams();
  const getImageLink = (imageName) => `/api/static/images/locations/${imageName}`;

  useEffect(() => {
    if (type) {
      fetch(`/api/locations/${type}`)
        .then(response => response.json())
        .then(data => setLocations(data.locations))
        .catch(error => console.error('Error fetching locations:', error));
    }
  }, [type]);

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
      <div className="locations-container text-white text-center bg-gray-800 bg-opacity-40 justify-center h-full" style={{ padding: '4rem 10rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ ...hiddenScrollbarStyle, ...webkitScrollbarStyle, flex: 1, marginTop: '2rem', marginBottom: '2rem' }}>
          {locations.map(location => (
            <div key={location.id} className="page-item flex mt-2" style={{ margin: '20px 0' }}>
              <div className="image-container w-1/3">
                <img
                    className="h-full w-full object-cover"
                    alt={`Image of ${location.name}`}
                    src={getImageLink(location.picture)}
                    onError={(e) => {
                      if (e.target.src !== getImageLink("default.png")) {
                        e.target.onerror = null;
                        e.target.src = getImageLink("default.png");
                      }
                    }}
                />
              </div>
              <div className="text-container flex-1 ml-4 h-1/3">
                <h3 className="text-xl" style={{ fontSize: '24px', marginBottom: '20px' }}>{location.name}</h3>
                <p style={{ margin: '0 40px', fontSize: '16px' }}>{location.description}</p>
            </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Locations;
