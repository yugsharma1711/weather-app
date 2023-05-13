import axios from 'axios'
import { useState } from 'react';
import { useEffect } from 'react';
import clear_morning from '../assets/clear_morning.jpg';
import clear_noon from '../assets/clear_noon.jpg'
import clouds_morning from '../assets/clouds_morning.jpg';
import clouds_night from '../assets/clouds_night.jpg';
import haze_morning from '../assets/haze_morning.jpg';
import haze_night from '../assets/haze_night.jpg';
import clear_night from '../assets/clear_night.jpg'
const Weather = ()=>{
    const [data, setData] = useState({});
    const [location, setLocation] = useState('');
    const [date, setDate] = useState();
    const [hour, setHour] = useState();
    var d = new Date((new Date().getTime()))
    const [background, setBackground] = useState(clear_morning);
    d = d.toISOString()
    const searchLocation = async (event) => {
        console.log(event.target.value);
        if (event.key === 'Enter') {
          await axios.get(`http://127.0.0.1:8000/api/fetchWeather/${event.target.value}/`).then((response) => {
            setData(response.data);
            console.log(response.data);
            // console.log(typeof response.data.timezone)
            const timezoneOffset = response.data.timezone * 1000;
            const updatedDate = new Date(Date.now() + timezoneOffset).toISOString();
            setDate(updatedDate)
            setHour(parseInt(updatedDate.slice(11, 14)))
          });
          setLocation('');
        }
      };
      useEffect(() => {
        updateBackground();
      }, [hour]);
      useEffect(() => {
        const interval = setInterval(() => {
          const currentTime = new Date();
          const updatedDate = new Date(currentTime.getTime() + (data.timezone * 1000)).toISOString();
          setDate(updatedDate);
        }, 1000);
    
        return () => {
          clearInterval(interval);
        };
      }, [data]);
      const updateBackground = () => {
        if (date && data.weather && data.weather.length > 0) {
          if (data.weather[0].main === 'Clear') {
            if(hour > 6 && hour < 12){
              setBackground(clear_morning)
            }
            else if(hour < 6){
              setBackground(clear_night);
            }
            else{
              console.log("Called")
              setBackground(clear_noon)
            }
          }
          else if(data.weather[0].main === 'Clouds'){
            console.log("Cloudy Weather")
            if (hour > 6 && hour < 18){
              setBackground(clouds_morning)
            }
            else{
              setBackground(clouds_night)
            }
          }
          else if(data.weather[0].main == 'Haze'){
            if (hour > 6 && hour < 18){
              setBackground(haze_morning)
            }
            else{
              setBackground(haze_night)
            }
          }

        }
      }
      const formatDate = (timeString) => {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        };
        return new Date(timeString).toLocaleDateString(undefined, options);
      };
    return (
        <div className='app'>
          <img src= {background} alt="" />
            <div className="search">
                <input
                value={location}
                onChange={event => setLocation(event.target.value)}
                onKeyPress={searchLocation}
                placeholder='Enter Location'
                type="text" />
            </div>
            <div className="container">
                {/* <Background weatherDescription = {data.weather ? data.weather[0].main : null} /> */}
                <div className="top">
                    <div className="location">
                        <p>{data.name} {data.sys ? <p style = {{'font-size' : '20px'}}>{data.sys.country}</p> : null}</p>
                        {date && (
                            <div>
                                Current Date: {formatDate(date)}
                                <br />
                                Current Time: {date.slice(11, 19)}
                                
                            </div>
                            )
                        }
                    </div>
                    <div className="temp">
                        {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
                    </div>
                    <div className="description">
                        {data.weather ? <p>{data.weather[0].main}</p> : null}
                    </div>
                </div>
                {data.name !== undefined &&
                <div className="bottom">
                    <div className="feels">
                        {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°C</p> : null}
                        <p>Feels Like</p>
                    </div>
                    <div className="humidity">
                        {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
                        <p>Humidity</p>
                    </div>
                    <div className="wind">
                        {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} KPH</p> : null}
                        <p>Wind Speed</p>
                    </div>
                </div>
        }
        </div>
    </div>
    );
}
export default Weather;