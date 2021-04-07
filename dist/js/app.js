/*
Agree. You can substitute "n", length of the vector with "end" so you will not need to calculate the length: bwint(end:-1:1)=cumsum(.....).
The formal description of the inverse integration method: Shroeder papers: "New Method of Measuring Reverberation Time" (just google it and you will reach the paper).
You can find also the mathematical expression of the acoustic energy decay in a room in the standard UNE-EN ISO 3382 part 1. I write here the Latex code:
E(t)=\int_0^\infty p^2(\tau) d(\tau)=\int_\infty^t p^2(\tau) d(-\tau)
This expression is what our colleague Francesco is implementing into a single line Matlab code.

https://www.researchgate.net/post/Is_there_a_mathematical_formulation_of_the_Schroeder_inverse-integration_method_as_an_operator_or_as_a_functional

*/


/* --- ROOM DIMENSIONS INPUT AND CALC --- */

const room = { // boxed room
  h: 0,
  w: 0,
  l: 0,
  volume: 0,
  t60_measured: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], // measured decay pr. octave in seconds
  t60_corrected: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], // result decay pr. octave in sec after added materials
  a_measured: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], // array of a_m2_sab values of added materials
  a_addedMaterials: [], // array of a_m2_sab values of added materials
}

const aMaterials = [];

document.getElementById("room-height")
  .addEventListener('change', function (e) { calculateRoomVolume(e, 'h'); });
document.getElementById("room-width")
  .addEventListener('change', function (e) { calculateRoomVolume(e, 'w'); });
document.getElementById("room-length")
  .addEventListener('change', function (e) { calculateRoomVolume(e, 'l'); });

  document.getElementById("room-volume")
  .addEventListener('change', function (e) { 
    room.volume = parseFloat(e.target.value);
    
    document.getElementById("room-height").value = 0;
    document.getElementById("room-width").value = 0;
    document.getElementById("room-length").value = 0;

    // updateGraphMeasured();
  });

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
    document.getElementById("room-volume").value = `${room.volume}`;
    return room.volume;
  } else {
    document.getElementById("room-volume").innerHTML = `Check values`;
  }
}

/* --- T60 INPUT AND CALC --- */ 

document.querySelectorAll('.t60-input').forEach(item => {
  item.addEventListener('change', e => {
    let idAsInt = e.target.id.split("t60_");
    idAsInt = parseInt(idAsInt[1]);

    let eValueAsFloat = parseFloat(e.target.value);

    if (typeof eValueAsFloat === 'number' && eValueAsFloat > 0) {
      switch (idAsInt) {
        case 63:
          room.t60_measured[0] = eValueAsFloat;
          room.a_measured[0] = calc_a_measured(room.t60_measured[0]);
          break;
        case 125:
          room.t60_measured[1] = eValueAsFloat;
          room.a_measured[1] = calc_a_measured(room.t60_measured[1]);
          break;
        case 250:
          room.t60_measured[2] = eValueAsFloat;
          room.a_measured[2] = calc_a_measured(room.t60_measured[2]);
          break;
        case 500:
          room.t60_measured[3] = eValueAsFloat;
          room.a_measured[3] = calc_a_measured(room.t60_measured[3]);
          break;
        case 1000:
          room.t60_measured[4] = eValueAsFloat;
          room.a_measured[4] = calc_a_measured(room.t60_measured[4]);
          break;
        case 2000:
          room.t60_measured[5] = eValueAsFloat;
          room.a_measured[5] = calc_a_measured(room.t60_measured[5]);
          break;
        case 4000:
          room.t60_measured[6] = eValueAsFloat;
          room.a_measured[6] = calc_a_measured(room.t60_measured[6]);
          break;
        case 8000:
          room.t60_measured[7] = eValueAsFloat;
          room.a_measured[7] = calc_a_measured(room.t60_measured[7]);
          break;
      }
    } 
    updateGraphMeasured();
  })
})

function roundTo1dec(x) {
  let result = Math.round(x * 10) / 10;
  return result;
}

function calc_a_measured(sec) {
  // T = (0.161 * room.volume) / Absorption (in m2_sabine) 
  // Absorption (in m2_sabine)  = (0.161 * room.volume) / T
  if(room.volume > 0 && typeof sec === 'number') {
    let sab = ((0.161 * room.volume) / sec);
    //sab = roundTo1dec(sab); // round to 1 decimal value
    return sab;
  } else { return 0; }
}

function updateGraphMeasured() {
  for(let i = 0; i < chart.data.datasets[1].data.length; i++) {
    chart.data.datasets[1].data[i] = room.t60_measured[i];
  }
  chart.update();
}

function updateGraphCalculated() {
  for(let i = 0; i < chart.data.datasets[0].data.length; i++) {
    chart.data.datasets[0].data[i] = roundTo1dec(room.t60_corrected[i]);
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

  calcAbsorption() {
    // multiply this materials absorbtion coefficient with the area covered by the material
    // to obtain the amount of absorption pr. octave, for this specific material

    for(let i = 0; i < this.material.aCoeffValues.length; i++){
      this.material.aCalculatedValues[i] = this.material.aCoeffValues[i] * this.material.a_m2;
    }
  }

  calcTotalAbsorption() {
    const totalA = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    
    for(let i = 0; i < room.a_addedMaterials.length; i++) {
      for(let j = 0; j < room.a_addedMaterials[i].aCalculatedValues.length; j++) {
        totalA[j] += room.a_addedMaterials[i].aCalculatedValues[j];
      }
    }

    
    for(let i = 0; i < totalA.length; i++) {
      // add measured a_sab pr. octave to totalA pr. octave
      totalA[i] = totalA[i] + room.a_measured[i];
      // Sabines formula
      room.t60_corrected[i] = (0.161 * room.volume) / totalA[i];
    }
  }

  addMaterial(name, a_m2, a63, a125, a250, a500, a1k, a2k, a4k, a8k) {
    const matSection = document.getElementById("materials-section");

    this.material = { 
      name: name,
      a_m2: a_m2,
      aCoeffValues: [a63, a125, a250, a500, a1k, a2k, a4k, a8k],
      aCalculatedValues: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    }
    this.calcAbsorption();
    const section = document.createElement('section');

    if(typeof name === 'string') {
      const now = new Date();
      section.id = `${name}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}`; // give unique identifier
      this.material.name = section.id;

      section.innerHTML = `
        <section id=${section.id} class="new-material">
            
        <header class="new-material-header">
          <h2 class="material-name">${this.material.name}</h2>
          <a class="material-delete-button" href="#">Delete Material</a>
        </header>

        <section class="material-input-area-covered">
          <div class="area-covered-form">
            <input type="number" min="0" step="0.1" class="area-covered-input" value="${this.material.a_m2}" placeholder="0" required>
            <label for="input-area-covered">m^2 covered by material</label>
          </div>
        </section>

        <section class="material-input-flex">
          <div class="material-input-units-flex">
            <div class="material-input-units-top">
              <ul>
                <li>Hz</li>
                <li>a</li>
              </ul>
            </div>
            <div>
              <ul>
                <li>Hz</li>
                <li>a</li>
              </ul>
            </div>
          </div>
          
          <div class="material-input-a-flex">
            <div class="material-63to500Hz">
              <div class="material-form">
                <label for="63hz">63</label>
                <div class="material-input-flex">
                  <input type="number" min="0" step="0.01" class="material-input" value="${this.material.aCoeffValues[0]}" placeholder="0.1" required>
                </div>
              </div>
              <div class="material-form">
                <label for="125hz">125</label>
                <div class="material-input-flex">  
                  <input type="number" min="0" step="0.01" class="material-input" value="${this.material.aCoeffValues[1]}" placeholder="0.7" required>
                </div>
              </div>
              <div class="material-form">
                <label for="250hz">250</label>
                <div class="material-input-flex">  
                  <input type="number" min="0" step="0.01" class="material-input" value="${this.material.aCoeffValues[2]}" placeholder="0.7" required>
                </div>
              </div>
              <div class="material-form">
                <label for="500hz">500</label>
                <div class="material-input-flex"> 
                <input type="number" min="0" step="0.01" class="material-input" value="${this.material.aCoeffValues[3]}" placeholder="0.7" required>
              </div>
              </div>
            </div>
            <div class="material-1000to8000Hz">
              <div class="material-form">
                <label for="1000hz">1000</label>
                <div class="material-input-flex"> 
                  <input type="number" min="0" step="0.01" class="material-input" value="${this.material.aCoeffValues[4]}" placeholder="0.7" required>
                </div>
              </div>
              <div class="material-form">
                <label for="2000hz">2000</label>
                <div class="material-input-flex"> 
                  <input type="number" min="0" step="0.01" class="material-input" value="${this.material.aCoeffValues[5]}" placeholder="0.7" required>
                </div>
              </div>
              <div class="material-form">
                <label for="4000hz">4000</label>
                <div class="material-input-flex"> 
                  <input type="number" min="0" step="0.01" class="material-input" value="${this.material.aCoeffValues[6]}" placeholder="0.7" required>
                </div>
              </div>
              <div class="material-form">
                <label for="8000hz">8000</label>
                <div class="material-input-flex"> 
                  <input type="number" min="0" step="0.01" class="material-input" value="${this.material.aCoeffValues[7]}" placeholder="0.7" required>
                </div>
              </div>
            </div>
          </div>   
        
        </section>
      </section>
    `;

      room.a_addedMaterials.push(this.material); // save this material in addedMaterials[]
      this.calcTotalAbsorption();
      updateGraphCalculated();
      matSection.appendChild(section);
    } else {console.log('name is not a string');}
    
    console.log(this.material.aCalculatedValues);
    console.log(room);
  }

  deleteMaterial(target) {
    let nameOfMaterial = '';

    if(target.className === 'material-delete-button') {
      // link > header > div
      nameOfMaterial = target.parentElement.parentElement.id;
      target.parentElement.parentElement.remove();
    }
    
    for(let i = 0; i < room.a_addedMaterials.length; i++) {
      if(room.a_addedMaterials[i].name === nameOfMaterial) {
        room.a_addedMaterials.splice(i, 1);
      } 
    }
      
    this.calcTotalAbsorption();
    // update local storage
  }
}

const materials = new Material();


// EVENT LISTENERS
document.getElementById('thebtn').addEventListener('click',function(e) {
  materials.addMaterial(`Rockwool`, 10, 0.1,	0.1,	0.1,	0.1,	0.1,	0.1,	0.1,	0.1);
  e.preventDefault();
}, false);

document.querySelector('#materials-section').addEventListener('click', function(e) {
  materials.deleteMaterial(e.target); 
  e.preventDefault();
})