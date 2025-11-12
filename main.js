let startBT = document.querySelector(".start span.start-game")
let theAlert = document.querySelector(".alert")
let nameBT = document.querySelector(".alert span")
let nameInput = document.querySelector(".alert .input input")
let blocksContainer = document.querySelector(".game-blocks")
let time = document.querySelector(".info .time")
let duration = 1000
let rankingPage = document.querySelector(".ranking")
let rankingBT = document.querySelector(".ranking .button")
let rankingContainer = document.querySelector(".ranking .ra-container")
let welcomePage = document.querySelector(".developer" )
let rankingScores = []
let gameInfo = document.querySelector("div.game-info")
let repalyMain = document.querySelector(".again.main")
let closeMain = document.querySelector(".close.main")
let gameInfoBT = document.querySelector(".start span.game-info")
let firstPage = document.querySelector(".first-page")
let firstBT = document.querySelector(".first-page button")




firstBT.addEventListener("click" , () => {
    setTimeout(() => welcomePage.remove(),10000)
    setTimeout(() => welcomePage.classList.add("active"),4000)
    firstBT.classList.add("clicked")
    document.querySelector("#correct").play()
    setTimeout(()=>{
        document.querySelector("#intro").play()
        firstPage.classList.add("remove")
        setTimeout(()=> firstPage.remove(),500)
    }, 4000)
})




startBT.addEventListener("click" , function(){
    if(theAlert.classList.contains("active")){
        theAlert.classList.add("vibr")
        setTimeout(function(){
            theAlert.classList.remove("vibr")
        }, 1000)
    }
    theAlert.classList.add("active")
})

window.onclick = function(e){
    if (e.target === startBT.parentNode){
        theAlert.classList.remove("active")
    }
}
nameBT.onclick = function(){
    if(nameInput.value === ""){
        theAlert.classList.add("vibr")
        setTimeout(function(){
            theAlert.classList.remove("vibr")
        }, 1000)
    }else{
        nameInput.value = nameInput.value[0].toUpperCase()+nameInput.value.slice(1).toLowerCase()
        document.querySelector(".name span").innerHTML = nameInput.value
        document.querySelector(".start").remove()
        theAlert.remove()
        document.querySelector("#intro").pause()
        for(let i = 0; i < blocks.length ; i++){
            blocks[i].classList.add("flipped")
        }
        setTimeout((block) =>{
            for(let i = 0; i < blocks.length ; i++){
                blocks[i].classList.remove("flipped")
            }
            document.querySelector("#game").play()
            document.querySelector("#game").volume = 0.5
        },3000)
        time.innerHTML = 3
        time.classList.add("starting")
        let startingTime = setInterval(()=>{
            time.innerHTML--
        },1000)
        setTimeout (() =>{
            clearInterval(startingTime)
            time.classList.remove("starting")
            time.innerHTML = 60
            let timing = setInterval(() => {
                time.innerHTML--
                if(blocksContainer.classList.contains("end")){
                    clearInterval(timing)
                }
            },1000);
            setTimeout(() =>{
            clearInterval(timing)
            if(time.innerHTML === "0"){
                lose()
            }
        },60000)
        }, 3000)
        
    }
}

let blocks = Array.from([...blocksContainer.children])
let blocksOrder = Array.from(blocks.keys())
// shuffle(blocksOrder)

let matched = []

blocks.forEach((block , i ) =>{
    block.style.order = blocksOrder[i]
    block.addEventListener("click" , function(){
        document.querySelector("#flip").play()
        flipping(block)
        if(block.classList.contains("matched")){
            matched.push(block)
            
            if(matched.length === blocks.length / 2){
                win()
            }
        }
    })
})

function shuffle (array){
    let current = array.length,
        temp
    while (current > 0){
        let random = Math.floor(Math.random() * current)
        current--
        temp = array[current]
        array[current] = array[random]
        array[random] = temp
    }
    return array
}

function flipping (selectedBlock){
    selectedBlock.classList.add("flipped")

    let flippedBlocks = blocks.filter(block => block.classList.contains("flipped"))

    if(flippedBlocks.length === 2 ){
        stopClicking()
        checkMatching(flippedBlocks[0] , flippedBlocks[1])
    }
}

function stopClicking(){
    blocksContainer.classList.add("no-clicking")

    setTimeout (() =>{
        blocksContainer.classList.remove("no-clicking")
    }, duration)
}
repalyMain.addEventListener("click" , ()=> location.reload())
closeMain.addEventListener("click" , ()=> gameInfo.classList.remove("active"))
gameInfoBT.addEventListener("click" , ()=> gameInfo.classList.add("active"))
function checkMatching(fristBlock ,secondBlock){
    let tries = document.querySelector(".info .tries span")
    if(fristBlock.dataset.shape === secondBlock.dataset.shape) {
        fristBlock.classList.remove("flipped")
        secondBlock.classList.remove("flipped")
        fristBlock.classList.add("matched")
        secondBlock.classList.add("matched")
        document.querySelector("#correct").play()
    }else{
        tries.innerHTML++
        setTimeout(() =>{
            fristBlock.classList.remove("flipped")
            secondBlock.classList.remove("flipped")
            document.querySelector("#wrong").play()
        },duration)
    }
}






function lose(){
    let loseContainer = document.createElement("div")
    let loseDiv = document.createElement("div")
    let loseLayer = document.createElement("div")
    let loseHead = document.createElement("h2")
    let replay = document.createElement("i")
    let closePop = document.createElement("i")
    let headText = document.createTextNode("Time Out")
    let soccer = document.createElement("p")
    let soccerText = document.createTextNode(`You have made ${document.querySelector(".info .tries span").innerHTML} mistakes`)
    soccer.appendChild(soccerText)
    loseContainer.appendChild(loseDiv)
    loseContainer.appendChild(loseLayer)
    loseHead.appendChild(headText)
    loseDiv.appendChild(loseHead)
    loseDiv.appendChild(soccer)
    loseDiv.appendChild(replay)
    loseDiv.appendChild(closePop)
    document.body.appendChild(loseContainer)
    loseContainer.classList.add("lose-container")
    loseDiv.classList.add("lose")
    loseLayer.classList.add("lose-layer")
    replay.classList.add("fas")
    replay.classList.add("fa-redo")
    replay.classList.add("again")
    closePop.classList.add("fas")
    closePop.classList.add("fa-close")
    closePop.classList.add("close")
    closePop.addEventListener("click" , function(){
        loseContainer.remove()
    })
    replay.addEventListener("click" , function(){
        location.reload()
    })
    blocksContainer.classList.add("end")
    document.querySelector("#lose").play()
    document.querySelector("#game").pause()
}
function win(){
    let winContainer = document.createElement("div")
    let winDiv = document.createElement("div")
    let winLayer = document.createElement("div")
    let winHead = document.createElement("h2")
    let replay = document.createElement("i")
    let closePop = document.createElement("i")
    let headText = document.createTextNode("You Did It")
    let congratulation = document.createElement("p")
    let soccer = document.createElement("p")
    let congratulationText = document.createTextNode(`Try to reduce your wrong tries to be the master`)
    let checkText = document.createTextNode(`Check the leaderboard`)
    let timeSoccer = document.createElement("p")
    let timeSoccerText = document.createTextNode(`You spend ${60 - +time.innerHTML} second Gooooood!`)
    let soccerText = document.createTextNode(`You had made ${document.querySelector(".info .tries span").innerHTML} mistakes`)
    congratulation.appendChild(congratulationText)
    soccer.appendChild(soccerText)
    timeSoccer.appendChild(timeSoccerText)
    winContainer.appendChild(winDiv)
    winContainer.appendChild(winLayer)
    winHead.appendChild(headText)
    winDiv.appendChild(winHead)
    winDiv.appendChild(timeSoccer)
    winDiv.appendChild(soccer)
    winDiv.appendChild(congratulation)
    winDiv.appendChild(checkText)
    winDiv.appendChild(replay)
    winDiv.appendChild(closePop)
    document.body.appendChild(winContainer)
    winContainer.classList.add("win-container")
    winDiv.classList.add("win")
    winLayer.classList.add("win-layer")
    replay.classList.add("fas")
    replay.classList.add("fa-redo")
    replay.classList.add("again")
    closePop.classList.add("fas")
    closePop.classList.add("fa-close")
    closePop.classList.add("close")
    closePop.addEventListener("click" , function(){
        winContainer.remove()
    })
    document.querySelector("#win").play()
    document.querySelector("#game").pause()
    replay.addEventListener("click" , function(){
        location.reload()
    })
    blocksContainer.classList.add("end")
    let winner = `${document.querySelector(".name span").innerHTML}-${document.querySelector(".tries span").innerHTML}`
    let array = []
    for(let i = 0; i < rankingScores.length; i++){
        if(winner.slice(0 , winner.indexOf("-")) === rankingScores[i].slice(0 , rankingScores[i].indexOf("-")) ){
            
            if(+winner.slice(winner.indexOf("-")+1) < +rankingScores[i].slice(rankingScores[i].indexOf("-")+1)){
                localStorage.setItem(document.querySelector(".name span").innerHTML , document.querySelector(".tries span").innerHTML)
            }
        }else{
            array.push(rankingScores[i])
            if(array.length === rankingScores.length){
                localStorage.setItem(document.querySelector(".name span").innerHTML , document.querySelector(".tries span").innerHTML)
            }
        }
        
    }
    if(rankingContainer.children.length === 0){
        localStorage.setItem(document.querySelector(".name span").innerHTML , document.querySelector(".tries span").innerHTML)
    }
    resetRanking()
    ranking()
}
rankingBT.addEventListener("click" , function(){
    if(rankingPage.classList.contains("open")){
        rankingPage.classList.remove("open")
    }else{
        rankingPage.classList.add("open")
    }
})


function ranking(){
    rankingScores = []
    rankingContainer.childNodes.forEach((child) =>{
        child.remove()
    })
    for (let [key , value] of Object.entries(localStorage)){
        rankingScores.push(`${key}-${value}`)
    } 
    let current = rankingScores.length,
    temp,
    orderedRanking = []                                                                          
    for(let i = 0; i < rankingScores.length ; i++){
        while(current > 1){
            current --
            if (rankingScores[current].slice(rankingScores[current].indexOf("-")) > rankingScores[current-1].slice(rankingScores[current-1].indexOf("-"))){
                temp = rankingScores[current - 1]
                rankingScores[current - 1] = rankingScores[current]
                rankingScores[current] = temp
            }                                                                          
        }
        current = rankingScores.length
    }
    
    for (let i = 0; i < rankingScores.length; i++){
        let row = document.createElement("div")
        row.classList.add("row")
        row.classList.add(rankingScores[i])
        let playerName = document.createElement("div")
        let playerNameText = document.createTextNode(rankingScores[i].slice(0 , rankingScores[i].indexOf("-") ))
        playerName.classList.add("name")
        playerName.appendChild(playerNameText)
        let playerScore = document.createElement("div")
        let playerScoreText = document.createTextNode(rankingScores[i].slice(rankingScores[i].indexOf("-")+1))
        playerScore.appendChild(playerScoreText)
        playerScore.classList.add("score")
        let playerRanking = document.createElement("div")
        let playerRankingText = document.createTextNode(rankingScores.length - i)
        playerRanking.appendChild(playerRankingText)
        playerRanking.classList.add("p")
        row.appendChild(playerName)
        row.appendChild(playerScore)
        row.appendChild(playerRanking)
        rankingContainer.prepend(row)
    }
}
ranking()

function resetRanking(){
    for(let i = 0; i < rankingScores.length; i++){
        rankingContainer.childNodes[i].classList.add("none")
    }
}
