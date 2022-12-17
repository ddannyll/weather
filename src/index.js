import './style.css'
import { DateTime } from "luxon"
import { createClient } from 'pexels'
import Rain from './images/rain.jpg'

const backgroundCache = {}

const API_KEY = 'bd912bf06046730bb768e35c45a05452' // free plan idc
const pexelsClient = createClient('563492ad6f91700001000001b6d9c1fa4e1448ca970a28099190f95d')

const backgroundScale = 1.1

let timeInterval

class Weather {
    constructor(rawJson) {
        this.temp = rawJson.main.temp
        this.description = rawJson.weather[0].description.split(' ')
                           .map((w) => w[0].toUpperCase() + w.substring(1)).join(' ')
        this.mainDescription = rawJson.weather[0].main
        this.location = rawJson.name
        this.timezone = rawJson.timezone
        this.iconURL = `http://openweathermap.org/img/wn/${rawJson.weather[0].icon}@2x.png`
    }

    static kelvinToCelcius(tempInKelvin) {
        return tempInKelvin - 273.15
    }

    static kelvinToFahrenheit(tempInKelvin) {
        return (tempInKelvin - 273.15) * 1.8 + 32
    }
}

const background = document.getElementById('background')
document.body.addEventListener('mousemove', (e) => {
    const maxTranslation = (backgroundScale - 1) / 2
    const middleX = window.innerWidth / 2
    const middleY = window.innerHeight / 2
    const translateX = -100 * (e.clientX - middleX) / middleX * maxTranslation
    const translateY = -100 * (e.clientY - middleY) / middleY * maxTranslation
    background.style.transform = `translateX(${translateX}%) translateY(${translateY}%) scale(${backgroundScale})`
})

document.body.addEventListener('mouseout', () => {
    background.style.transform = ''
})

const retrieveWeatherObject = async (cityQuery) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${API_KEY}`
    const response = await fetch(url, {mode:'cors'})
    if (!response.ok) {
        throw new Error('Failed to search')
    }
    const responseJson = await response.json()
    console.log(responseJson);
    return new Weather(responseJson)
}

const buildWeatherCard = (weather) => {
    console.log(weather);
    const tempElem = document.getElementById('temp')
    const locationElem = document.getElementById('location')
    const timeElem = document.getElementById('time')
    const iconElem = document.getElementById('icon')
    const descriptionElem = document.getElementById('description')
    tempElem.innerText = `${Math.round(Weather.kelvinToCelcius(weather.temp))}°`
    locationElem.innerText = `${weather.location}`
    clearInterval(timeInterval)
    const formatTime = (timezone) => {
        return DateTime.now().setZone('utc').plus({second:timezone}).toFormat('T - cccc, d LLL yy')
    }
    timeElem.innerText = formatTime(weather.timezone)
    timeInterval = setInterval(() => {
        timeElem.innerText = formatTime(weather.timezone)
        1000
    })
    iconElem.src = weather.iconURL
    timeElem.innerText = time
    descriptionElem.innerText = weather.description
}

const setBackground = async (search) => {
    if (!localStorage.getItem(search)) {
        const response = await pexelsClient.photos.search({query:search, orientation: 'landscape', per_page:5})
        console.log('pexels', search);
        const photoURLs = response.photos.map(photo => photo.src.large2x)
        console.log(photoURLs);
        localStorage.setItem(search, JSON.stringify(photoURLs))
    } 
    const photoList = JSON.parse(localStorage.getItem(search))
    const photo = photoList[Math.floor(Math.random() * photoList.length)]
    background.style.backgroundImage = `url(${photo})`
    
}

const searchForm = document.getElementById('search')
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchQuery = searchForm.querySelector('input').value
    retrieveWeatherObject(searchQuery)
    .then((weather) => {
        buildWeatherCard(weather)
        setBackground(weather.mainDescription)
    })
    .catch(console.err)
})

retrieveWeatherObject('sydney').then((weather) => {
    buildWeatherCard(weather)
    setBackground(weather.mainDescription) 
})

