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

const roomDims = {
  h: 0,
  w: 0,
  l: 0
}

const calcH = document.getElementById("room-height").addEventListener('input', calculateRoomVolume());

function calculateRoomVolume (e, dim) {
  console.log(e, dim);
  if (typeof e.target.value === 'number' && dim === 'h') {                  
    roomDims.h = e.target.value;    
    const volume = roomDims.h * roomDims.w * roomDims.l;
    if (volume > 0) {
      console.log(`Volume is ${volume}`);
      return volume;
    }
  } else {
    alert('please only input numbers');
  } 
}

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

function addNewMaterial() {
  const matSection = document.getElementById("materials-section");

}

console.log(10,1 * 2);