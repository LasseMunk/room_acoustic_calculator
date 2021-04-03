/*
Agree. You can substitute "n", length of the vector with "end" so you will not need to calculate the length: bwint(end:-1:1)=cumsum(.....).
The formal description of the inverse integration method: Shroeder papers: "New Method of Measuring Reverberation Time" (just google it and you will reach the paper).
You can find also the mathematical expression of the acoustic energy decay in a room in the standard UNE-EN ISO 3382 part 1. I write here the Latex code:
E(t)=\int_0^\infty p^2(\tau) d(\tau)=\int_\infty^t p^2(\tau) d(-\tau)
This expression is what our colleague Francesco is implementing into a single line Matlab code.

https://www.researchgate.net/post/Is_there_a_mathematical_formulation_of_the_Schroeder_inverse-integration_method_as_an_operator_or_as_a_functional

*/

// const roomHeight = 0,
//       roomWidth = 0,
//       roomLength = 0;

// // Event Listeners
// roomHeight = document.getElementById('room-height').addEventListener('submit', function(e){ } );

// const roomDims = {
//   h: 0,
//   w: 0,
//   l: 0
// }

// const calcH = document.getElementById("room-height").addEventListener('input', calculateRoomVolume());

// function calculateRoomVolume (e, dim) {
//   console.log(e, dim);
//   if (typeof e.target.value === 'number' && dim === 'h') {                  
//     roomDims.h = e.target.value;    
//     const volume = roomDims.h * roomDims.w * roomDims.l;
//     if (volume > 0) {
//       console.log(`Volume is ${volume}`);
//       return volume;
//     }
//   } else {
//     alert('please only input numbers');
//   } 
// }

// The Canvas

// chart.js
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
        data: [0.6,	0.5,	0.5,	0.5,	0.4,	0.4,	0.4,	0.4], // Specify the data values array
        fill: false,
        // before #4CAF50
        borderColor: '#34b334', // Add custom color border (Line)
        backgroundColor: '#34b334', // Add custom color background (Points and Fill)
        borderWidth: 3 // Specify bar border width
    },
        {
          label: 'MEASURED', // Name the series
          data: [1.5,	1.3,	0.8,	0.7,	0.7,	0.6,	0.5,	0.4], // Specify the data values array
          fill: false,
          borderColor: '#FF0000', // Add custom color border (Line)
          backgroundColor: '#FF0000', // Add custom color background (Points and Fill)
          borderWidth: 2 // Specify bar border width
      },
                {
          label: 'MAX', // Name the series
          data: [0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5], // Specify the data values array
          fill: false,
          borderColor: '#656565', // Add custom color border (Line)
          backgroundColor: '#656565', // Add custom color background (Points and Fill)
          borderWidth: 1 // Specify bar border width
      },
                {
          label: 'MIN', // Name the series

          data: [0.3,	0.3,	0.3,	0.3,	0.3,	0.3,	0.3,	0.3], // Specify the data values array
          fill: false,
          borderColor: '#656565', // Add custom color border (Line)
          backgroundColor: '#656565', // Add custom color background (Points and Fill)
          borderWidth: 1 // Specify bar border width
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
          <h2 id="material-name">${name}</h2>
          <a href="#" class="delete">Delete Material</a>
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
  materials.addMaterial(`${Math.random()}`, 1.5,	1.3,	0.8,	0.7,	0.7,	0.6,	0.5,	0.4);
  e.preventDefault();
}, false);

document.querySelector('#materials-section').addEventListener('click', function(e) {
  materials.deleteMaterial(e.target);
  e.preventDefault();
})