function drawScreen(teamsList, includeListeners) {

    let scorepage = ``;
    let teamCount = teamsList.length;

    let root = document.documentElement;
    root.style.setProperty(`--default-font-size-landscape`, `40vh`);
    root.style.setProperty(`--default-font-size-portrait`, `25vh`);

    let widthtop = `50%`;
    let widthBottom = `100%`;
    let height = `100%`;

    if (teamCount > 2) {
        height = `50%`;
    }
    if (teamCount === 1) {
        widthtop = `100%`;
    }
    if (teamCount <= 2) {
        root.style.setProperty(`--default-font-size-landscape`, `70vh`);
        root.style.setProperty(`--default-font-size-portrait`, `28vh`);
    }
    if (teamCount > 4) {
        root.style.setProperty(`--default-font-size-portrait`, `14vh`);
    }
    if (teamCount >= 7) {
        root.style.setProperty(`--default-font-size-landscape`, `30vh`);
        root.style.setProperty(`--default-font-size-portrait`, `12vh`);
    }
    if (teamCount === 4) {
        widthBottom = `50%`;
    }
    if (teamCount === 5) {
        widthtop = `33.33%`;
        widthBottom = `50%`;
    }
    if (teamCount === 6) {
        widthtop = `33.33%`;
        widthBottom = `33.33%`;
    }
    if (teamCount === 7) {
        widthtop = `25%`;
        widthBottom = `33.33%`;
    }
    if (teamCount === 8) {
        widthtop = `25%`;
        widthBottom = `25%`;
    }

    // console.log(`teamCount: ${teamCount} + ${widthtop} = ${widthBottom}`)

    for (let i = 0; i < teamCount; i++) {
        let thisWidth = widthtop;
        //  console.log(i + "   " + i / 2);
        if (teamCount === 3 && i > 1 || teamCount === 5 && i > 2 || teamCount === 7 && i > 3) { thisWidth = widthBottom; }
        scorepage += `<div id="div${i}" draggable = "true" style="background-color: ${teamsList[i].color}; width:${thisWidth}; height:${height};float:left;">`;
        scorepage += `<div class="header" id="headerdiv${i}" style="background-color: ${teamsList[i].textColor};">`;
        scorepage += `<h1 class="headertext" id="headertext${i}" style="color:${teamsList[i].color}">${teamsList[i].teamName}</h1>`;
        scorepage += `</div>`;
        const s = teamsList[i].score; // Math.floor(Math.random() * (99 - 0 + 1)) + 0;
        scorepage += `<h1 class="scoretext" id=scoretext${i} style="color:${teamsList[i].textColor}">${s}</h1>`;
        scorepage += `</div>`;
    }

    /// temp
    // scorepage += `<input type="hidden" id="send-room" value="roomName" onClick="buildAndSendScore();" />`;
    /// 
    let existing = document.getElementById("screen-div");
    // console.log(scorepage);
    existing.innerHTML = scorepage;
    existing.style.display = `block`;

    if (includeListeners) {
        addListeners();
    }
}

function addListeners() {

    for (d = 0; d < 8; d++) {
        const div = document.getElementById(`div${d}`);
        if (!div) {
            break;
        }
        const scoretext = document.getElementById(`scoretext${d}`);

        div.addEventListener('dragend', (event) => {
            const sourceDiv = event.target;
            destination = document.elementFromPoint(event.pageX, event.pageY);
            // console.log(destination.id);
            if (destination && destination.id !== sourceDiv.id) {
                swapDivs(destination, sourceDiv)
            }
            buildSendScoreFromScreen();
        });

        div.addEventListener('touchend', (event) => {
            const sourceDiv = event.target;
            var touchLocation = event.changedTouches[0];
            var pageX = touchLocation.pageX;
            var pageY = touchLocation.pageY;
            destination = document.elementFromPoint(pageX, pageY);
            // console.log(destination.id);
            if (destination && destination.id !== sourceDiv.id) {
                swapDivs(destination, sourceDiv)
            }
            buildSendScoreFromScreen();
        });

        scoretext.addEventListener('click', (event) => {
            const thisDiv = event.target
            const { top, bottom } = getOffset(thisDiv);
            const middle = top + .5 * (bottom - top);
            let adder = 1;
            if (event.pageY > middle) {
                adder = -1;
            }
            let val = parseInt(thisDiv.innerHTML);
            val = val + adder;
            if (val < 0) {
                val = 0;
            }
            thisDiv.innerHTML = val;
            buildSendScoreFromScreen();
        });
    }/// end listener spin
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    const height = el.offsetHeight;
    const width = el.offsetWidth;
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        bottom: rect.top + window.scrollY + height,
        right: rect.left + window.screenX + width
    };
}

function swapDivs(destinationDiv, sourceDiv) {
    const dest = destinationDiv.id.slice(-1);
    const source = sourceDiv.id.slice(-1);
    const destScoreDiv = document.getElementById(`div${dest}`);
    const sourceScoreDiv = document.getElementById(`div${source}`);
    const destHeaderDiv = document.getElementById(`headerdiv${dest}`);
    const sourceHeaderDiv = document.getElementById(`headerdiv${source}`);
    const destHeaderText = document.getElementById(`headertext${dest}`);
    const sourceHeaderText = document.getElementById(`headertext${source}`);
    const destScoreText = document.getElementById(`scoretext${dest}`);
    const sourceScoreText = document.getElementById(`scoretext${source}`);

    const destScore = destScoreText.innerHTML;
    destScoreText.innerHTML = sourceScoreText.innerHTML;
    sourceScoreText.innerHTML = destScore;

    const destHeader = destHeaderText.innerHTML;
    destHeaderText.innerHTML = sourceHeaderText.innerHTML;
    sourceHeaderText.innerHTML = destHeader;

    let color = destScoreDiv.style.backgroundColor;
    destScoreDiv.style.backgroundColor = sourceScoreDiv.style.backgroundColor;
    sourceScoreDiv.style.backgroundColor = color;

    color = destHeaderDiv.style.backgroundColor;
    destHeaderDiv.style.backgroundColor = sourceHeaderDiv.style.backgroundColor;
    sourceHeaderDiv.style.backgroundColor = color;

    color = destScoreText.style.color;
    destScoreText.style.color = sourceScoreText.style.color;
    sourceScoreText.style.color = color;

    color = destHeaderText.style.color;
    destHeaderText.style.color = sourceHeaderText.style.color;
    sourceHeaderText.style.color = color;
}

function buildSendScoreFromScreen() {
    const scores = [];
    for (d = 0; d < 8; d++) {
        const div = document.getElementById(`div${d}`);
        if (!div) {
            break;
        }
        const teamName = document.getElementById(`headertext${d}`).innerHTML;
        const score = document.getElementById(`scoretext${d}`).innerHTML;
        const color = document.getElementById(`div${d}`).style.backgroundColor;
        const textColor = document.getElementById(`headerdiv${d}`).style.backgroundColor;
        if (teamName) {
            let theScore = {};
            theScore.teamName = teamName;
            theScore.score = score;
            theScore.color = color;
            theScore.textColor = textColor;
            scores.push(theScore);
        }
    }
    const roomName = document.getElementById(`room-name`).value;
    scoreChange(roomName, scores);
}