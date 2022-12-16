import './style.css'
import Rain from './images/rain.jpg'

const API_KEY = 'bd912bf06046730bb768e35c45a05452' // free plan idc

class Weather {
    constructor(rawJson) {
        this.temp = rawJson.main.temp
        this.tempMax = rawJson.main.temp_max
        this.tempMin = rawJson.main.temp_min
        this.humidity = rawJson.main.humidity
        this.feelsLike = rawJson.main.feels_like
        this.windSpeed = rawJson.wind.speed
        this.description = rawJson.weather.description
        this.rain = rawJson.rain['1h']
        this.iconURL = `http://openweathermap.org/img/wn/${rawJson.weather.icon}@2x.png`
    }

    static kelvinToCelcius(tempInKelvin) {
        return tempInKelvin - 273.15
    }

    static kelvinToFahrenheit(tempInKelvin) {
        return (tempInKelvin - 273.15) * 1.8 + 32
    }
}

const retrieveDataObject = async (cityQuery) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${API_KEY}`
    const response = await fetch(url, {mode:'cors'})
    const responseJson = await response.json()
    console.log(responseJson)
    return new Weather(responseJson)
}

retrieveDataObject.then(console.log)

