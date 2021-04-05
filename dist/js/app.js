/*
Agree. You can substitute "n", length of the vector with "end" so you will not need to calculate the length: bwint(end:-1:1)=cumsum(.....).
The formal description of the inverse integration method: Shroeder papers: "New Method of Measuring Reverberation Time" (just google it and you will reach the paper).
You can find also the mathematical expression of the acoustic energy decay in a room in the standard UNE-EN ISO 3382 part 1. I write here the Latex code:
E(t)=\int_0^\infty p^2(\tau) d(\tau)=\int_\infty^t p^2(\tau) d(-\tau)
This expression is what our colleague Francesco is implementing into a single line Matlab code.

https://www.researchgate.net/post/Is_there_a_mathematical_formulation_of_the_Schroeder_inverse-integration_method_as_an_operator_or_as_a_functional

*/


/* --- ROOM DIMENSIONS INPUT AND CALC --- */

const room = {
  h: 0,
  w: 0,
  l: 0,
  volume: 0,
  t60: [0, 0, 0, 0, 0, 0, 0, 0]
}

const aMaterials = [];

document.getElementById("room-height")
  .addEventListener('change', function (e) { calculateRoomVolume(e, 'h'); });
document.getElementById("room-width")
  .addEventListener('change', function (e) { calculateRoomVolume(e, 'w'); });
document.getElementById("room-length")
  .addEventListener('change', function (e) { calculateRoomVolume(e, 'l'); });

function calculateRoomVolume (e, dim) {

  const inputValueAsFloat = parseFloat(e.target.value);
  // alert if less than 1 - very narrow room
  
  if (typeof inputValueAsFloat === 'number' && dim === 'h') {                  
    room.h = inputValueAsFloat;    
    room.volume = room.h * room.w * room.l;
  } 
  if (typeof inputValueAsFloat === 'number' && dim === 'w') {                  
    room.w = inputValueAsFloat;    
    room.volume = room.h * room.w * room.l;
  } 
  if (typeof inputValueAsFloat === 'number' && dim === 'l') {                  
    room.l = inputValueAsFloat;    
    room.volume = room.h * room.w * room.l;
  } 
  if (room.volume > 5) {
    room.volume = room.volume.toFixed(2);
    document.getElementById("calculated-m2").innerHTML = `${room.volume}`;
    return room.volume;
  } else {
    document.getElementById("calculated-m2").innerHTML = `Check values`;
  }
}

/* --- T60 INPUT AND CALC --- */ 

document.querySelectorAll('.room-t60-input').forEach(item => {
  item.addEventListener('change', e => {
    let idAsInt = e.target.id.split("t60_");
    idAsInt = parseInt(idAsInt[1]);

    let eValueAsFloat = parseFloat(e.target.value);

    if (typeof eValueAsFloat === 'number' && eValueAsFloat > 0) {
      switch (idAsInt) {
        case 63:
          room.t60[0] = parseFloat(e.target.value);
          break;
        case 125:
          room.t60[1] = parseFloat(e.target.value);
          break;
        case 250:
          room.t60[2] = parseFloat(e.target.value);
          break;
        case 500:
          room.t60[3] = parseFloat(e.target.value);
          break;
        case 1000:
          room.t60[4] = parseFloat(e.target.value);
          break;
        case 2000:
          room.t60[5] = parseFloat(e.target.value);
          break;
        case 4000:
          room.t60[6] = parseFloat(e.target.value);
          break;
        case 8000:
          room.t60[7] = parseFloat(e.target.value);
          break;
      }
    } 
    updateGraphMeasured();
    
  })
})

function updateGraphMeasured() {
  for(let i = 0; i < chart.data.datasets[1].data.length; i++) {
    chart.data.datasets[1].data[i] = room.t60[i];
  }
  chart.update();
}

/* --- CHART SECTION --- */
const ctx = document.getElementById("chart-canvas").getContext('2d');
// ctx.translate(0.5, 0.5);

Chart.defaults.global.defaultFontFamily = "'Courier New', Courier, monospace";
Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.defaultFontStyle = 'bold';
Chart.defaults.global.displayColors = false;

const chart = new Chart(ctx, {
  type: 'line',
  data: {
      labels: ["63",	"125",	"250",	"500",	"1000",	"2000",	"4000","8000"],
      
      datasets: [ {
        label: 'CORRECTED', // Name the series
        data: [0.0,	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], // Specify the data values array
        fill: false,
        // before #4CAF50
        borderColor: '#34b334', // Add custom color border (Line)
        backgroundColor: '#34b334', // Add custom color background (Points and Fill)
        borderWidth: 3, // Specify bar border width
        tension: 0.1
    },
        {
          label: 'MEASURED', // Name the series
          data: [0.0,	0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], // Specify the data values array
          fill: false,
          borderColor: '#FF0000', // Add custom color border (Line)
          backgroundColor: '#FF0000', // Add custom color background (Points and Fill)
          borderWidth: 2, // Specify bar border width
          tension: 0.1
      },
                {
          label: 'MAX', // Name the series
          data: [0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5], // Specify the data values array
          fill: false,
          borderColor: '#656565', // Add custom color border (Line)
          backgroundColor: '#656565', // Add custom color background (Points and Fill)
          borderWidth: 1, // Specify bar border width
          tension: 0.0
      },
                {
          label: 'MIN', // Name the series

          data: [0.3,	0.3,	0.3,	0.3,	0.3,	0.3,	0.3,	0.3], // Specify the data values array
          fill: false,
          borderColor: '#656565', // Add custom color border (Line)
          backgroundColor: '#656565', // Add custom color background (Points and Fill)
          borderWidth: 1, // Specify bar border width
          tension: 0.0
      }]
  },
  options: {
    responsive: true, // Instruct chart js to respond nicely.
    maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
    legend: { // legend is the corrected, measure, max, min headings
      display: true,
      align: 'end',
      labels: {
        boxWidth: 13,
      }
    },
    
    tooltips: { 
      displayColors: false, // removes square next to tool tip
                            // when inspecting datapoint

      callbacks: {
        afterLabel: function (tooltipitem, chart) {
          return "T60"; // adds 'seconds' after the 
        }
      }
    }
  }
});

/* --- MATERIALS SECTION --- */

class Material {
  constructor() {
    this.addedMaterials = []; // is array of names
  }

  // 
  addMaterial(name, a63, a125, a250, a500, a1k, a2k, a4k, a8k) {
    const matSection = document.getElementById("materials-section");

    this.material = [name, a63, a125, a250, a500, a1k, a2k, a4k, a8k];
    

    const section = document.createElement('section');

    if(typeof name === 'string') {
      const now = new Date();
      section.id = `${name}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}`; // give unique identifier
      this.material[0] = section.id;

      section.innerHTML = `
      <div class="new-material">
        
        <header class="new-material-header">
          <h2 class="material-name">${name}</h2>
          <a class="material-delete-button" href="#" class="delete">Delete Material</a>
          <h3 class="material-input-text">only numbers separated by . (dot)</h3>
          </header>

        <div class="material-flex">
          <div class="material-63to500Hz">
            <div class="material-form">
              <label for="63hz">63 Hz</label>
              <input type="number" min="0" step="0.01" class="material-input" value="${a63}" required readonly>
            </div>
            <div class="material-form">
              <label for="125hz">125 Hz</label>
              <input type="number" min="0" step="0.01" class="material-input" value="${a125}" required readonly>
            </div>
            <div class="material-form">
              <label for="250hz">250 Hz</label>
              <input type="number" min="0" step="0.01" class="material-input" value="${a250}" required readonly>
            </div>
            <div class="material-form">
              <label for="500hz">500 Hz</label>
              <input type="number" min="0" step="0.01" class="material-input" value="${a500}" required readonly>
            </div>
          </div>
          <div class="material-1000to8000Hz">
            <div class="material-form">
              <label for="1000hz">1 kHz</label>
              <input type="number" min="0" step="0.01" class="material-input" value="${a1k}" required readonly>
            </div>
            <div class="material-form">
              <label for="2000hz">2 kHz</label>
              <input type="number" min="0" step="0.01" class="material-input" value="${a2k}" required readonly>
            </div>
            <div class="material-form">
              <label for="4000hz">4 kHz</label>
              <input type="number" min="0" step="0.01" class="material-input" value="${a4k}" required readonly>
            </div>
            <div class="material-form">
              <label for="8000hz">8 kHz</label>
              <input type="number" min="0" step="0.01" class="material-input" value="${a8k}" required readonly>
            </div>
          </div>
        </div>   
      </div>
      `;

      
      // this.addedMaterials.push(this.material);

      matSection.appendChild(section);
    } else {console.log('name is not a string');}
  }

  deleteMaterial(target) {
    if(target.className === 'delete') {
      // link > header > div
      target.parentElement.parentElement.remove();
    }
  }
}

const materials = new Material();


// EVENT LISTENERS
document.getElementById('thebtn').addEventListener('click',function(e) {
  materials.addMaterial(`${Math.random()}`, 0.1,	0.2,	0.3,	0.4,	0.4,	0.3,	0.4,	0.4);
  e.preventDefault();
}, false);

document.querySelector('#materials-section').addEventListener('click', function(e) {
  materials.deleteMaterial(e.target);
  e.preventDefault();
})