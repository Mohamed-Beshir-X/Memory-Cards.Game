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
let welcomePage = document.querySelector(".developer")
let rankingScores = []
let gameInfo = document.querySelector("div.game-info")
let replayMain = document.querySelector(".again.main")
let closeMain = document.querySelector(".close.main")
let gameInfoBT = document.querySelector(".start span.game-info")
let firstPage = document.querySelector(".first-page")
let firstBT = document.querySelector(".first-page button")


firstBT.addEventListener("click", () => {
    setTimeout(() => welcomePage.remove(), 10000)
    setTimeout(() => welcomePage.classList.add("active"), 4000)
    firstBT.classList.add("clicked")
    document.querySelector("#correct").play()
    setTimeout(() => {
        document.querySelector("#intro").play()
        firstPage.classList.add("remove")
        setTimeout(() => firstPage.remove(), 500)
    }, 4000)
})


startBT.addEventListener("click", function () {
    if (theAlert.classList.contains("active")) {
        theAlert.classList.add("vibr")
        setTimeout(function () {
            theAlert.classList.remove("vibr")
        }, 1000)
    }
    theAlert.classList.add("active")
})

window.onclick = function (e) {
    if (e.target === startBT.parentNode) {
        theAlert.classList.remove("active")
    }
}

nameBT.onclick = function () {
    if (nameInput.value.trim() === "") {
        theAlert.classList.add("vibr")
        setTimeout(function () {
            theAlert.classList.remove("vibr")
        }, 1000)
    } else {
        nameInput.value = nameInput.value[0].toUpperCase() + nameInput.value.slice(1).toLowerCase()
        document.querySelector(".name span").innerHTML = nameInput.value
        document.querySelector(".start").remove()
        theAlert.remove()
        document.querySelector("#intro").pause()

        for (let i = 0; i < blocks.length; i++) {
            blocks[i].classList.add("flipped")
        }

        setTimeout(() => {
            for (let i = 0; i < blocks.length; i++) {
                blocks[i].classList.remove("flipped")
            }
            document.querySelector("#game").play()
            document.querySelector("#game").volume = 0.5
        }, 3000)

        // --- Countdown "3, 2, 1" before the game starts ---
        time.innerHTML = 3
        time.classList.add("starting")
        let startingTime = setInterval(() => {
            time.innerHTML--
        }, 1000)

        setTimeout(() => {
            clearInterval(startingTime)
            time.classList.remove("starting")
            time.innerHTML = 60

            // --- Single source of truth for the game timer (fixes the race
            // condition / "0" string-match bug from the original version) ---
            let timing = setInterval(() => {
                time.innerHTML--

                if (blocksContainer.classList.contains("end")) {
                    clearInterval(timing)
                    return
                }

                if (Number(time.innerHTML) <= 0) {
                    time.innerHTML = 0
                    clearInterval(timing)
                    lose()
                }
            }, 1000)
        }, 3000)
    }
}

let blocks = Array.from([...blocksContainer.children])
let blocksOrder = Array.from(blocks.keys())
// shuffle(blocksOrder)

let matched = []

blocks.forEach((block, i) => {
    block.style.order = blocksOrder[i]
    block.addEventListener("click", function () {
        // Guard: ignore clicks on a block that is already flipped/matched,
        // while two cards are being checked, or once the game has ended.
        // (Without this guard you could re-click matched pairs and inflate
        // `matched.length`, triggering a false win.)
        if (
            block.classList.contains("flipped") ||
            block.classList.contains("matched") ||
            blocksContainer.classList.contains("no-clicking") ||
            blocksContainer.classList.contains("end")
        ) {
            return
        }

        document.querySelector("#flip").play()
        flipping(block)

        if (block.classList.contains("matched")) {
            matched.push(block)

            if (matched.length === blocks.length / 2) {
                win()
            }
        }
    })
})

function shuffle(array) {
    let current = array.length,
        temp
    while (current > 0) {
        let random = Math.floor(Math.random() * current)
        current--
        temp = array[current]
        array[current] = array[random]
        array[random] = temp
    }
    return array
}

function flipping(selectedBlock) {
    selectedBlock.classList.add("flipped")

    let flippedBlocks = blocks.filter(block => block.classList.contains("flipped"))

    if (flippedBlocks.length === 2) {
        stopClicking()
        checkMatching(flippedBlocks[0], flippedBlocks[1])
    }
}

function stopClicking() {
    blocksContainer.classList.add("no-clicking")

    setTimeout(() => {
        blocksContainer.classList.remove("no-clicking")
    }, duration)
}

replayMain.addEventListener("click", () => location.reload())
closeMain.addEventListener("click", () => gameInfo.classList.remove("active"))
gameInfoBT.addEventListener("click", () => gameInfo.classList.add("active"))

function checkMatching(firstBlock, secondBlock) {
    let tries = document.querySelector(".info .tries span")
    if (firstBlock.dataset.shape === secondBlock.dataset.shape) {
        firstBlock.classList.remove("flipped")
        secondBlock.classList.remove("flipped")
        firstBlock.classList.add("matched")
        secondBlock.classList.add("matched")
        document.querySelector("#correct").play()
    } else {
        tries.innerHTML = Number(tries.innerHTML) + 1
        setTimeout(() => {
            firstBlock.classList.remove("flipped")
            secondBlock.classList.remove("flipped")
            document.querySelector("#wrong").play()
        }, duration)
    }
}

function lose() {
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
    closePop.addEventListener("click", function () {
        loseContainer.remove()
    })
    replay.addEventListener("click", function () {
        location.reload()
    })
    blocksContainer.classList.add("end")
    document.querySelector("#lose").play()
    document.querySelector("#game").pause()
}

function win() {
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
    let timeSoccerText = document.createTextNode(`You spent ${60 - Number(time.innerHTML)} seconds. Good job!`)
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
    closePop.addEventListener("click", function () {
        winContainer.remove()
    })
    document.querySelector("#win").play()
    document.querySelector("#game").pause()
    replay.addEventListener("click", function () {
        location.reload()
    })
    blocksContainer.classList.add("end")

    let playerName = document.querySelector(".name span").innerHTML
    let playerTries = Number(document.querySelector(".tries span").innerHTML)
    let existingScore = localStorage.getItem(playerName)

    // Only overwrite the stored score if this run has fewer mistakes
    // (or the player has no stored score yet).
    if (existingScore === null || playerTries < Number(existingScore)) {
        localStorage.setItem(playerName, playerTries)
    }

    resetRanking()
    ranking()
}

rankingBT.addEventListener("click", function () {
    if (rankingPage.classList.contains("open")) {
        rankingPage.classList.remove("open")
    } else {
        rankingPage.classList.add("open")
    }
})

function ranking() {
    rankingScores = []

    // Fix: iterating a live NodeList with forEach while removing its items
    // skips every other node. Convert to a static array first.
    Array.from(rankingContainer.childNodes).forEach((child) => {
        child.remove()
    })

    for (let [key, value] of Object.entries(localStorage)) {
        rankingScores.push(`${key}-${value}`)
    }

    // Fix: compare scores numerically, not as strings
    // (string comparison broke as soon as a score reached 2 digits,
    // e.g. "9" > "10" was true lexicographically).
    for (let i = 0; i < rankingScores.length; i++) {
        for (let j = rankingScores.length - 1; j > 0; j--) {
            let currentScore = Number(rankingScores[j].slice(rankingScores[j].indexOf("-") + 1))
            let prevScore = Number(rankingScores[j - 1].slice(rankingScores[j - 1].indexOf("-") + 1))
            if (currentScore > prevScore) {
                let temp = rankingScores[j - 1]
                rankingScores[j - 1] = rankingScores[j]
                rankingScores[j] = temp
            }
        }
    }

    for (let i = 0; i < rankingScores.length; i++) {
        let row = document.createElement("div")
        row.classList.add("row")
        row.classList.add(rankingScores[i])

        let playerName = document.createElement("div")
        let playerNameText = document.createTextNode(rankingScores[i].slice(0, rankingScores[i].indexOf("-")))
        playerName.classList.add("name")
        playerName.appendChild(playerNameText)

        let playerScore = document.createElement("div")
        let playerScoreText = document.createTextNode(rankingScores[i].slice(rankingScores[i].indexOf("-") + 1))
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

function resetRanking() {
    for (let i = 0; i < rankingContainer.childNodes.length; i++) {
        rankingContainer.childNodes[i].classList.add("none")
    }
}
