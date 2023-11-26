let searchInput = $('#searchInput')
let searchForm = $('#searchForm')
let savedList = $('#savedList')
let savedSearch = $('.savedSearch')
let cityName = $('#cityDisplay')
let dateDisplay = $('.dateDisplay')
let tempDisplay = $('.tempDisplay')
let HumidityDisplay = $('.humidityDisplay')
let WindDisplay = $('.windDisplay')
let IconDisplay = $('.iconDisplay')
let searchHistory = []
let coordinates = []
let savedLocations = []

//Gets today and 5 days ahead dates
function getDate(){
    for(let i = 0; i < dateDisplay.length; i++){
        if(i === 0){
            $(dateDisplay[i]).text('Today, ' + dayjs().format('MMMM DD, YYYY'))
        }
        else{
            $(dateDisplay[i]).text(dayjs().add(i, 'day').format('MMM DD, YYYY'))
        }
    }
}

//Forecast functions

//Fecth desired weather forecast based of city names and zipcodes
function getForecast(locationCallUrl){
    fetch(locationCallUrl)
    .then(function (response) {
        return response.json()})
    .then(function(data){
        coordinates = [data[0].lat, data[0].lon]
        let forecastCallUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+coordinates[0]+'&lon='+coordinates[1]+'&exclude=hourly,minutely,alerts&appid=24b7933fb89d75b66c49bd25ad80d2cd&units=imperial'
        fetch(forecastCallUrl)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            let dataSpots = [0, 7, 15, 23, 31, 39]
            let forecastTemp = []
            let forecastHumidity = []
            let forecastWind = []
            let forecastIcons = []
            for(let i = 0; i < dataSpots.length; i++){
                forecastTemp.push(Math.floor(data.list[dataSpots[i]].main.temp))
                forecastHumidity.push(data.list[dataSpots[i]].main.humidity)
                forecastWind.push(Math.floor(data.list[dataSpots[i]].wind.speed))
                forecastIcons.push(data.list[dataSpots[i]].weather[0].icon)
            }
            for(let i = 0; i < dataSpots.length; i++){
                $(tempDisplay[i]).text(forecastTemp[i] + ' °F')
                $(HumidityDisplay[i]).text('Humidity: ' + forecastHumidity[i] + '%')
                $(WindDisplay[i]).text('Wind speed: ' + forecastWind[i] + 'mph')
                $(IconDisplay[i]).attr('src', 'https://openweathermap.org/img/wn/'+ forecastIcons[i] + '@2x.png')
            }

        })
    })
}

//Gets forecast from form
function getForecastInput(){
    cityName.text(' in ' + searchInput.val())
    let locationCallUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+searchInput.val()+'&limit=1&appid=24b7933fb89d75b66c49bd25ad80d2cd'
    getForecast(locationCallUrl)
    let savedSearchEl = '<li><button type="submit" class="btn btn-info w-100 savedSearch text-light m-1">'+searchInput.val()+'</button></li>'
    $(savedList).append(savedSearchEl)
}
 
//Gets forecast from search history
function getForecastHistory(historySearch){
    cityName.text(' in ' + historySearch)
    let locationCallUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+historySearch+'&limit=1&appid=24b7933fb89d75b66c49bd25ad80d2cd'
    getForecast(locationCallUrl)
}

//Search history functions

//Saves inputs to history
function saveInput() {
    let searchInputVal = searchInput.val()
    if(savedLocations.includes(searchInputVal)){

    }else{
        savedLocations.push(searchInputVal)
        localStorage.setItem('searchHistory', JSON.stringify(savedLocations))
    }
}

//Display search history upon page loading
function displaySave() { 
    searchHistory = JSON.parse(localStorage.getItem('searchHistory'))
    if(searchHistory != null){
        for(let i = 0; i < searchHistory.length; i++){
            let savedSearchEl = '<li><button type="submit" class="btn btn-info w-100 savedSearch text-light m-1">'+searchHistory[i]+'</button></li>'
            $(savedList).append(savedSearchEl)
        }
    }
}

//Handler functions

//Handles form requests
function handleInputRequest(event){
    event.preventDefault()
    getForecastInput()
    saveInput()
}

//Handles history requests
function handleHistoryRequest(event){
    let historySearch = $(event.target).text()
    getForecastHistory(historySearch)
}

//Initalizing functions

searchForm.on('submit', handleInputRequest)
savedList.on('click', handleHistoryRequest)
getDate()
displaySave()