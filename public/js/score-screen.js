function drawScreen(teamsList, includeListeners, roomName) {

    let existing = document.getElementById("screen-div");
    existing.style.width = `100%`;
    existing.style.height = `100%`;/// sans menu

    const isAnyOver99 = teamsList.find((team) => {return parseInt(team.score, 10)>99;}) !== undefined;

    let scorepage = ``;
    let teamCount = teamsList.length;

    let root = document.documentElement;
    root.style.setProperty(`--default-font-size-landscape`, `68vh`);
    root.style.setProperty(`--default-font-size-portrait`, `21vh`);
    root.style.setProperty(`--default-font-size-portrait-header`, `10vh`);
    root.style.setProperty(`--default-font-size-landscape-header`, `12vh`);

    let widthtop = `50%`;
    let widthBottom = `100%`;
    let height = `96%`;

    if (teamCount > 2) {
        height = `48%`;
        root.style.setProperty(`--default-font-size-portrait-header`, `5vh`);
        root.style.setProperty(`--default-font-size-landscape-header`, `6vh`);
        root.style.setProperty(`--default-font-size-landscape`, `35vh`);
    }
    if (teamCount === 1) {
        widthtop = `100%`;
    }

    if (teamCount > 4) {
        root.style.setProperty(`--default-font-size-portrait`, `14vh`);
    }
    if (teamCount >= 7) {
        root.style.setProperty(`--default-font-size-landscape`, `30vh`);
        root.style.setProperty(`--default-font-size-portrait`, `12vh`);
    }
    if (isAnyOver99) {
        root.style.setProperty(`--default-font-size-portrait`, `11vh`);
        if (teamCount > 4){
            root.style.setProperty(`--default-font-size-portrait`, `7.5vh`);
        }
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

    scorepage += `<div class="menuDiv" style="height:4%;float:left;"><img src="images/menu_icon.png" class="menuimg" alt="menu" onClick="buildMenu()">${roomName}</div>`;
    // scorepage += `<div style="height:4%"><img src="images/menu_icon.png" class="menuimg" alt="menu">GAME NAME</div>`
    for (let i = 0; i < teamCount; i++) {
        let thisWidth = widthtop;
        if (teamCount === 3 && i > 1 || teamCount === 5 && i > 2 || teamCount === 7 && i > 3) { thisWidth = widthBottom; }
        scorepage += `<div id="div${i}" draggable = "true" style="background-color: ${teamsList[i].color}; width:${thisWidth}; height:${height};float:left;">`;
        scorepage += `<div class="header" id="headerdiv${i}" style="background-color: ${teamsList[i].textColor};">`;
        scorepage += `<p class="headertext" id="headertext${i}" style="color:${teamsList[i].color}">${teamsList[i].teamName}</p>`;
        scorepage += `</div>`;
        const s = teamsList[i].score; // Math.floor(Math.random() * (99 - 0 + 1)) + 0;
        scorepage += `<p class="scoretext" id=scoretext${i} style="color:${teamsList[i].textColor}">${s}</p>`;
        scorepage += `</div>`;
    }
    existing.innerHTML = scorepage;
    existing.style.display = `block`;

    if (includeListeners) {
        addListeners();
    }

    // if (root.requestFullscreen) {
    //     root.requestFullscreen();
    // } else if (elem.webkitRequestFullscreen) {
    //     root.webkitRequestFullscreen();
    // } else if (elem.msRequestFullscreen) {
    //     root.msRequestFullscreen();
    // }
}

function addListeners() {

    for (d = 0; d < 8; d++) {
        const div = document.getElementById(`div${d}`);
        if (!div) {
            break;
        }


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
            let id = sourceDiv.id;
            if (!id){
                return;
            }
            id = id.slice(0,-1);
            if (!(id === 'div' || id === `scoretext`)) {
                return;
            }
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

        div.addEventListener('click', (event) => {
            const thisDiv = event.target
            const { top, bottom } = getOffset(thisDiv);
            // console.log(getOffset(thisDiv));
            // console.log(event.pageY + ' ' + event.pageX);
            const middle = top + .75 * (bottom - top);
            let adder = 1;
            if (event.pageY > middle) {
                adder = -1;
            }
            const thisIndex = thisDiv.id.slice(-1);
            const scoretext = document.getElementById(`scoretext${thisIndex}`);
            let val = parseInt(scoretext.innerHTML);
            val = val + adder;
            if (val < 0) {
                val = 0;
            }
            scoretext.innerHTML = val;
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
    const isOwner = document.getElementById(`room-owner`).value.toLowerCase()===`true`;

    // save scores locally so browser can be closed and opened on the scores
    if (isOwner){
        localStorage.setItem('scores', JSON.stringify(scores));
        localStorage.setItem('scores-date', new Date());
        localStorage.setItem('room-name', roomName);
        localStorage.setItem('is-owner', isOwner);
    }
    scoreChange(roomName, scores, isOwner);
}
