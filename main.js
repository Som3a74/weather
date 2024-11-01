//today
let day = document.getElementsByClassName('day');
let locations = document.getElementsByClassName('location')[0];
let todayIcon = document.getElementsByClassName('todayIcon')[0];
let statuc = document.getElementsByClassName('statuc')[0];
let localtime = document.getElementsByClassName('localtime')[0];
let humidity = document.getElementsByClassName('humidity')[0];
let wind_kph = document.getElementsByClassName('wind_kph')[0];
let tem = document.getElementById('tem');


// forcast
let icon_day = document.getElementsByClassName('icon_day');
let sm_tem = document.getElementsByClassName('sm_tem');
let lg_tem = document.getElementsByClassName('lg_tem');
let deg_rare = document.getElementsByClassName('deg_rare');



//search
let input_search = document.getElementById('search');


//backGround
let bg_img = document.getElementById('bg_img');




//show days
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday", "Monday", "Tuesday", "Wednesday"];
let date = new Date() ;




let res ;




async function get_data (default_city = getCoordintes()) {

    let res1 = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=fca7143602c74e38b6d52825230511&q=${default_city || 'cairo'}&days=5`);
    res = await res1.json()
    if (res1.status == 200) {
        change_bg()
        todayDetails()
        forcast()  
    }
}
get_data()




async function getDays() {
    for (let i = 0; i < day.length; i++) {
        day[i].innerHTML += days[date.getDay() + i]
    }
}
getDays()


async function todayDetails() {
    locations.innerHTML = res.location.name
    tem.innerHTML = res.current.temp_c
    todayIcon.setAttribute('src' , `https:${res.current.condition.icon}`)
    statuc.innerHTML = res.current.condition.text
    localtime.innerHTML = res.location.localtime
    humidity.innerHTML = `H : ${res.current.humidity}`
    wind_kph.innerHTML = `L : ${res.current.wind_kph}` 
}


async function forcast() {
    for (let i = 0; i < day.length; i++) {
        sm_tem[i].innerHTML = `${res.forecast.forecastday[i].day.mintemp_c} °C`
        lg_tem[i].innerHTML = `${res.forecast.forecastday[i].day.maxtemp_c} °C`
        icon_day[i].setAttribute('src' , `https:${res.forecast.forecastday[i].day.condition.icon}`)
        deg_rare[i].style.width = `${res.forecast.forecastday[i].day.avgtemp_c}%`
    }
}


async function change_bg() {
    if (res.forecast.forecastday[0].day.avgtemp_c >= 15 && res.forecast.forecastday[0].day.avgtemp_c <= 30) {
        locations.style.color = '#ffe352'
        bg_img.style.backgroundImage ="url('imges/summery.webp')"
    }
    
    else if(res.forecast.forecastday[0].day.avgtemp_c < 15 && res.forecast.forecastday[0].day.avgtemp_c > 5 ){
        locations.style.color = '#4ACEC5'
        bg_img.style.backgroundImage ='url(imges/winter.webp)'
    }

    else if(res.forecast.forecastday[0].day.avgtemp_c <= 5 ){
        locations.style.color = '#BABDC4'
        bg_img.style.backgroundImage ='url(imges/snow.webp)'
    }

    else if(res.forecast.forecastday[0].day.avgtemp_c > 30 ){
        locations.style.color = '#BABDC4'
        bg_img.style.backgroundImage ='url(imges/sunny.webp)'
    }
}



input_search.addEventListener('keyup',function(){
    let default_city =  input_search.value
    console.log(default_city);
    get_data(default_city)

})





// Step 1: Get user coordinates 
function getCoordintes() { 
	var options = { 
		enableHighAccuracy: true, 
		timeout: 5000, 
		maximumAge: 0 
	}; 

	function success(pos) { 
		var crd = pos.coords; 
		var lat = crd.latitude.toString(); 
		var lng = crd.longitude.toString(); 
		var coordinates = [lat, lng]; 
		console.log(`Latitude: ${lat}, Longitude: ${lng}`); 
		getCity(coordinates); 
		return; 

	} 

	function error(err) { 
		console.warn(`ERROR(${err.code}): ${err.message}`); 
	} 

	navigator.geolocation.getCurrentPosition(success, error, options); 
} 

// Step 2: Get city name 
function getCity(coordinates) { 
	var xhr = new XMLHttpRequest(); 
	var lat = coordinates[0]; 
	var lng = coordinates[1]; 

	// Paste your LocationIQ token below. 
    xhr.open('GET', " https://us1.locationiq.com/v1/reverse.php?key=pk.0d2639e4c5f46965636e7e7175ce37ec&lat=" + 
	lat + "&lon=" + lng + "&format=json", true); 
	xhr.send(); 
	xhr.onreadystatechange = processRequest; 
	xhr.addEventListener("readystatechange", processRequest, false); 

	function processRequest() { 
		if (xhr.readyState == 4 && xhr.status == 200) { 
			var response = JSON.parse(xhr.responseText); 
			var city = response.address.city; 
            get_data(city)
			console.log(city); 
			return; 
		} 
	} 
} 


 




