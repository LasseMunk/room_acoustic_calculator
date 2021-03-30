const roomHeight = 0,
      roomWidth = 0,
      roomLength = 0;

// Event Listeners
roomHeight = document.getElementById('room-height').addEventListener('submit', function(e){ } );

function calculateRoomCubic (h, w, l) {
  const result = 0;

  if (typeof h === 'number' && 
      typeof w === 'number' && 
      typeof l === 'number') {
        return h * w * l;
  } else {
    alert('please only input numbers');
  } 
}