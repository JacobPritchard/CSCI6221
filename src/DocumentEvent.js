'use strict';

exports.clickEvent = 'click';

exports.inputEvent = 'input';

exports.addEvent = function (eventType) {
  return function (eventHandler) {
    return function () {
      return document.addEventListener(eventType, (evt) => {
        return eventHandler(evt)();
      })
    }
  }
}

exports.getCurrentWeather = function(){
  $.get("https://api.openweathermap.org/data/2.5/onecall?lat=38.8950368&lon=-77.0365427&exclude=minutely,hourly,daily,alerts&appid=883f70964bc4427b6582c086f8a59ff7&units=imperial", function(resp){
  	console.log(resp);
      document.getElementById("temp").innerHTML = "Temperature: " + resp.current.temp + " Degrees Fahrenheit";
	document.getElementById("feel").innerHTML = "Feels Like: " + resp.current.feels_like + " Degrees Fahrenheit";
	var weather = resp.current.weather[0].description;
	var w = weather[0].toUpperCase();
	for(var i = 1; i < weather.length; i++){
		if(weather[i-1] == " "){
			w += weather[i].toUpperCase();
		}else{
			w += weather[i];
		}
	}
      document.getElementById("weather").innerHTML = w;
	var imgSrc = resp.current.weather[0].icon;
	var src = "http://openweathermap.org/img/wn/" + imgSrc + ".png";
	var img = '<img width="150" height="150" src="'+src+'"/>';
      document.getElementById("weatherImg").innerHTML = img;
	document.getElementById("pressure").innerHTML = "Atmospheric Pressure: " + resp.current.pressure + " hPa";
	document.getElementById("humidity").innerHTML = "Humidity: " + resp.current.humidity + "%";
	document.getElementById("dew").innerHTML = "Atmospheric Temperature (Dew Point): " + resp.current.dew_point + " Degrees Fahrenheit";
	document.getElementById("clouds").innerHTML = "Cloudiness: " + resp.current.clouds + "%";
	document.getElementById("uvi").innerHTML = "Midday UV Index: " + resp.current.uvi;
	document.getElementById("visibility").innerHTML = "Average Visibility: " + resp.current.visibility + " m";
	document.getElementById("wind_speed").innerHTML = "Wind Speed: " + resp.current.wind_speed + " miles/hour";
      if(resp.current.wind_gust){
	  document.getElementById("wind_gust").innerHTML = "Wind Gust: " + resp.current.wind_gust + " miles/hour";
	}
	document.getElementById("wind_deg").innerHTML = "Wind Direction: " + resp.current.wind_deg + " degrees (meteorological)";
	if(resp.current.rain){
	  document.getElementById("rain").innerHTML = "Rain Volume: " + resp.current.rain + " mm";
	}
	if(resp.current.snow){
	  document.getElementById("snow").innerHTML = "Snow Volume: " + resp.current.snow + " mm";
	}
	document.getElementById("timezone").innerHTML = "Timezone: " + resp.timezone.replaceAll("_"," ");
	var sunrise = resp.current.sunrise;
	var riseDate = new Date(sunrise * 1000);
	var riseHours = riseDate.getHours();
	var riseMins = "0" + riseDate.getMinutes();
	var riseSecs = "0" + riseDate.getSeconds();
	var riseTime = riseHours + ':' + riseMins.substr(-2) + ':' + riseSecs.substr(-2);
	document.getElementById("sunrise").innerHTML = "Sunrise: " + riseTime + " am";
	var sunset = resp.current.sunset;
	var setDate = new Date(sunset * 1000);
	var setHours = setDate.getHours()-12;
	var setMins = "0" + setDate.getMinutes();
	var setSecs = "0" + setDate.getSeconds();
	var setTime = setHours + ':' + setMins.substr(-2) + ':' + setSecs.substr(-2);
	document.getElementById("sunset").innerHTML = "Sunset: " + setTime + " pm";
  });
}

exports.getMinuteWeather = function(){
  $.get("https://api.openweathermap.org/data/2.5/onecall?lat=38.8950368&lon=-77.0365427&exclude=hourly,daily,alerts&appid=883f70964bc4427b6582c086f8a59ff7&units=imperial", function(resp){
  	console.log(resp);
	var weather = resp.current.weather[0].description;
	var w = weather[0].toUpperCase();
	for(var i = 1; i < weather.length; i++){
		if(weather[i-1] == " "){
			w += weather[i].toUpperCase();
		}else{
			w += weather[i];
		}
	}
	var imgSrc = resp.current.weather[0].icon;
	var src = "http://openweathermap.org/img/wn/" + imgSrc + ".png";
	var img = '<span class="fa-stack fa-4x"><img width="150" height="150" src="'+src+'"/></span><h4 class="my-3">'+w+'</h4>';
	var mins = resp.minutely;
	var html = "";
	for(var i = 0; i < mins.length; i++){
		if(i % 3 == 0){
			if(i != 0){
				html += '</div>';
				console.log("closed"+i);
			}
			html += '<div class="row text-center">';
			console.log("opened"+i);
		}
		html += '<div class="col-md-4">';
		html += img;
		var day = "";
		var time = mins[i].dt;
		var date = new Date(time * 1000);
		var hours = date.getHours();
		if(hours >= 12){
			hours -= 12;
			day = "pm";
		}else{
			day = "am";
		}
		var min = "0" + date.getMinutes();
		var secs = "0" + date.getSeconds();
		var t = hours + ':' + min.substr(-2) + ':' + secs.substr(-2);
		html += '<p class="text-muted">' + t + ' ' + day + '</p>';
		html += '<p class="text-muted">' + mins[i].precipitation + '% Precipitation</p>';
		html += "</div>";
	}
	if(mins.length % 3 != 0){
		console.log("closed");
		html += '</div>';
	}
	document.getElementById("min").innerHTML = html;
  });
}