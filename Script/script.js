'use strict';



const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
class Workout{
    date=new Date();
    id=(Date.now()+'').slice(-10);
constructor(coords,distance,duration){
this.coords=coords;//[ltd,lng]
this.distance=distance;
this.duration=duration;
}
_setDescription()
{
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
this.description=`${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]}${this.date.getDate()}`;
}
}
class Running extends Workout{
    type="running";
    constructor(coords,distance,duration,cadence)
    {
        super(coords,distance,duration);
        this.cadence=cadence;
        this.calcPace();
        this._setDescription();
    }
    //min/km
    calcPace(){
        this.pace=this.duration/this.distance;
        return this.pace
    }
    //kmph
    calcSpeed(){
          this.speed=this.distance/(this.duration/60);
          return this.speed
    }

}
class Cycling extends Workout{
    type="cycling";
    constructor(coords,distance,duration,elevationGain)
    {
        super(coords,distance,duration);
        this.elevationGain=elevationGain;
        this.calcSpeed();
        this._setDescription();
    }
    calcSpeed(){
        //kmph
        this.speed=this.distance/(this.duration/60);
        return this.speed;
    }
}
class App{
    #map;
    #mapEvent;
    #workouts=[];
    #mapZoomLevel=16;
 constructor(){
        this._getPosition();
        //get data from local storage
        this._getLocalStorage();
        form.addEventListener("submit",this._newWorkout.bind(this));
       //class toggle
       inputType.addEventListener('change',this._toggleElevationField );
       containerWorkouts.addEventListener('click',this._moveToPopup.bind(this))
      }
/*To get the current position */_getPosition()
    {
        if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
       function()
    {
       alert("Could not get your position"); 
      }
     )
        

    }
/*To load the map*/_loadMap(position)
    {
 
    console.log(position);
    const {latitude}=position.coords;
    const {longitude}=position.coords;
    console.log(`lattitude ${latitude},longitude ${longitude}`);
    const coords=[latitude,longitude];
    this.#map = L.map('map').setView(coords, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);
    
    //settting up a custom marker 
    var myIcon = L.icon({
        iconUrl: 'marker.svg',
        iconSize: [100, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: '',
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });
    L.marker(coords,{icon:myIcon}).addTo(this.#map)
    .bindPopup('Your current position')
    .openPopup();
    //handling clicks
    this.#map.on('click',this._showForm.bind(this));
    }
 /*To show the form*/_showForm(mapE){
        this.#mapEvent=mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
      
    }
/*Toggle Elevation Fields*/_toggleElevationField()
    {

        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }
_newWorkout(e){
    e.preventDefault();
    const validInputs=(...inputs)=>inputs.every(inp=>Number.isFinite(inp));
    const allPositive=(...inputs)=>inputs.every(inp=>inp>0);
    //get data from form
    const type=inputType.value;
    const distance= +inputDistance.value;
    const duration= +inputDuration.value;
    const {lat,lng}=this.#mapEvent.latlng
    let workout;
    
    //if workout is running, create running object
if(type=="running"){
    const cadence=+inputCadence.value;
    //check if data is valid
   if(!validInputs(distance,duration) ||!allPositive(distance,duration))
          return alert("inputs have to be positive numbers")
  //if workout is runnig , create running object 
    workout=new Running([lat,lng],distance,duration,cadence);
   //store this obj in the workouts array
    this.#workouts.push(workout);

}
if (type=="cycling"){
    const elevation=+inputElevation.value;
    if(!validInputs(distance,duration,elevation) || !allPositive(distance,duration))
    return alert("inputs have to be positive numbers")
    //if workout is cycling , create cycling obj
    workout=new Cycling([lat,lng],distance,duration,elevation);
    this.#workouts.push(workout);

}

    
//render workout on the map
     this._renderWorkoutMarker(workout); 
     //render workout on list
     this._renderWorkout(workout);
     //set local storage to all workouts
     this._setLocalStorage();
   //clear input fields
    inputDistance.value=inputDuration.value=inputCadence.value=inputElevation.value='';
    
    //console.log(workout);
         //console.log(`Target Location ${lat},${lng}`);
         
         

}
_renderWorkoutMarker(workout)
{
    console.log(workout);
    L.marker(workout.coords).addTo(this.#map)
    .bindPopup({
        maxWidth:250,
        minWidht:100,
        autoclose:false,
        closeOnClick:false,
        className:`${workout.type}-popup`,
    })
    .setPopupContent(`${workout.type==="running"? "🏃‍♂️": "🚴‍♀️"}${workout.description} `)
    .openPopup();
}
_renderWorkout(workout)
{ let html=`
<li class="workout workout--${workout.type}" data-id="${workout.id}">
<h2 class="workout__title">${workout.description
}</h2>
<div class="workout__details">
  <span class="workout__icon">${workout.type==="running"? "🏃‍♂️": "🚴‍♀️"}</span>
  <span class="workout__value">${workout.distance}</span>
  <span class="workout__unit">km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⏱</span>
  <span class="workout__value">${workout.duration}</span>
  <span class="workout__unit">min</span>
</div>`;
if(workout.type==="running")
html+=`<div class="workout__details">
<span class="workout__icon">⚡️</span>
<span class="workout__value">${workout.pace.toFixed(1)}</span>
<span class="workout__unit">min/km</span>
</div>
<div class="workout__details">
<span class="workout__icon">🦶🏼</span>
<span class="workout__value">${workout.cadence==""?workout.distance*1250:workout.cadence}</span>
<span class="workout__unit">spm</span>
</div>
<div class="workout__details">
<span class="workout__icon">🔥</span>
<span class="workout__value">${((workout.distance)*76)}</span>
<span class="workout__unit">calories</span>
</div>`;
if(workout==="cycling")
html=+`<div class="workout__details">
<span class="workout__icon">⚡️</span>
<span class="workout__value">${workout.speed}</span>
<span class="workout__unit">min/km</span>
</div>
<div class="workout__details">
<span class="workout__icon">🦶🏼</span>
<span class="workout__value">${workout.elevation}</span>
<span class="workout__unit">spm</span>
</div>`;
form.insertAdjacentHTML('afterend',html);
}
_moveToPopup(e)
{
const workoutEl=e.target.closest('.workout');
console.log(workoutEl);
if(!workoutEl==null) return;
const workout=this.#workouts.find(work=> work.id===workoutEl.dataset.id)

console.log(workout);
this.#map.setView(workout.coords,this.#mapZoomLevel,{
    animate: true,
    pan:{
        duration:1
    }
})
}
    
    _setLocalStorage()
    {
        localStorage.setItem('workouts',JSON.stringify(this.#workouts));
    }
_getLocalStorage()
{
    const data=JSON.parse(localStorage.getItem('workouts'));
    console.log(data);
}
}

const app=new App();






/*
function createMarker()
{
     var markerFrom = L.circleMarker([28.6100,77.2300], { color: "#F00", radius: 10 });
     var markerTo =  L.circleMarker([18.9750,72.8258], { color: "#4AFF00", radius: 10 });
     var from = markerFrom.getLatLng();
     var to = markerTo.getLatLng();
     markerFrom.bindPopup('Delhi ' + (from).toString());
     markerTo.bindPopup('Mumbai ' + (to).toString());
     map.addLayer(markerTo);
     map.addLayer(markerFrom);
     getDistance(from, to);
}

function getDistance(from, to)
{
    var container = document.getElementById('distance');
    container.innerHTML = ("New Delhi to Mumbai - " + (from.distanceTo(to)).toFixed(0)/1000) + ' km';
}*/