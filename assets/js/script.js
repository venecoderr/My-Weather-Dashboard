let searchInput = $('#searchInput')
let searchBtn = $('#searchBtn')
let cityName = $('#cityDisplay')
let dateDisplay = $('.dateDisplay')
let tempDisplay = $('.tempDisplay')
let HumidityDisplay = $('.humidityDisplay')
let WindDisplay = $('.windDisplay')
let IconDisplay = $('.iconDisplay')
let forecastData = []
let coordinates = []

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

function getForecast(event){
    event.preventDefault()
    cityName.text(' in ' + searchInput.val())
    let locationCallUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+searchInput.val()+'&limit=1&appid=24b7933fb89d75b66c49bd25ad80d2cd'
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
            
            console.log(data)
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


searchBtn.on('click', getForecast)

getDate()