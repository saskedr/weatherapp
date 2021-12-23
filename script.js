let weather = {
    appKey: "e2f542b9ebf7655160e395182d0428d1",
    fetchWeather: async function (city) {
        let success = true
        document.querySelector(".info-txt").innerText = "Получаем данные о погоде...";
        await document.querySelector(".info-txt").classList.add("pending");
        await fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
                city +
                "&units=metric&lang=ru&appid=" +
                this.appKey
            )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data))
            .catch(() => {weather.onError(); success = false})
        if (success){
            document.querySelector(".info-txt").classList.remove("pending");
            document.querySelector(".info-txt").classList.remove("error");
        }
    },
    fetchCoords: function (lon, lat) {
        let success = true
        document.querySelector(".info-txt").innerText = "Получаем данные о погоде...";
        document.querySelector(".info-txt").classList.add("pending");
        let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=e2f542b9ebf7655160e395182d0428d1`;
        fetch(api)
            .then((response) => response.json())
            .then((data) => this.displayWeather(data))
            .catch(() => {weather.onError(); success = false})
        if (success){
            document.querySelector(".info-txt").classList.remove("pending");
            document.querySelector(".info-txt").classList.remove("error");
        }
    },
    fetchWeek: async function (city) {
        let lat, lon
        await fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
                city +
                "&units=metric&lang=ru&appid=" +
                this.appKey
            )
            .then((response) => response.json())
            .then(data => {
                lat = data.coord.lat
                lon = data.coord.lon
            })
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&lang=ru&appid=${this.appKey}`)
        .then((response) => response.json())
        .then((data) => this.displayForecast(data))
    },
    displayWeather: function (data) {
        const {name} = data;
        const {icon,description} = data.weather[0];
        const {temp,humidity,feels_like} = data.main;
        const {speed} = data.wind;
        document.querySelector(".city").innerText = "Погода в " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp.toFixed(1) + "°C";
        document.querySelector(".humidity").innerText = "Влажность: " + humidity + "%";
        document.querySelector(".wind").innerText = "Скорость ветра: " + speed.toFixed(1) + " м/с";
        document.querySelector(".feels_like").innerText = "Ощущается как " + feels_like.toFixed(1) + "°C";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1980x1080/?" + name + "')"
    },
    displayForecast: function (data) {
        const days = [...data.daily]
        const longWeekdays = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
        const shortWeekdays = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]
        let htmlCode = ``
        days.forEach((el, index) => {
            const temp = Math.round(el.temp.day)
            const icon = el.weather[0].icon
            const d = new Date()
            let day = (d.getDay() + index + 1) % 7
            htmlCode += `<div class="day"><p class="shortDay">${shortWeekdays[day]}</p><p class="longDay">${longWeekdays[day]}</p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="">
            <p class="temp">${temp}°C</p>
        </div>`
        })
        document.querySelector('.forecast').innerHTML = "<h1>Прогноз</h1>" + htmlCode
        document.querySelector('.forecast').style.display = 'grid'
    },
    search: function (name) {
        this.fetchWeather(name);
        this.fetchWeek(name)
    },
    onError: function (error) {
        document.querySelector(".info-txt").innerText = "Не удалось получить данные 😞";
        document.querySelector(".info-txt").classList.remove("pending");
        document.querySelector(".info-txt").classList.add("error");
    },
    onSuccess: function (position) {
        const {
            latitude,
            longitude
        } = position.coords;
        weather.fetchCoords(longitude, latitude)
    }
};

document.querySelector(".search_button").addEventListener("click", function () {
    weather.search(document.querySelector(".search-bar").value);
})

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search(document.querySelector(".search-bar").value);
    }
})

document.querySelector('.location_button').addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(weather.onSuccess, weather.onError);
    } else {
        alert("Твой браузер не поддерживает поиск по геолокации :(")
    };
})
