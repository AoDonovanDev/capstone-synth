import * as Tone from './tone/build/Tone.js'
let tonejs = window.Tone;

/* document.getElementById('projName').addEventListener('change', function(){
    currentProj.name = this.value;
    document.getElementById('projData').value = JSON.stringify(currentProj);
}) */



class Sequencer{
    constructor(beats, o=4, tuning='major', inst = new tonejs.Synth().toDestination()){
        this.o = o
        this.notes = {
            'chromatic': [`C${this.o+1}`, `B${this.o}`, `A#${this.o}`, `A${this.o}`, `G#${this.o}`, `G${this.o}`, `F#${this.o}`, `F${this.o}`, `E${this.o}`, `D#${this.o}`, `D${this.o}`, `C#${this.o}`, `C${this.o}`],
            'major': [`C${this.o+1}`, `B${this.o}`, `A${this.o}`, `G${this.o}`, `F${this.o}`, `E${this.o}`, `D${this.o}`, `C${this.o}`],
            'minor': [`C${this.o+1}`, `A#${this.o}`, `G#${this.o}`, `G${this.o}`, `F${this.o}`, `D#${this.o}`, `D${this.o}`, `C${this.o}`]
        }
        this.tuning = tuning;
        this.inst = inst;
        this.beats = beats;
        this.stopped = false;
        this.nodeCount = beats * this.notes[tuning].length
        this.count = 0;
        this.noteInc = 0;
        this.layer = true;
    }

    seqBuilder(){
        let seq = []
        for(let i = 0; i <this.beats; i++){
            let cur = document.querySelector(`.beat-${i}.active.bid-${this.id}`)
            if(cur != null){
                seq.push(cur.dataset.note)
            }
            else{
                seq.push(cur)
            }
        }
        tonejs.Transport.cancel()
        this.playSeq(seq, this.inst, .1)
        this.proj = {}
        this.proj.board = seq;
        this.proj.inst = this.inst.name;
        this.proj.o = this.o;
        this.proj.tuning = this.tuning
        currentProj[this.id] = this.proj;
        document.getElementById('projData').value = JSON.stringify(currentProj)
    }

    pauseSeq(){
        tonejs.Transport.pause()
    }

    stopClear(){
        tonejs.Transport.stop()
        tonejs.Transport.cancel()
        this.stopped = true
        this.proj = {};
        const activeNodes = document.querySelectorAll(`.active.bid-${this.id}`)
        for(let node of activeNodes){
            node.classList.remove('active')
            if(node.dataset.beat % 4 === 0){
                node.classList.add('gray')
            }
        }

    }

    seqClicker(e){
        const target = e.target
        const beat = document.querySelectorAll(`.beat-${target.dataset.beat}.bid-${target.dataset.bid}`)
        for(let node of beat){
            if(node === target){
                node.classList.toggle('active')
                if(node.dataset.beat % 4 === 0){
                    target.classList.toggle('gray')
                }
            }
            else{
                node.classList.remove('active')
                if(node.dataset.beat % 4 === 0){
                    node.classList.add('gray')
                }
            }
            
        }
        if(tonejs.context.state === 'running' && !this.stopped){
            this.seqBuilder()
        }
    }

    playSeq(sequence, inst, leg){
        this.stopped = false;
        if(!this.layer){
            tonejs.Transport.cancel();
        }
        const seq = new tonejs.Sequence((time, note) => {
        inst.triggerAttackRelease(note, leg, time);
        }, sequence).start(0);
        tonejs.Transport.start();
    }

    setSynth(){
        this.inst.dispose()
        this.inst = new tonejs.Synth().toDestination();
        this.seqBuilder();
    }

    setAMSynth(){
        this.inst.dispose()
        this.inst = new tonejs.AMSynth().toDestination();
        this.seqBuilder();
    }

    setDuoSynth(){
        this.inst.dispose()
        this.inst = new tonejs.DuoSynth().toDestination();
        this.seqBuilder();
    }
}



class Board extends Sequencer{
    constructor(beats, o=4, tuning='major', id = Math.floor(Math.random()*10000)){
        super(beats, o, tuning);
        this.proj = {};
        this.board = document.createElement('div')
        this.board.style.display = 'grid'
        this.board.style.border = '2px solid black'
        this.board.style.borderRadius = '8px'
        this.board.style.gridTemplateColumns = `repeat(${beats}, 1fr)`
        this.board.classList.add('artboard', 'artboard-horizontal', 'phone-4')
        this.id = id;
        this.seqClicker = this.seqClicker.bind(this)
        this.seqBuilder = this.seqBuilder.bind(this)
        this.playSeq = this.playSeq.bind(this)
        this.stopClear = this.stopClear.bind(this)
        this.setSynth = this.setSynth.bind(this)
        this.setAMSynth = this.setAMSynth.bind(this)
        this.setDuoSynth = this.setDuoSynth.bind(this)



        for(let i = 0; i < this.nodeCount; i++){
            /* create and render board */
            const node = document.createElement('div')
            node.classList.add('seqNode', `bid-${this.id}`)
            this.board.append(node)
        }
          
        this.instbrd = document.createElement('div')
        this.instbrd.classList.add('board')
        this.instbrd.append(this.board)
        document.getElementById('seqArea').append(this.instbrd)

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
            node.dataset.bid = this.id
            if(this.count === 16){
                this.count = 0;
                this.noteInc ++;
            }
        }

        this.synthBtn = document.createElement('button')
        this.synthBtn.textContent = 'synth'
        this.synthBtn.classList.add('btn', 'btn-neutral')

        this.AMSynthBtn = document.createElement('button')
        this.AMSynthBtn.textContent = 'AMsynth'
        this.AMSynthBtn.classList.add('btn', 'btn-accent')

        this.duoSynthBtn = document.createElement('button')
        this.duoSynthBtn.textContent = 'duo synth'
        this.duoSynthBtn.classList.add('btn', 'btn-primary')

        this.instbrd.prepend(this.synthBtn, this.AMSynthBtn, this.duoSynthBtn)

        this.synthBtn.addEventListener('click', this.setSynth)
        this.AMSynthBtn.addEventListener('click', this.setAMSynth)
        this.duoSynthBtn.addEventListener('click', this.setDuoSynth)
    }
}

let boardList = []
let currentProj = {}
let tuning = ''

const selected = document.querySelector('#selectedProject')
const newProj = document.querySelector('#newProj')
function recallState(proj){
    console.log(proj, proj.value)
    let instDict = {
        "Synth": new tonejs.Synth().toDestination(),
        "AMSynth": new tonejs.AMSynth().toDestination(),
        "DuoSynth": new tonejs.DuoSynth().toDestination()
    }
    let thisProject = JSON.parse(proj.value)
    currentProj = thisProject
    let bids = Object.keys(thisProject)
    tuning = bids[0].tuning
    for(let bid of bids){
        if(bid != 'name'){
        let bd = thisProject[bid]
        console.log(bd)
        let board = new Board(bd.board.length, bd.o, bd.tuning, bid)
        console.log(bd.board)
        board.inst = instDict[bd.inst]
        boardList.push(board)
        let count = 0;
        for(let node of bd.board){
            if(node){
                let column = document.querySelectorAll(`.beat-${count}.bid-${bid}`)
                console.log(column)
                for(let note of column){
                    if(note.dataset.note === node){
                        if(note.dataset.beat % 4 === 0){
                            note.classList.toggle('gray')
                        }
                        note.classList.add('active')
                    }
                }
            }
            count++
        }
    }
    }
}
if(selected){
    recallState(selected)
}
if(newProj){
    let data = JSON.parse(newProj.value)
    console.log(data)
    boardList.push(new Board(16, 3, data.tuning))
    tuning = data.tuning
    currentProj.name = data.name
}
/* else{
const projects = document.querySelectorAll('.projects')
if(projects.length === 0){
    const a = new Board(16, 3);
    boardList.push(a)
}
else{
    currentProj = JSON.parse(projects[0].value)
    recallState(projects[0])
}


} */

const abtn = document.createElement('button')
const bbtn = document.createElement('button')
const cbtn = document.createElement('button')
const cntrls = document.createElement('div')
abtn.textContent = 'start'
bbtn.textContent = 'stop'
cbtn.textContent = 'pause'
abtn.classList.add('btn', 'btn-success')
bbtn.classList.add('btn', 'btn-error')
cbtn.classList.add('btn', 'btn-warning')
cntrls.append(abtn, bbtn, cbtn)
document.getElementById('seqArea').prepend(cntrls)

abtn.addEventListener('click', function(){
    for(let board of boardList){
        board.seqBuilder = board.seqBuilder.bind(board)
    }
    if(tonejs.context.state != 'running'){
        tonejs.start()
        for(let board of boardList){
            board.seqBuilder()
        }
    }
    else if(tonejs.context.state === 'running'){
        for(let board of boardList){
            board.seqBuilder()
        }
    }
})

bbtn.addEventListener('click', function(){
    for(let board of boardList){
        board.stopClear = board.stopClear.bind(board)
        board.stopClear()
    }
})

cbtn.addEventListener('click', function(){
    for(let board of boardList){
        board.pauseSeq = board.pauseSeq.bind(board)
        board.pauseSeq()
    }
})

placeAddBtn()
function placeAddBtn(){
    const isbtn = document.querySelector('#addBtn')
    if(isbtn){
        isbtn.remove()
    }
    const boards = document.querySelectorAll('.board')
    const last = boards[boards.length-1]
    const addBtn = document.createElement('img')
    const addDiv = document.createElement('div')
    addBtn.addEventListener('click', function(){
        boardList.push(new Board(16, 3, tuning));
        placeAddBtn()
    })
    addDiv.classList.add('flex-end')
    addBtn.classList.add('w-24', 'rounded', 'avatar', 'btn-ghost')
    addBtn.id = 'addBtn'
    addBtn.src = '../static/add2.png'
    addDiv.append(addBtn)
    last.append(addDiv)
}



