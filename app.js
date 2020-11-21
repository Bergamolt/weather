'use strict';

const keyAPI = "7a8744f3c3msh650ff5fb9561771p1114d9jsncd0d29ea95ad";
let cityName = '';

const searchWeather = document.querySelector('#searchWeather');
const days = document.querySelectorAll('.day');


const iconsWeather = {
    '01d': './images/icons/icon-2.svg',
    '02d': './images/icons/icon-3.svg',
    '03d': './images/icons/icon-5.svg',
    '04d': './images/icons/icon-6.svg',
    '09d': './images/icons/icon-9.svg',
    '10d': './images/icons/icon-10.svg',
    '11d': './images/icons/icon-11.svg',
    '13d': './images/icons/icon-14.svg',
    '50d': './images/icons/icon-8.svg',
}

const backgroundImages = {
    fall: [
        './images/fall-00.jpg',
        './images/fall-01.jpg',
        './images/fall-02.jpg',
        './images/fall-03.jpg',
    ],
    winter: [
        './images/winter-00.jpg',
        './images/winter-01.jpg',
        './images/winter-02.jpg',
        './images/winter-03.jpg',
    ],
    spring: [
        './images/spring-00.jpg',
        './images/spring-01.jpg',
        './images/spring-02.jpg',
        './images/spring-03.jpg',
    ],
    summer: [
        './images/summer-00.jpg',
        './images/summer-01.jpg',
        './images/summer-02.jpg',
        './images/summer-03.jpg',
    ]
};

const randomNum = Math.floor(Math.random() * (4 - 0) + 0);
console.log(randomNum);
document.querySelector('.hero').style.backgroundImage = `url(${backgroundImages
    .fall[randomNum]})`;

const getDayWeek = () => {
    const day = new Date().getDay();
    const date = new Date().toLocaleDateString('ru', {
        day: 'numeric',
        month: 'long',
    });

    const dayWeek = [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота"
    ];

    const newDayWeek = [...dayWeek.slice(day), ...dayWeek.splice(0, day)];

    days.forEach((day, i) => {
        day.textContent = newDayWeek[i];
    });
    document.querySelector('.date').textContent = date;

};

getDayWeek();

if (localStorage.getItem('location') !== null) {
    const city = localStorage.getItem('location');
    currentWeather(city, keyAPI);
}

function currentWeather(city, key) {
    console.log(city);
    fetch(`https://community-open-weather-map.p.rapidapi.com/weather?q=${city}&lang=ru&units=metric`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": key,
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.cod === '404') {
                alert(data.message);
                return;
            } else {
                addWeatherCurrent(data, city);
                localStorage.setItem('location', city);
            }
        })
        .catch(error => console.error(error))

    fetch(`https://community-open-weather-map.p.rapidapi.com/forecast/daily?q=${city}&cnt=7&units=metric`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": key,
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.cod === '404') {
                return;
            } else {
                addWeatherInWeek(data)
            }
        })
        .catch(error => console.error(error))
}

const addWeatherInWeek = (data) => {

    document.querySelector('#pop').innerHTML =
         `<img src="images/icon-umberella.png" alt="">${data.list[0].pop * 100}%`;

    const maxTempDay = document.querySelectorAll('#maxtemp');
    maxTempDay.forEach((day, i) => {
        day.innerHTML = Math.round(data.list[i++].temp.max) + '<sup>o</sup>C';
    });

    const minTempDay = document.querySelectorAll('#mintemp');
    minTempDay.forEach((day, i) => {
        day.innerHTML = Math.round(data.list[i++].temp.min) + '<sup>o</sup>C';
    });

    const icons = document.querySelectorAll('#icon');

    icons.forEach((icon, i) => {
        if (i > 0) {
            icon.src = iconsWeather[data.list[i].weather[0].icon];
        }
    })
};

const addWeatherCurrent = (data, city) => {
    document.querySelector('#location').textContent = city;

    document.querySelector('#windSpeed').innerHTML = `
            <img src="images/icon-wind.png" alt="">${data.wind.speed}м/cек
        `;
    document.querySelector('#temp').innerHTML = Math.round(data.main.temp) + '<sup>o</sup>C';
    console.log(data.weather[0].icon)
    document.querySelector('#icon').src = iconsWeather[data.weather[0].icon];
};



searchWeather.addEventListener('submit', (e) => {
    e.preventDefault();

    cityName = document.querySelector('#nameCity').value;
    currentWeather(cityName, keyAPI);
    document.querySelector('#nameCity').value = '';
});


