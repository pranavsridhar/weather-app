import React, { useEffect, useState } from 'react';

function WeatherApp() {
  const [data, setData] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (lat, long) => {
    if (lat < -90 || lat > 90)
    {
      setError("Latitude must be between -90 to 90 degrees N");
      return;
    }
    if (long < -180 || long > 180)
    {
      setError("Longitude must be between -180 to 180 degrees E");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago&forecast_days=1`);
      const data = await response.json();
      console.log(data); 
      setData(data);
      setError(null); 
    } catch (error) {
      console.error("Error fetching data from API", error);
      setError(error.toString()); 
    }
    setIsLoading(false);
  };

  const handleFetch = () => {
    fetchData(latitude, longitude);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      fetchData(position.coords.latitude, position.coords.longitude);
      setIsLocationLoading(false);
    });
  }, []);

  if (isLoading || isLocationLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Today's Weather</h1>
      <input type="text" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Enter latitude" />
      <input type="text" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Enter longitude" />
      <button onClick={handleFetch}>Submit</button>
      <button onClick={() => fetchData(32.78, -96.8)}>Dallas</button>
      <button onClick={() => fetchData(30.27, -97.73)}>Austin</button>
      <button onClick={() => fetchData(29.76, -95.4)}>Houston</button>
      {
       <div>
        {data && data.hourly && data.hourly.time.map((time, index) => {
          const day = new Date(time);
          const dateTime = day.toLocaleTimeString();

          return (
            <div key={time}>
              <p>{dateTime}: {data.hourly.temperature_2m[index]} {data.hourly_units.temperature_2m}</p>
            </div>
                );
              })}
              </div> }
            </div>
          );
        }

export default WeatherApp;
