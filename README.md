# capstone-synth
simple scheme -> https://dbdiagram.io/d/64ab73f502bd1c4a5ec46604

for this project I am using tone.js api to implement a sequencer that can be played with in the browser.
I built a sequencer class on top of tone.js sequencer functionality. the user creates data stored as json on the server simply by playing 
with the sequencer.  the server recieves the project data, stores it in database as json, and sends it back as json on request.
I wrote a function on the client side that is able to read the json received from the server and recreate the board (or boards) state
with the data.
