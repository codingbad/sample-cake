'use strict';

window.$ = window.jQuery = require('jquery');
const recognition = new webkitSpeechRecognition();

let transcript = '',
listening = false,
canSpeak = false,
canListen = false,
synthesis;

if ('speechSynthesis' in window) {

  console.log('Can speak.');

  canSpeak = true;
  synthesis = window.speechSynthesis;

} else {
  console.log('No speech support.');
}

if ('webkitSpeechRecognition' in window) {

  console.log('Can listen');

  canListen = true;

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {

    console.log('Listening..');

    $('#status-text').text('Listening..');
  }

  recognition.onresult = (event) => {

    let intermediate = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {

      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      } else {
        intermediate += event.results[i][0].transcript;
      }
    }
    $('#intermediate').text(intermediate);
    $('final').text(transcript);
  }

  recognition.onerror = (event) => {

    console.log('Error');
    console.log(event);
    $('#status-text').text("Error");

  }

  recognition.onend = () => {
    console.log('Done.')
    console.log(transcript);
    listening = false;
  }
} else {
  console.log('No recognition support');
}


function doListen() {

  if (!canListen) {
    console.log('Cannot listen in this environment.');
    return;
  }

  if (listening) {
    console.log('Already listening.');
    return;
  }

  transcript = '';
  listening = true;

  recognition.start();
}

function doSpeak (text) {
	if (canSpeak && recognition.lang === 'en-US') {
		var phrase = new SpeechSynthesisUtterance(text);
		synthesis.speak(phrase);
	}
}
