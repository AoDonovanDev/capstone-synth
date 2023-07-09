import * as Tone from './tone/build/Tone.js'
let tonejs = window.Tone;

document.addEventListener('keydown', keyPlay)


class Sequencer{
    constructor(beats, o=4, tuning='major'){
        self = this;
        this.o = o
        this.notes = {
            'chromatic': [`C${this.o+1}`, `B${this.o}`, `A#${this.o}`, `A${this.o}`, `G#${this.o}`, `G${this.o}`, `F#${this.o}`, `F${this.o}`, `E${this.o}`, `D#${this.o}`, `D${this.o}`, `C#${this.o}`, `C${this.o}`],
            'major': [`C${this.o+1}`, `B${this.o}`, `A${this.o}`, `G${this.o}`, `F${this.o}`, `E${this.o}`, `D${this.o}`, `C${this.o}`],
            'minor': [`C${this.o+1}`, `A#${this.o}`, `G#${this.o}`, `G${this.o}`, `F${this.o}`, `D#${this.o}`, `D${this.o}`, `C${this.o}`]
        }
        this.inst = null
        this.beats = beats
        this.nodeCount = beats * this.notes[tuning].length
        this.count = 0;
        this.noteInc = 0;
        this.layer = true;
        this.proj = {};
        this.board = document.createElement('div')
        this.board.style.display = 'grid'
        this.board.style.border = '2px solid black'
        this.board.style.borderRadius = '8px'
        this.board.style.gridTemplateColumns = `repeat(${beats}, 1fr)`
        this.board.classList.add('artboard', 'artboard-horizontal', 'phone-4')
        this.id = Math.floor(Math.random()*100);
        for(let i = 0; i < this.nodeCount; i++){
            /* create and render board */
            const node = document.createElement('div')
            node.classList.add('seqNode', `bid-${this.id}`)
            this.board.append(node)
        }
        document.getElementById('seqArea').append(this.board)
        this.nodes = document.querySelectorAll(`.seqNode.bid-${this.id}`)
        for(let node of this.nodes){
            /* map counts and notes to sequence board */
            node.dataset.beat = this.count;
            node.dataset.note = this.notes[tuning][this.noteInc];
            node.classList.add(`beat-${this.count}`)
            if(this.count % 4 === 0){
                node.classList.add('gray')
            }
            this.count ++;
            node.addEventListener('click', this.seqClicker) 
            if(this.count === 16){
                this.count = 0;
                this.noteInc ++;
            }
        }
        this.startBtn = document.createElement('button')
        this.startBtn.textContent = "start"
        this.startBtn.classList.add('btn', 'btn-success')

        this.pauseBtn = document.createElement('button')
        this.pauseBtn.textContent = "pause"
        this.pauseBtn.classList.add('btn', 'btn-warning')

        this.stopBtn = document.createElement('button')
        this.stopBtn.textContent = "stop/clear"
        this.stopBtn.classList.add('btn', 'btn-error')

        this.board.after(this.startBtn)
        this.startBtn.after(this.pauseBtn)
        this.pauseBtn.after(this.stopBtn)
        
        this.stopBtn.addEventListener('click', this.stopClear)
        this.startBtn.addEventListener('click', this.seqBuilder)   
        this.pauseBtn.addEventListener('click', this.pauseSeq)

        this.synthBtn = document.createElement('button')
        this.synthBtn.textContent = 'synth'
        this.synthBtn.classList.add('btn', 'btn-neutral')

        this.AMSynthBtn = document.createElement('button')
        this.AMSynthBtn.textContent = 'AMsynth'
        this.AMSynthBtn.classList.add('btn', 'btn-accent')

        this.duoSynthBtn = document.createElement('button')
        this.duoSynthBtn.textContent = 'duo synth'
        this.duoSynthBtn.classList.add('btn', 'btn-primary')


        document.getElementById('seqArea').prepend(this.duoSynthBtn)
        document.getElementById('seqArea').prepend(this.synthBtn)
        document.getElementById('seqArea').prepend(this.AMSynthBtn)

        this.synthBtn.addEventListener('click', function(){
            self.inst = new tonejs.Synth().toDestination();
            self.seqBuilder();
        })
        this.AMSynthBtn.addEventListener('click', function(){
            self.inst = new tonejs.AMSynth().toDestination();
            self.seqBuilder();
        })
        this.duoSynthBtn.addEventListener('click', function(){
            self.inst = new tonejs.DuoSynth().toDestination();
            self.seqBuilder();
        })
        console.log(self.id)
    }
    
    seqClicker(){
        const beat = document.querySelectorAll(`.beat-${this.dataset.beat}.bid-${self.id}`)
        console.log(beat)
        for(let node of beat){
            if(node === this){
                node.classList.toggle('active')
                if(node.dataset.beat % 4 === 0){
                    this.classList.toggle('gray')
                }
            }
            else{
                node.classList.remove('active')
                if(node.dataset.beat % 4 === 0){
                    node.classList.add('gray')
                }
            }
            
        }
        if(tonejs.context.state === 'running'){
            self.seqBuilder()
        }
    }

    seqBuilder(){
        let seq = []
        for(let i = 0; i <self.beats; i++){
            let cur = document.querySelector(`.beat-${i}.active`)
            if(cur != null){
                seq.push(cur.dataset.note)
            }
            else{
                seq.push(cur)
            }
        }
        self.playSeq(seq, self.inst, .1)
        self.proj[self.inst] = seq;
        console.log(self.proj)
        console.log(seq)
    }

    playSeq(sequence, inst, leg){
        if(!this.layer){
            tonejs.Transport.cancel();
        }
        const seq = new tonejs.Sequence((time, note) => {
        inst.triggerAttackRelease(note, leg, time);
        }, sequence).start(0);
        tonejs.Transport.start();
        console.log(seq)
    }

    pauseSeq(){
        tonejs.Transport.pause()
    }

    stopClear(){
        tonejs.Transport.stop()
        tonejs.Transport.cancel()
        self.proj = {};
        const activeNodes = document.querySelectorAll('.active')
        for(let node of activeNodes){
            node.classList.remove('active')
            if(node.dataset.beat % 4 === 0){
                node.classList.add('gray')
            }
        }

    }
}

const a = new Sequencer(16);


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
