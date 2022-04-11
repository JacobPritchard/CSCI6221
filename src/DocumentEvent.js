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

exports.getPosition = function(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(getCurrentWeather);
  }else{ 
    console.log("Geolocation is not supported by this browser.");
  }
}

function getName(lat, lon){
  var name = "";
  var scriptUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=883f70964bc4427b6582c086f8a59ff7&units=imperial";
  $.ajax({
     url: scriptUrl,
     type: 'get',
     dataType: 'json',
     async: false,
     success: function(data) {
         name = data.name;
     } 
  });
  return name;
}

function getCurrentWeather(position){
  var lat = sessionStorage.getItem("lat");
  var lon = sessionStorage.getItem("lon");
  var name = sessionStorage.getItem("name");
  if(!lat){
    lat = position.coords.latitude;
    sessionStorage.setItem("lat", lat);
  }
  if(!lon){
    lon = position.coords.longitude;
    sessionStorage.setItem("lon", lon);
  }
  if(!name){
    name = getName(lat, lon);
  }
  $.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,daily,alerts&appid=883f70964bc4427b6582c086f8a59ff7&units=imperial", function(resp){
  	console.log(resp);
	document.getElementById("loc").innerHTML = name;
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
	  document.getElementById("rain").innerHTML = "Rain Volume: " + resp.current.rain["1h"] + " mm";
	}
	if(resp.current.snow){
	  document.getElementById("snow").innerHTML = "Snow Volume: " + resp.current.snow["1h"] + " mm";
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
  var lat = sessionStorage.getItem("lat");
  var lon = sessionStorage.getItem("lon");
  $.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=hourly,daily,alerts&appid=883f70964bc4427b6582c086f8a59ff7&units=imperial", function(resp){
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
			}
			html += '<div class="row text-center">';
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
		html += '<p class="text-muted">Precipitation: ' + mins[i].precipitation + ' mm</p>';
		html += "</div>";
	}
	if(mins.length-1 % 3 != 0){
		html += '</div>';
	}
	document.getElementById("min").innerHTML = html;
  });
}

exports.getHourlyWeather = function(){
  var lat = sessionStorage.getItem("lat");
  var lon = sessionStorage.getItem("lon");
  $.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=current,minutely,daily,alerts&appid=883f70964bc4427b6582c086f8a59ff7&units=imperial", function(resp){
  	console.log(resp);
	var hours = resp.hourly;
	var html = "";
	for(var i = 0; i < hours.length; i++){
		if(i % 3 == 0){
			if(i != 0){
				html += '</div>';
				document.getElementById("hour").innerHTML += html;
				html = "";
			}
			html += '<div class="row text-center">';
		}
		html += '<div class="col-md-4">';
		var weather = hours[i].weather[0].description;
		var w = weather[0].toUpperCase();
		for(var j = 1; j < weather.length; j++){
			if(weather[j-1] == " "){
				w += weather[j].toUpperCase();
			}else{
				w += weather[j];
			}
		}
		var imgSrc = hours[i].weather[0].icon;
		var src = "http://openweathermap.org/img/wn/" + imgSrc + ".png";
		var img = '<span class="fa-stack fa-4x"><img width="150" height="150" src="'+src+'"/></span><h4 class="my-3">'+w+'</h4>';
		html += img;
		var day = "";
		var time = hours[i].dt;
		var date = new Date(time * 1000);
		var hrs = date.getHours();
		if(hrs >= 12){
			hrs -= 12;
			day = "pm";
		}else{
			day = "am";
		}
		var t = hrs + ':00:00';
		html += '<h4 class="my-3">' + t + ' ' + day + '</h4>';
		html += '<h4 class="my-3">Temperature: ' + hours[i].temp + ' Degrees Fahrenheit</h4>';
		html += '<button id="btn'+i+'" onclick="show('+i+')">More</button>';
		html += '<div id="div'+i+'" style="display:none">';
		html += '<p class="text-muted">Feels Like: ' + hours[i].feels_like + ' Degrees Fahrenheit</p>';
		var pop = hours[i].pop;
		var p = pop*100;
		html += '<p class="text-muted">Precipitation Probability: ' + p + '%</p>';
		html += '<p class="text-muted">Atmospheric Pressure: ' + hours[i].pressure + ' hPa</p>';
		html += '<p class="text-muted">Humidity: ' + hours[i].humidity + '%</p>';
		html += '<p class="text-muted">Atmospheric Temperature (Dew Point): ' + hours[i].dew_point + ' Degrees Fahrenheit</p>';
		html += '<p class="text-muted">Cloudiness: ' + hours[i].clouds + '%</p>';
		html += '<p class="text-muted">Midday UV Index: ' + hours[i].uvi + '</p>';
		html += '<p class="text-muted">Average Visibility: ' + hours[i].visibility + ' m</p>';
		html += '<p class="text-muted">Wind Speed: ' + hours[i].wind_speed + ' miles/hour</p>';
      	if(hours[i].wind_gust){
	  	  html += '<p class="text-muted">Wind Gust: ' + hours[i].wind_gust + ' miles/hour</p>';
		}
		html += '<p class="text-muted">Wind Direction: ' + hours[i].wind_deg + ' degrees (meteorological)</p>';
		if(hours[i].rain){
		  html += '<p class="text-muted">Rain Volume: ' + hours[i].rain["1h"] + ' mm</p>';
		}
		if(hours[i].snow){
		  html += '<p class="text-muted">Snow Volume: ' + hours[i].snow["1h"] + ' mm</p>';
		}
		html += "</div>";
		html += "</div>";
	}
	if(hours.length-1 % 3 != 0){
		html += '</div>';
	}
	document.getElementById("hour").innerHTML += html;
  });
}

exports.getDailyWeather = function(){
  var lat = sessionStorage.getItem("lat");
  var lon = sessionStorage.getItem("lon");
  $.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=current,minutely,hourly,alerts&appid=883f70964bc4427b6582c086f8a59ff7&units=imperial", function(resp){
  	console.log(resp);
	var days = resp.daily;
	var html = "";
	for(var i = 0; i < days.length; i++){
		if(i % 3 == 0){
			if(i != 0){
				html += '</div>';
				document.getElementById("day").innerHTML += html;
				html = "";
			}
			html += '<div class="row text-center">';
		}
		html += '<div class="col-md-4">';
		var weather = days[i].weather[0].description;
		var w = weather[0].toUpperCase();
		for(var j = 1; j < weather.length; j++){
			if(weather[j-1] == " "){
				w += weather[j].toUpperCase();
			}else{
				w += weather[j];
			}
		}
		var imgSrc = days[i].weather[0].icon;
		var src = "http://openweathermap.org/img/wn/" + imgSrc + ".png";
		var img = '<span class="fa-stack fa-4x"><img width="150" height="150" src="'+src+'"/></span><h4 class="my-3">'+w+'</h4>';
		html += img;
		var time = days[i].dt;
		var date = new Date(time * 1000);
		var day = date.getDate();
		var d2 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var d1 = date.getDay();
		var d = d2[d1];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var month = date.getMonth();
		var m = months[month];
		var year = date.getFullYear();
		html += '<h4 class="my-3">' + d + ' ' + m + ' ' + day + ', ' + year + '</h4>';
		html += '<p class="text-muted">Minimum Temperature: ' + days[i].temp.min + ' Degrees Fahrenheit</p>';
		html += '<p class="text-muted">Maximum Temperature: ' + days[i].temp.max + ' Degrees Fahrenheit</p>';
		html += '<p class="text-muted">Morning Temperature: ' + days[i].temp.morn + ' Degrees Fahrenheit</p>';
		html += '<p class="text-muted">Daytime Temperature: ' + days[i].temp.day + ' Degrees Fahrenheit</p>';
		html += '<p class="text-muted">Evening Temperature: ' + days[i].temp.eve + ' Degrees Fahrenheit</p>';
		html += '<p class="text-muted">Nighttime Temperature: ' + days[i].temp.night + ' Degrees Fahrenheit</p>';
		html += '<button id="btn'+i+'" onclick="show('+i+')">More</button>';
		html += '<div id="div'+i+'" style="display:none">';
		html += '<p class="text-muted">Morning Temperature Feels Like: ' + days[i].feels_like.morn + ' Degrees Fahrenheit</p>';
		html += '<p class="text-muted">Daytime Temperature Feels Like: ' + days[i].feels_like.day + ' Degrees Fahrenheit</p>';
		html += '<p class="text-muted">Evening Temperature Feels Like: ' + days[i].feels_like.eve + ' Degrees Fahrenheit</p>';
		html += '<p class="text-muted">Nighttime Temperature Feels Like: ' + days[i].feels_like.night + ' Degrees Fahrenheit</p>';
		var sunrise = days[i].sunrise;
		var sunriseDate = new Date(sunrise * 1000);
		var sunriseHours = sunriseDate.getHours();
		var sunriseMins = "0" + sunriseDate.getMinutes();
		var sunriseSecs = "0" + sunriseDate.getSeconds();
		var sunriseTime = sunriseHours + ':' + sunriseMins.substr(-2) + ':' + sunriseSecs.substr(-2);
		html += '<p class="text-muted">Sunrise: ' + sunriseTime + ' am</p>';
		var sunset = days[i].sunset;
		var sunsetDate = new Date(sunset * 1000);
		var sunsetHours = sunsetDate.getHours()-12;
		var sunsetMins = "0" + sunsetDate.getMinutes();
		var sunsetSecs = "0" + sunsetDate.getSeconds();
		var sunsetTime = sunsetHours + ':' + sunsetMins.substr(-2) + ':' + sunsetSecs.substr(-2);
		html += '<p class="text-muted">Sunset: ' + sunsetTime + ' pm</p>';
		var moonrise = days[i].moonrise;
		var moonriseDate = new Date(moonrise * 1000);
		var moonriseHours = moonriseDate.getHours();
		var moonriseMins = "0" + moonriseDate.getMinutes();
		var moonriseSecs = "0" + moonriseDate.getSeconds();
		var amPm = "";
		if(moonriseHours >= 12){
			moonriseHours -= 12;
			amPm = "pm";
		}else{
			amPm = "am";
		}
		var moonriseTime = moonriseHours + ':' + moonriseMins.substr(-2) + ':' + moonriseSecs.substr(-2);
		html += '<p class="text-muted">Moonrise: ' + moonriseTime + ' ' + amPm + '</p>';
		var moonset = days[i].moonset;
		var moonsetDate = new Date(moonset * 1000);
		var moonsetHours = moonsetDate.getHours();
		var moonsetMins = "0" + moonsetDate.getMinutes();
		var moonsetSecs = "0" + moonsetDate.getSeconds();
		var amPm1 = "";
		if(moonsetHours >= 12){
			moonsetHours -= 12;
			amPm1 = "pm";
		}else{
			amPm1 = "am";
		}
		var moonsetTime = moonsetHours + ':' + moonsetMins.substr(-2) + ':' + moonsetSecs.substr(-2);
		html += '<p class="text-muted">Moonset: ' + moonsetTime + ' ' + amPm1 + '</p>';
		var phase = days[i].moon_phase;
		var moon = "";
		if(phase == 0 || phase == 1){
			moon = "New Moon";
		}else if(phase > 0 && phase < 0.25){
			moon = "Waxing Crescent Moon";
		}else if(phase == 0.25){
			moon = "First Quarter Moon";
		}else if(phase > 0.25 && phase < 0.5){
			moon = "Waxing Gibbous Moon";
		}else if(phase == 0.5){
			moon = "Full Moon";
		}else if(phase > 0.5 && phase < 0.75){
			moon = "Waning Gibbous Moon";
		}else if(phase == 0.75){
			moon = "Last Quarter Moon";
		}else if(phase > 0.75 && phase < 1){
			moon = "Waning Crescent Moon";
		}else{
			moon = "Error: Not a Part of the Lunar Cycle";
		}
		html += '<p class="text-muted">' + moon + '</p>';
		var pop = days[i].pop;
		var p = pop*100;
		html += '<p class="text-muted">Precipitation Probability: ' + p + '%</p>';
		html += '<p class="text-muted">Atmospheric Pressure: ' + days[i].pressure + ' hPa</p>';
		html += '<p class="text-muted">Humidity: ' + days[i].humidity + '%</p>';
		html += '<p class="text-muted">Atmospheric Temperature (Dew Point): ' + days[i].dew_point + ' Degrees Fahrenheit</p>';
		html += '<p class="text-muted">Cloudiness: ' + days[i].clouds + '%</p>';
		html += '<p class="text-muted">Midday UV Index: ' + days[i].uvi + '</p>';
		html += '<p class="text-muted">Average Visibility: ' + days[i].visibility + ' m</p>';
		html += '<p class="text-muted">Wind Speed: ' + days[i].wind_speed + ' miles/hour</p>';
      	if(days[i].wind_gust){
	  	  html += '<p class="text-muted">Wind Gust: ' + days[i].wind_gust + ' miles/hour</p>';
		}
		html += '<p class="text-muted">Wind Direction: ' + days[i].wind_deg + ' degrees (meteorological)</p>';
		if(days[i].rain){
		  html += '<p class="text-muted">Rain Volume: ' + days[i].rain + ' mm</p>';
		}
		if(days[i].snow){
		  html += '<p class="text-muted">Snow Volume: ' + days[i].snow + ' mm</p>';
		}
		html += "</div>";
		html += "</div>";
	}
	if(days.length-1 % 3 != 0){
		html += '</div>';
	}
	document.getElementById("day").innerHTML += html;
  });
}

exports.getAlerts = function(){
  var lat = sessionStorage.getItem("lat");
  var lon = sessionStorage.getItem("lon");
  $.get("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=current,minutely,hourly,daily&appid=883f70964bc4427b6582c086f8a59ff7&units=imperial", function(resp){
	console.log(resp);
	var html = "";
	if(resp.alerts){
		var alerts = resp.alerts;
		for(var i = 0; i < alerts.length; i++){
			if(i % 3 == 0){
				if(i != 0){
					html += '</div>';
				}
				html += '<div class="row text-center">';
			}
			html += '<div class="col-md-4">';
			html += '<h4 class="my-3">Alert Source: ' + alerts[i].sender_name + '</h4>';
			html += '<h4 class="my-3">Alert Name: ' + alerts[i].event + '</h4>';
			html += '<h4 class="my-3">Alert Description: ' + alerts[i].description + '</h4>';
			var day = "";
			var time = alerts[i].start;
			var date = new Date(time * 1000);
			var hours = date.getHours();
			if(hours >= 12){
				hours -= 12;
				day = "pm";
			}else{
				day = "am";
			}
			var mins = "0" + date.getMinutes();
			var secs = "0" + date.getSeconds();
			var t = hours + ':' + mins.substr(-2) + ':' + secs.substr(-2);
			html += '<h4 class="my-3">Alert Start Time: ' + t + ' ' + day + '</h4';
			var endDay = "";
			var endTime = alerts[i].end;
			var endDate = new Date(endTime * 1000);
			var endHours = endDate.getHours();
			if(endHours >= 12){
				endHours -= 12;
				endDay = "pm";
			}else{
				endDay = "am";
			}
			var endMins = "0" + endDate.getMinutes();
			var endSecs = "0" + endDate.getSeconds();
			var t1 = endHours + ':' + endMins.substr(-2) + ':' + endSecs.substr(-2);
			html += '<h4 class="my-3">Alert End Time: ' + t1 + ' ' + endDay + '</h4';
			html += "</div>";
		}
		if(alerts.length-1 % 3 != 0){
			html += '</div>';
		}
	}else{
		html += '<div class="row text-center"><h4 class="my-3">No Active Weather Alerts</h4></div>';
	}
	document.getElementById("alerts").innerHTML = html;
  });
}