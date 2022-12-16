
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
    }

    getTemp() {
        return this.temp
    }

    getTempMax() {
        return this.tempMax
    }


    #kelvinToCelcius(tempInKelvin) {
        return tempInKelvin - 273.15
    }

    #kelvinToFahrenheit(tempInKelvin) {
        return (tempInKelvin - 273.15) * 1.8 + 32
    }
}

const retrieveDataObject = async (cityQuery) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${API_KEY}`
    const response = await fetch(url, {mode:'cors'})
    const responseJson = await response.json()
    return new Weather(responseJson)
}
