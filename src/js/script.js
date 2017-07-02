var player = document.getElementById("player"); // The video and other media player
var playbutton = document.getElementById("playbutton");
var container = document.getElementById("container");

/* Player functions */

function play() {
	// Start playing and change button img
	player.play();
	playbutton.src = "img/pause.svg";
}

function pause() {
	// Stop playing and change button img
	player.pause()
	playbutton.src = "img/play.svg";
}

function toggle() {
	if (player.paused)
		play();
	else
		pause();
}

function move(time) {
	// Move in the timeline forward and backward
	player.currentTime += time;

	// Show image
	if (time > 0) {
		showAlert("forward.svg");
	}
	else if (time < 0) {
		showAlert("backward.svg");
	}
}

function setProgress(percent) {
	$("#progressbar #progress").css("width", percent + "%");
}

function setTime(seconds) {
	// Set the current time to a defined number in seconds
	var m = parseInt(seconds / 60);
	if (m < 10)
		m = "0" + m;

	var s = parseInt(seconds - m * 60);
	if (s < 10)
		s = "0" + s;

	$("#playertime").html(m + ":" + s);
}

function showAlert(url) {
	$("#alert").stop();
	$("#alert").attr("src", "img/" + url);
	$("#alert").fadeIn(1);
	$("#alert").fadeOut(700);
}

/* General functions */

function addMedia(url) {
    document.getElementById("myList").appendChild(node); 
}

function fullscreen() {
    var el = document.documentElement,
      rfs = el.requestFullscreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        || el.msRequestFullscreen 
    ;

    rfs.call(el);
}

/* Queue */

var queue = [];
function addMedia(url) {
	// Append a new media to the queue
	queue.push(url);
	if (queue.length == 1 && player.ended)
		nextMedia(); // Auto start playing if the queue was empty before
}

function instantMedia(url) {
	// Play instantly the selected video and pause the queue (will continue play after this video)
	queue.unshift(player.src);
	queue.unshift(url);
}	

function nextMedia() {
	if (queue.length >= 1) {

		// Make a cool fadeout effect
		$("#darkoverlay").fadeIn(1000);

		setTimeout(function() {
			player.src = queue.shift(); // Get the next video (and remove it from the queue)

			$("#darkoverlay").fadeOut(1000);
			setTimeout(function() {play();}, 1000);
		}, 1000);
	}
}

player.onended = function(e) {
      // Automagically continue in the queue when a clip finished
      pause();
      nextMedia();
    };

/* Update showed time and progress */
setInterval(function(){
	setProgress(player.currentTime / player.duration * 100);
	setTime(player.currentTime);
}, 500);

/* Idle timer */
function idle() {
	$("#controlbar").fadeOut(1500);
}

function awake() {
	$("#controlbar").fadeIn(200);
}

var idletime = 0;
var maxidletime = 3; 
setInterval(function() {
  idletime++;

  if (idletime > maxidletime * 10)
    // 3 sek
    idle();
}, 100);

 $( "body" ).mousemove(function( event ) {
  idletime = 0;
  awake();
});

 /* Key input */
window.onkeydown = function(e) {
	var key = e.keyCode ? e.keyCode : e.which;

	if (key == 39)
	// -->
	{
		move(10);
	}

	else if (key == 37)
	// <--
	{
		move(-10);
	}

	else if (key == 32) 
	// space
	{
		if (player.paused){
			play();
			showAlert("play.svg"); // Show play image
		}
		else {
			pause();
			showAlert("pause.svg"); // Show pause image
		}
	}

	else {
		awake(); // Do awake if any other key pressed
   		idletime = 0; // Reset idle timer because a key has been pressed
   	}
}


/* Drag and drop */
container.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

var URL = window.URL || window.webkitURL;

container.addEventListener('drop', function(e) {

    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files; // Array of all files

    for (var i=0, file; file=files[i]; i++) { 
        	var type = file.type;
        	if (player.canPlayType(type)) {
        		var fileURL = URL.createObjectURL(file);
        		addMedia(fileURL);
        	}
        }
    }
);