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
	player.currentTime += time;

	// Show image
	if (time > 0) {
		$("#forward").stop();
		$("#forward").fadeIn(1);
		$("#forward").fadeOut(700);
	}
	else if (time < 0) {
		$("#backward").stop();
		$("#backward").fadeIn(1);
		$("#backward").fadeOut(700);
	}
}

function setProgress(percent) {
	$("#progressbar #progress").css("width", percent + "%");
}

function setTime(seconds) {
	var m = parseInt(seconds / 60);
	if (m < 10)
		m = "0" + m;

	var s = parseInt(seconds - m * 60);
	if (s < 10)
		s = "0" + s;

	$("#playertime").html(m + ":" + s);
}

/* General functions */

function drop(event) {
	event.preventDefault();
	var data = event.dataTransfer.getData("text");
	event.target.appendChild(document.getElementById(data));
}

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
		if (player.paused)
			play();
		else 
			pause();
	}

	else {
		awake(); // Do awake if any other key pressed
   		idletime = 0; // Reset idle timer because a key has been pressed
   	}
}
