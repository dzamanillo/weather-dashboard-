var saveCitiesEl = document.querySelector("#saved-cities");
var searchBtnEl = document.querySelector("#search-btn");
var searchAreaEl = document.querySelector("#city-search-area");
var selectedCityEl = document.querySelector("#selected-city-stats");
var forecastContainerEl = document.querySelector("#forecast-container");
var cityName;
var lat;
var lon;

// Get or create "cities" in local storage
var cities = JSON.parse(localStorage.getItem("cities")) || [];

//* Function Build buttons from cities local storage
var buildMenu = function () {
	for (var i = 0; i < cities.length; i++) {
		var cityBtn = document.createElement("button");
		cityBtn.setAttribute("class", "btn btn-secondary w-100 mb-2");
		cityBtn.setAttribute("value", cities[i]);
		cityBtn.setAttribute("data-btn", "city");
		cityBtn.textContent = cities[i];

		saveCitiesEl.append(cityBtn);
	}
};

//* Remove Children Function
function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

//* Get City Name Function
var getCityName = function (event) {
	if (event.target.dataset.btn === "city") {
		var clickedCityName = event.target.value;

		cityName = clickedCityName;
	}
};

//* City Fetch Function
var cityFetch = function () {
	var apiUrl =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		cityName +
		"&units=imperial&appid=393222282915c98d946ff653251f7404";

	fetch(apiUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			removeAllChildNodes(selectedCityEl);

			selectedCityEl.setAttribute("class", "row border border-dark");

			// City
			var city = data.name;
			var selectedCityTitle = document.createElement("h2");
			selectedCityTitle.textContent = city;
			selectedCityTitle.setAttribute("id", "selected-city-title");

			// Date
			var date = moment().format("M/DD/YYYY");
			var selectedCityDate = document.createElement("span");
			selectedCityDate.innerHTML = " (" + date + ") ";

			//Icon
			var icon = data.weather[0].icon;

			var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

			var selectedCityIcon = document.createElement("img");
			selectedCityIcon.setAttribute("src", iconUrl);
			selectedCityIcon.setAttribute("alt", "weather icon");
			selectedCityIcon.setAttribute("id", "today-weather-icon");

			// Temp
			var temp = data.main.temp;
			var selectedCityTemp = document.createElement("p");
			selectedCityTemp.innerHTML = "Temp: " + temp;

			// Wind
			var wind = data.wind.speed;
			var selectedCityWind = document.createElement("p");
			selectedCityWind.innerHTML = "Wind: " + wind;

			//Humidity
			var humidity = data.main.humidity;
			var selectedCityHumidity = document.createElement("p");
			selectedCityHumidity.innerHTML = "Humidity: " + humidity;

			lat = data.coord.lat;
			lon = data.coord.lon;

			selectedCityTitle.append(selectedCityDate, selectedCityIcon);

			selectedCityEl.append(
				selectedCityTitle,
				selectedCityTemp,
				selectedCityWind,
				selectedCityHumidity
			);
			forecastFetch();
		});
};

// * Forecast Fetch Function
var forecastFetch = function () {
	console.log(lat, lon);

	var apiUrl =
		"https://api.openweathermap.org/data/2.5/onecall?lat=" +
		lat +
		"&lon=" +
		lon +
		"&units=imperial&exclude=minutely,hourly,alerts&appid=393222282915c98d946ff653251f7404";

	console.log(apiUrl);

	fetch(apiUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);

			removeAllChildNodes(forecastContainerEl);

			// TODO UV Index
			var uvIndex = data.current.uvi;
			var selectedCityUvIndex = document.createElement("p");
			selectedCityUvIndex.innerHTML = "UV Index: " + uvIndex;

			selectedCityEl.append(selectedCityUvIndex);

			var forecastTitle = document.createElement("h4");
			forecastTitle.textContent = "5-Day Forecast:";

			forecastContainerEl.append(forecastTitle);

			// Cards
			for (var i = 1; i < 6; i++) {
				var card = document.createElement("div");
				card.setAttribute("class", "col card text-light m-1");

				var cardBody = document.createElement("div");
				cardBody.setAttribute("class", "card-body p-1");

				//Date
				var cardDate = document.createElement("h4");
				var date = moment(data.daily[i].dt, "X").format("M/DD/YYYY");
				cardDate.textContent = date;

				// Icon
				var cardIcon = document.createElement("img");
				icon = data.daily[i].weather[0].icon;
				console.log(icon);
				iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
				cardIcon.setAttribute("src", iconUrl);
				cardIcon.setAttribute("alt", "weather icon");
				cardIcon.setAttribute("class", "card-icon");

				// Temp
				cardTemp = document.createElement("p");
				var temp = data.daily[i].temp.day;
				cardTemp.textContent = "Temp: " + temp + "°F";

				// Wind
				cardWind = document.createElement("p");
				var wind = data.daily[i].wind_speed;
				cardWind.textContent = "Wind: " + wind + " MPH";

				//Humidity
				cardHumidity = document.createElement("p");
				var humidity = data.daily[i].humidity;
				cardHumidity.textContent = "Humidity: " + humidity + "%";

				cardBody.append(cardDate, cardIcon, cardTemp, cardWind, cardHumidity);
				card.append(cardBody);
				forecastContainerEl.append(card);
			}
		});
};

//* Saved City Button Handler Function
var savedCityBtnHandler = function (event) {
	getCityName(event);
	cityFetch();
};

//@ Search Button Adds Value to "cities" Local Storage
//@ Also builds main area
searchBtnEl.addEventListener("click", function () {
	if (!searchAreaEl.value) {
		alert("Please Enter a City");
		return;
	} else {
		saveCitiesEl.innerHTML = "";
		console.log(searchAreaEl.value);

		// Push protect
		if (cities.indexOf(searchAreaEl.value) === -1) {
			cities.push(searchAreaEl.value);
		}

		removeAllChildNodes(selectedCityEl);
		cityName = searchAreaEl.value;
		cityFetch();

		// Update localStorage after adding new city
		localStorage.setItem("cities", JSON.stringify(cities));

		// Build List from local
		buildMenu();
		searchAreaEl.value = "";
	}
});

//@ City Buttons
saveCitiesEl.addEventListener("click", savedCityBtnHandler);

//!On Load
buildMenu();

// API Key
// 393222282915c98d946ff653251f7404
