var saveCitiesEl = document.querySelector("#saved-cities");
var searchBtnEl = document.querySelector("#search-btn");
var searchAreaEl = document.querySelector("#city-search-area");
var selectedCityEl = document.querySelector("#selected-city-stats");
var cityName;
var lat;
var lon;

console.log(selectedCityEl);
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
		console.log(clickedCityName);
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
			console.log(data);

			removeAllChildNodes(selectedCityEl);

			// City
			var city = data.name;
			var selectedCityTitle = document.createElement("h2");
			selectedCityTitle.textContent = city;

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

			// TODO UV Index
			// var uvIndex = data.main.uvIndex;
			var uvIndex = "To Do";
			var selectedCityUvIndex = document.createElement("p");
			selectedCityUvIndex.innerHTML = "UV Index: " + uvIndex;

			lat = data.coord.lat;
			lon = data.coord.lon;

			console.log(lat, lon);

			selectedCityEl.append(
				selectedCityTitle,
				selectedCityTemp,
				selectedCityWind,
				selectedCityHumidity,
				selectedCityUvIndex
			);
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
