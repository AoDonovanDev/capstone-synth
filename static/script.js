import * as Tone from './tone/build/Tone.js'
let tonejs = window.Tone;



for(let i = 0; i < 128; i++){
    const node = document.createElement('div')
    node.classList.add('seqNode')
    document.querySelector('#seqBox').append(node)
}


const keys = document.querySelectorAll('.kbd')
const nodes = document.querySelectorAll('.seqNode')
document.querySelector('#startBtn').addEventListener('click', seqBuilder)
document.querySelector('#pauseBtn').addEventListener('click', stopSeq)
document.addEventListener('keydown', keyPlay)

let count = 0
let noteInc = 0;
let notes = ['C', 'B', 'A', 'G', 'F', 'E', 'D', 'C']
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


for(let key of keys){
    key.addEventListener('click', clickPlay)
}
for(let node of nodes){
    /* map counts and notes to sequence board */
    node.dataset.beat = count;
    node.dataset.note = notes[noteInc];
    node.classList.add(`beat-${count}`)
    count ++;
    node.addEventListener('click', seqClicker)
    if(count === 16){
        count = 0;
        noteInc ++;
    }
}
function seqClicker(){
    const beat = document.querySelectorAll(`.beat-${this.dataset.beat}`)
    console.log(beat)
    for(let node of beat){
        if(node === this){
            node.classList.toggle('active')
        }
        else{
            node.classList.remove('active')
        }
        
    }
    console.log(this)

}

function seqBuilder(){
    let seq = []
    for(let i = 0; i <16; i++){
        let cur = document.querySelector(`.beat-${i}.active`)
        if(cur != null){
            seq.push(cur.dataset.note+4)
        }
        else{
            seq.push(cur)
        }
    }
    playSeq(seq)
}
 
function playSeq(sequence){
    tonejs.Transport.cancel();
    const synth = new tonejs.Synth().toDestination();
    const seq = new tonejs.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
    }, sequence).start(0);
    tonejs.Transport.start();
    console.log(seq)
    setTimeout(() => {
        console.log("guesses");
      }, 1536);
    console.log(tonejs.Destination.blockTime)
    console.log(tonejs.Transport.bpm.value)
    console.log(tonejs.Transport.progress)
}

function stopSeq(){
    tonejs.Transport.cancel()
}




function clickPlay(){
    if(tonejs.context.state != 'running'){
        tonejs.start()
    }
    const synth = new tonejs.PolySynth().toDestination();
   
    synth.triggerAttackRelease(`${this.id}4`, "8n");
}   

function keyPlay(e){
    console.log(e)
    if(e.key in keyDict){

    if(tonejs.context.state != 'running'){
        tonejs.start()
    }
    const synth = new tonejs.PolySynth().toDestination();
    
    synth.triggerAttackRelease(`${keyDict[e.key]}4`, "8n");
    }
}
