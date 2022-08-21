var currentDay = moment().format("MMM Do YYYY");
var apiKey = "a95e8fe33fae1679fa1235f66c1692af";

var city = document.getElementById("city-input");
var searchBtn = document.getElementById("city-form");
var cityWeatherContainer = document.getElementById("city-weather");
var fiveDayContainer = document.getElementById('five-day')

function startSearch(event) {
  event.preventDefault();
  getWeather(city.value);
}

function getWeather(city) {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    apiKey
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      OneCall(data);
    });
}

function OneCall(data) {

  var lat = data[0].lat;
  var lon = data[0].lon;
  var cityName = data[0].name
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial" +
    "&appid=" +
    apiKey
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {

      currentDayWeather(data.current, cityName);
      dailyWeather(data.daily)
    });
}

function currentDayWeather(current, name) {
  // variables from the data api
  var temp = current.temp;
  var wind = current.wind_speed;
  var humidity = current.humidity;
  var uvi = current.uvi;
  var weatherIcon = current.weather[0].icon

  // create the elements that will be appended to the HTML
  cityWeatherContainer.innerHTML = '';

  var h1El = document.createElement('h1');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidEl = document.createElement('p');
  var uviEl = document.createElement('p');
  var imgEl = document.createElement('img');
  imgEl.setAttribute('src', 'https://openweathermap.org/img/w/' + weatherIcon + '.png')

  h1El.textContent = name + ' - ' + currentDay
  tempEl.textContent = 'Temp: ' + temp + ' ℉';
  windEl.textContent = 'Wind: ' + wind + ' MPH';
  humidEl.textContent = 'Humidity: ' + humidity + ' %'
  uviEl.textContent = 'UV Index: ' + uvi
  h1El.append(imgEl)

  cityWeatherContainer.append(h1El, tempEl, windEl, humidEl, uviEl)
}

function dailyWeather(daily) {
  fiveDayContainer.innerHTML = '';
  var h1El = document.createElement('h1');
  h1El.textContent = 'Five Day Forecast'

  var div = document.createElement('div');
  div.setAttribute('class', 'row')
  fiveDayContainer
  for (var i = 1; i < daily.length - 2; i++) {
    const today = new Date()

    let date = new Date(today)
    date.setDate(today.getDate() + i)
    var formattedDate = date.toLocaleDateString()
    // variables from the data api
    var temp = daily[i].temp.max;
    var wind = daily[i].wind_speed;

    var humidity = daily[i].humidity;
    var uvi = daily[i].uvi;
    var weatherIcon = daily[i].weather[0].icon

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidEl = document.createElement('p');
    var uviEl = document.createElement('p');
    var imgEl = document.createElement('img');
    imgEl.setAttribute('src', 'https://openweathermap.org/img/w/' + weatherIcon + '.png')

    tempEl.textContent = 'Temp: ' + temp + ' ℉';
    windEl.textContent = 'Wind: ' + wind + ' MPH';
    humidEl.textContent = 'Humidity: ' + humidity + ' %'
    uviEl.textContent = 'UV Index: ' + uvi
    cardTitle.textContent = formattedDate
    cardTitle.append(imgEl)

    cardBody.append(cardTitle, tempEl, windEl, humidEl, uviEl)
    card.append(cardBody)
    div.append(card)
  }






  fiveDayContainer.append(h1El, div)

  console.log(daily)
}

searchBtn.addEventListener("submit", startSearch);
