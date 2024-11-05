import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
const APIkey = 'bf841e6dbed764104fe4b239144230a7';

function App() {

  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [finder, setFinder] = useState();
  const [hasError, setHasError] = useState(false);

  
  const success = position => {
    console.log(position);
    const obj = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    }
    setCoords(obj);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  useEffect(() => {
    if (coords) {
   // const url = 'https://randomuser.me/api/';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${APIkey}`;
    axios.get(url)
      .then(res => {
        const obj = {
          celcius: (res.data.main.temp - 273.15).toFixed(2),
          fahrenheit: ((res.data.main.temp - 273.15) * (9/5) + 32).toFixed(2),
        }
        setTemp(obj);
        setHasError(false);
        setWeather(res.data)
      })
      .catch(err => {
        setHasError(true);
        console.log(err);
      })
      .finally(()=>{
        setIsLoading(false);
      })
    }
  }, [coords]);

  useEffect(() => {
    if (textInput){
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${APIkey}` ;
    axios.get(url)
      .then(res => {
        const obj = {
          celcius: (res.data.main.temp - 273.15).toFixed(2),
          fahrenheit: ((res.data.main.temp - 273.15) * (9/5) + 32).toFixed(2),
        }
        setTemp(obj);
        setHasError(false);
        setFinder(res.data)
      })
      .catch(err => {
        setHasError(true);
        console.log(err);
      });
    } 
  }, [textInput]);
  
  console.log(finder);
  
  return (
   <div className='app'>
      {
        isLoading?
          <h2>Loading...</h2>
          :
            textInput ?
            <WeatherCard
              weather={finder}
              temp={temp}
              setTextInput={setTextInput}
              hasError={hasError}
            /> 
            :
            <WeatherCard
              weather={weather}
              temp={temp}
              setTextInput={setTextInput}
              hasError={hasError}
            />  
      }     
   </div>
  )
}

export default App;
