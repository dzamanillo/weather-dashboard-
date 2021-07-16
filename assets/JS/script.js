var saveCitiesEl = document.querySelector("#saved-cities");
var searchBtnEl = document.querySelector("#search-btn");
var searchAreaEl = document.querySelector("#city-search-area");

// Get or create "cities" in local storage
var cities = JSON.parse(localStorage.getItem("cities")) || [];

//@ Search Button Adds Value to "cities" Local Storage
searchBtnEl.addEventListener("click", function () {
	saveCitiesEl.innerHTML = "";
	console.log(searchAreaEl.value);

	// Push protect
	if (cities.indexOf(searchAreaEl.value) === -1) {
		cities.push(searchAreaEl.value);
	}

	// Update localStorage after adding new city
	localStorage.setItem("cities", JSON.stringify(cities));

	// Build List from local
	buildMenu();
});

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

//* Get City Name Function
var getCityName = function (event) {
	if (event.target.dataset.btn === "city") {
		var cityName = event.target.value;
		console.log(cityName);
	}
};

//@ City Buttons
saveCitiesEl.addEventListener("click", getCityName);

//!On Load
buildMenu();
