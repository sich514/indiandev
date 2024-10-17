// Function to make the window draggable
function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (elmnt.querySelector(".title-bar")) {
      elmnt.querySelector(".title-bar").onmousedown = dragMouseDown;
  } else {
      elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;

      // Bring the clicked window to the front
      elmnt.style.zIndex = getTopZIndex() + 1;
  }

  function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
  }
}

// Function to close the window
function closeWindow(windowElement) {
  windowElement.style.display = 'none';
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Contract address copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

let audio; // This will hold our audio element

// Function to set up audio
function setupAudio() {
    audio = new Audio('song.mp3'); // Replace with your audio file path
    audio.loop = true; // This will make the audio loop
    audio.volume = 0.5; // Set initial volume to 50%
}

// Function to toggle play and pause for audio
function togglePlayPause() {
    if (audio.paused) {
        audio.play();
        document.getElementById('play-pause-button').textContent = 'Pause';
    } else {
        audio.pause();
        document.getElementById('play-pause-button').textContent = 'Play';
    }
}

// Function to set audio volume
function setVolume(value) {
    if (audio) {
        audio.volume = value / 100;
    }
}

// Function to set up draggable windows
function setupWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  
  dragElement(windowElement);
  
  const closeButton = windowElement.querySelector('.title-bar-controls button[aria-label="Close"]');
  if (closeButton) {
      closeButton.addEventListener('click', () => closeWindow(windowElement));
  }
  
  const buttons = windowElement.querySelectorAll('.window-body button');
  buttons.forEach(button => {
      if (button.id === 'buy-button') {
          // Do nothing for the BUY button
      } else if (button.id === 'copy-button') {
          button.addEventListener('click', () => copyToClipboard('CASOON'));
      } else if (button.id === 'play-pause-button') {
          button.addEventListener('click', togglePlayPause);
      } else {
          // This will handle OK buttons and any other buttons
          button.addEventListener('click', () => closeWindow(windowElement));
      }
  });

  // Setup volume slider if it exists in this window
  const volumeSlider = windowElement.querySelector('#volume-slider');
  if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));
  }
}

// Get the highest z-index for bringing windows to the front
function getTopZIndex() {
  return Math.max(
      ...Array.from(document.querySelectorAll('.window'))
          .map(el => parseInt(window.getComputedStyle(el).zIndex) || 0)
  );
}

// Video play button functionality
const video = document.getElementById('video');
const playButton = document.getElementById('play-button');

if (video && playButton) {
    playButton.addEventListener('click', () => {
        video.play();
        playButton.style.display = 'none'; // Hide play button once video starts
    });

    video.addEventListener('ended', () => {
        playButton.style.display = 'block'; // Show play button again when video ends
    });
}

// Setup audio
setupAudio();

// Setup all seven windows
for (let i = 1; i <= 7; i++) {
    setupWindow(`draggable-window-${i}`);
}
