//initialize the demo tracks
let tracks = [
  {
    title: "Type Shit",
    artist: "Playboi Carti, Future, Travis Scott, Metro Boomin",
    album: "We Don't Trust You",
    source:
      "https://cdn.discordapp.com/attachments/1260667085902712864/1260667553668268133/Future_Metro_Boomin_-_Type_Shit_BaseNaija.mp3?ex=669027a6&is=668ed626&hm=8858684d52a065a9beb25d41d52406f1c1477fef9988321bfd3d12002205d393&",
    artwork: [
      {
        src: "https://townsquare.media/site/812/files/2024/03/attachment-future-metro-boomin-we-dont-trust-you-photo.jpg",
        sizes: "1080x1080",
        type: "image/jpeg",
      },
    ],
  },
];

//these are our basic custom audio controls
//in a real-world scenario, there would be more controls (previous track, next track, volume, etc)
//in this example, it only allows to pause and play
let playBtn = function () {
  return document.getElementById("play-btn");
};
let pauseBtn = function () {
  return document.getElementById("pause-btn");
};
let audio = function () {
  return document.getElementById("audio-player");
};

//this variable keeps in memory the index of the currently-playing song from the "tracks" array
let currentTrack = 0;

//this changes the src of the <audio> element to that of the next track (or back to the first once we've reached the end of the list)
function nextTrack() {
  currentTrack += 1;
  if (currentTrack >= tracks.length) {
    currentTrack = 0;
  }
  audio().src = tracks[currentTrack].source;
  playTrack();
}

//this changes the src of the <audio> element to that of the previous track (or the last one in the list if we're pressing previous when we're already playing the first)
function prevTrack() {
  currentTrack -= 1;
  if (currentTrack < 0) {
    currentTrack = tracks.length - 1;
  }
  audio().src = tracks[currentTrack].source;
  playTrack();
}

//call the play() function of the native <audio> element
//then update the compact player to show the details of the song with MediaSession
function playTrack() {
  //the first time we play a track, we get the first item in our track list and set it as the current track
  //you'd probably do this differently in a real-world scenario
  //when the player finishes a track, we need to tell the <audio> play the next one
  //reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
  if (!audio().src) {
    audio().src = tracks[currentTrack].source;
    audio().addEventListener("ended", nextTrack);
  }
  audio().play();
  setMediaSession();
  //some utility functions to hide/show our play/pause buttons custom controls in our app
  pauseBtn().classList.remove("hidden");
  playBtn().classList.add("hidden");
}

function pauseTrack() {
  audio().pause();
  //some utility functions to hide/show our play/pause buttons custom controls in our app
  playBtn().classList.remove("hidden");
  pauseBtn().classList.add("hidden");
  //we pause the playback state of the compact player
  navigator.mediaSession.playbackState = "paused";
}

//we reload the audio, and pause it.
function stopTrack() {
  audio().load();
  audio().pause();
}

//here is how you update the compact player with the details of the track/album/artist along with a artwork
//reference: https://developer.mozilla.org/en-US/docs/Web/API/MediaSession
function setMediaSession() {
  if (!navigator.mediaSession) {
    return;
  }
  let trackPlaying = tracks[currentTrack];
  navigator.mediaSession.metadata = new MediaMetadata({
    title: trackPlaying.title,
    artist: trackPlaying.artist,
    album: trackPlaying.album,
    artwork: trackPlaying.artwork,
  });
  //we tie the controls of the compact player to the controls of the <audio> element on the page
  //haven't implemented functions for seekbackward, seekforward, and seekto. See reference: https://developer.mozilla.org/en-US/docs/Web/API/MediaSession
  navigator.mediaSession.setActionHandler("play", playTrack);
  navigator.mediaSession.setActionHandler("pause", pauseTrack);
  navigator.mediaSession.setActionHandler("stop", stopTrack);
  navigator.mediaSession.setActionHandler("previoustrack", prevTrack);
  navigator.mediaSession.setActionHandler("nexttrack", nextTrack);
  //navigator.mediaSession.setActionHandler('seekbackward', function(){});
  //navigator.mediaSession.setActionHandler('seekforward',  function(){});
  //navigator.mediaSession.setActionHandler('seekto', function(){});
  navigator.mediaSession.playbackState = "playing";
}

//we report the playback position to the compact player every 300ms
//https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState
setInterval(function () {
  if (!audio() || audio().paused) {
    return;
  }
  if (!navigator.mediaSession) {
    return;
  }
  if (audio().duration > 0 === false) {
    return;
  }
  navigator.mediaSession.setPositionState({
    duration: parseInt(audio().duration),
    playbackRate: audio().playbackRate,
    position: parseInt(audio().currentTime),
  });
}, 300);
