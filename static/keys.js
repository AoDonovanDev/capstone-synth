document.addEventListener('keydown', keyPlay)
const keys = document.querySelectorAll('.kbd')
for(let key of keys){
    key.addEventListener('click', clickPlay)
}

function clickPlay(){
    if(tonejs.context.state != 'running'){
        tonejs.start()
    }
    console.log(this)
    const synth = new tonejs.PolySynth().toDestination();
   
    synth.triggerAttackRelease(`${this.id}4`, "8n");
}   

function keyPlay(e){
    const keyDict = {
        /* dictionary mapping keyboard keys to notes */
        'a': 'C',
        's': 'D',
        'd': 'E',
        'f': 'F',
        'g': 'G',
        'h': 'A',
        'j': 'B',
        'w': 'C#',
        'e': 'D#',
        't': 'F#',
        'y': 'G#',
        'u': 'A#'
    }
    if(e.key in keyDict){

    if(tonejs.context.state != 'running'){
        tonejs.start()
    }
    const synth = new tonejs.Synth().toDestination();
    
    synth.triggerAttackRelease(`${keyDict[e.key]}4`, "8n");
    }
}
