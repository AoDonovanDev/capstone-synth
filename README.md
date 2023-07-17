# capstone-synth
simple scheme -> https://dbdiagram.io/d/64ab73f502bd1c4a5ec46604

Meet sequin. A sequencer UI that plays in the browser.

deployed on render at https://sequin.onrender.com/

for this project I am using tone.js api to implement a sequencer that can be played in the browser.
  I built a sequencer class on top of tone.js sequencer functionality. the user creates data stored as json on the server simply by playing 
  with the sequencer.  the server recieves the project data, stores it in database as json, and sends it back as json on request.
  I wrote a function on the client side that is able to read the json received from the server and recreate the board (or boards) state
  with the data.

at this time, there are three instruments that can be selected or switched out mid sequence for each board.  the user can add as many board instances
  as they would like for each project, and each board instance also has an octave slider. the octave slider can be used to set the octave.

the Sequencer class contains all the playback and sequence building functions as well as instrument setting functionality. The Board class extends this
and contains the dom elements representing each board.  

To use sequin, simply sign up and you will be directed to the project creation page where the user will select major, minor, or chromatic mode and name their
  first project.  The project will be opened and start with one blank board. Simply click nodes on the sequencer display to select a note to be played back at
  that time in the loop.  Select an instrument, fiddle the octave slider, find something you like. Add another board. repeat.

 

sequin 1.0.0
