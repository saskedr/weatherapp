let weather = {
    appKey: "e2f542b9ebf7655160e395182d0428d1",
    fetchWeather: function (city) {
        document.querySelector(".info-txt").innerText = "Получаем данные о погоде...";
        document.querySelector(".info-txt").classList.add("pending");
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&lang=ru&appid=" +
            this.appKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    fetchCoords: function (lon, lat) {
        document.querySelector(".info-txt").innerText = "Получаем данные о погоде...";
        document.querySelector(".info-txt").classList.add("pending");
        let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=e2f542b9ebf7655160e395182d0428d1`;
        fetch(api)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
        },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, feels_like } = data.main;
        const { speed } = data.wind;
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
    search: function (name) {
        this.fetchWeather(name);
    },
    onError: function (error) {
        document.querySelector(".info-txt").innerText = error.message;
        document.querySelector(".info-txt").classList.remove("pending");
        document.querySelector(".info-txt").classList.add("error");
    },
    onSuccess: function (position) {
        const {latitude, longitude} = position.coords;
        weather.fetchCoords(longitude, latitude)
        }
};
    
document.querySelector(".search button").addEventListener("click", function () {
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