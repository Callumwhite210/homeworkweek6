var today = moment();
$("#currentDay").text(moment().format("dddd, MMMM Do YYYY")); //Moment JS for date

var cities = [];

var APIkey="c21d845b56ef20be1ee5c6b2cf0c8efe"; //My API key

//Search function
$("#button").click(function(){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+$("#search").val()+"&appid="+ APIkey;
    $.ajax({
    url:queryURL,
    method: "GET"
})
.then(function(response){
    console.log(response.name);
    console.log($('#city')) 
    cities.push($("#search").val()) //Pushes to Local Storage
    var addbutton = document.createElement('button');
    addbutton.setAttribute('class', 'btn btn-secondary active prev');
    addbutton.textContent = cities ;
    $("#prevsearch").append(addbutton);


    $("#city").text(response.name); //putting text into respected id's
    $("#wind").text("Wind Speed:" + response.wind.speed+"MPH");
    $("#humidity").text("Humidity:"+response.main.humidity+"%");
    if (typeof response.main.temp == "number"){
    //calc into °C
    var tempC = (response.main.temp - 273.15);
    $("#temp").text("Temperature:"+ tempC.toFixed(2)+ "°C");

    console.log("Wind Speed: " + response.wind.speed);
        console.log("Humidity: " + response.main.humidity);
        console.log("Temperature: " + tempC);
    }

})
//Local Storage
.then(function(){
    localStorage.setItem("cities",JSON.stringify(cities));
    console.log(cities)
}) 
})

//call 3pm

