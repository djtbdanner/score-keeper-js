let firstScreen = true;
function drawScreen(teamsList, includeListeners, roomName) {

    let existing = document.getElementById("screen-div");
    setFontDefaultSizes(teamsList);
    existing.style.width = `100%`;
    existing.style.height = `100%`;

    let teamCount = teamsList.length;
    const menuHeight = getMenuHeightPercent(existing);
    let widthtop = `50%`;
    let widthBottom = `100%`;
    let displayHeight = 100 - menuHeight;
    let height = `${displayHeight}%`;// total - menu

    if (teamCount > 2) {
        displayHeight = displayHeight / 2;
        height = `${displayHeight}%`; // (total - menu) / 2
    }

    if (teamCount === 1) {
        widthtop = `100%`;
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


    let scorepage = ``;
    scorepage += `<div class="menuDiv"><img src="images/menu_icon.png" class="menuimg" alt="menu" onClick="buildMenu()">${roomName}</div>`;
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

    if (firstScreen) {
        openFullScreen();
        firstScreen = false;
    }
}

function setFontDefaultSizes(teamsList) {
    let root = document.documentElement;
    const isAnyOver99 = teamsList.find((team) => { return parseInt(team.score, 10) > 99; }) !== undefined;
    const isAnyOver999 = teamsList.find((team) => { return parseInt(team.score, 10) > 999; }) !== undefined;

    let teamCount = teamsList.length;
    root.style.setProperty(`--default-font-size-landscape`, `64vh`);
    root.style.setProperty(`--default-font-size-portrait`, `20vh`);
    root.style.setProperty(`--default-font-size-portrait-header`, `10vh`);
    root.style.setProperty(`--default-font-size-landscape-header`, `12vh`);
    if (isAnyOver99) {
        root.style.setProperty(`--default-font-size-landscape`, `48vh`);
        root.style.setProperty(`--default-font-size-portrait`, `16vh`);
    }
    if (isAnyOver999) {
        root.style.setProperty(`--default-font-size-landscape`, `38vh`);
        root.style.setProperty(`--default-font-size-portrait`, `12vh`);
        alert()
    }

    if (teamCount > 2) {
        root.style.setProperty(`--default-font-size-portrait-header`, `5vh`);
        root.style.setProperty(`--default-font-size-landscape-header`, `6vh`);
        root.style.setProperty(`--default-font-size-landscape`, `30vh`);
        if (isAnyOver99) {
            root.style.setProperty(`--default-font-size-landscape`, `24vh`);
        }
        if (isAnyOver999) {
            root.style.setProperty(`--default-font-size-landscape`, `20vh`);
        }
    }
    if (teamCount > 4) {
        root.style.setProperty(`--default-font-size-portrait`, `14vh`);
        if (isAnyOver99) {
            root.style.setProperty(`--default-font-size-portrait`, `12vh`);
        }
        if (isAnyOver999) {
            root.style.setProperty(`--default-font-size-portrait`, `10vh`);
        }
    }
    if (teamCount >= 7) {
        root.style.setProperty(`--default-font-size-landscape`, `26vh`);
        root.style.setProperty(`--default-font-size-portrait`, `9vh`);
        if (isAnyOver99) {
            root.style.setProperty(`--default-font-size-landscape`, `24vh`);
            root.style.setProperty(`--default-font-size-portrait`, `8vh`);
        }
        if (isAnyOver999) {
            root.style.setProperty(`--default-font-size-landscape`, `20vh`);
            root.style.setProperty(`--default-font-size-portrait`, `6vh`);
        }
    }
    // if (isAnyOver99) {
    //     root.style.setProperty(`--default-font-size-landscape`, `22vh`);
    //     root.style.setProperty(`--default-font-size-portrait`, `9vh`);
    //     if (teamCount > 4) {
    //         root.style.setProperty(`--default-font-size-landscape`, `20vh`);            
    //         root.style.setProperty(`--default-font-size-portrait`, `7.5vh`);
    //     }
    // }

}

function getMenuHeightPercent(existing) {
    try {
        const td = `<div class="menuDiv" id="xxx">x</div>`;
        existing.innerHTML = td;
        elementHeight = getComputedStyle(document.getElementById(`xxx`)).height;
        elementHeight = elementHeight.slice(0, -2);
        var totalHeight = screen.height;
        let roughPer = Math.round(parseFloat(elementHeight) / parseFloat(totalHeight) * 100);
        destroyElementNamed('xxx');
        return roughPer;
    } catch (e) {
        console.log(`Failed to determine menu height in % {e}`);
        return 4;
    }
}

let touchx;
let touchy;
let eventx;
let eventy;
function addListeners() {
    // window.addEventListener('mouseup', e => {
    //     x = e.offsetX;
    //     y = e.offsetY;
    //     alert(x)
    // });
    for (d = 0; d < 8; d++) {
        const div = document.getElementById(`div${d}`);
        if (!div) {
            break;
        }

        div.addEventListener('dragstart', (event) => {
            // event.dataTransfer.setData("origScreenX", event.screenX);
            // event.dataTransfer.setData("origScreenY", event.screenY);
            eventx = event.screenX;
            eventy = event.screenY;
        });

        div.addEventListener('dragend', (event) => {
            const sourceDiv = event.target;
            let xLoc = event.pageX;
            let yLoc = event.pageY;
            let userAgent = navigator.userAgent;
            if (userAgent) {
                // I understand this is a bug in firefox
                if (userAgent.includes("Firefox") && userAgent.includes("Windows")) {
                    xLoc = event.screenX;
                    yLoc = event.screenY;
                }
            }
            destination = document.elementFromPoint(xLoc, yLoc);
            if (destination && destination.id && sourceDiv && sourceDiv.id && (destination.id.slice(-1) !== sourceDiv.id.slice(-1))) {
                swapDivs(destination, sourceDiv);
            } else {
                // console.log(destination)
                if (destination && destination.id && !isNaN(destination.id.slice(-1))) {
                    if (Math.abs(parseInt(eventy, 10) - parseInt(yLoc, 10)) > 200) {
                        let adder = 1;
                        if (parseInt(eventy, 10) > parseInt(yLoc, 10)) {
                            adder = -1;
                        }
                        // console.log(adder);
                        const thisIndex = destination.id.slice(-1);
                        addItToScoreTxt(thisIndex, adder);
                    }
                }
            }
            buildSendScoreFromScreen();
        });

        div.addEventListener('touchstart', (event) => {
            var touchLocation = event.changedTouches[0];
            touchx = touchLocation.pageX;
            touchy = touchLocation.pageY;
        });

        div.addEventListener('touchend', (event) => {
            const sourceDiv = event.target;
            let id = sourceDiv.id;
            if (!id) {
                return;
            }
            id = id.slice(0, -1);
            if (!(id === 'div' || id === `scoretext`)) {
                return;
            }
            // console.log(event.changedTouches);
            var touchLocation = event.changedTouches[0];
            var pageX = touchLocation.pageX;
            var pageY = touchLocation.pageY;
            destination = document.elementFromPoint(pageX, pageY);
            if (destination && destination.id !== sourceDiv.id) {
                swapDivs(destination, sourceDiv)
            } else {
                if (destination && destination.id && !isNaN(destination.id.slice(-1))) {
                    if (Math.abs(parseInt(touchy, 10) - parseInt(pageY, 10)) > 40) {
                        let adder = 1;
                        if (touchy > pageY) {
                            adder = -1;
                        }
                        const thisIndex = destination.id.slice(-1);
                        addItToScoreTxt(thisIndex, adder);
                    }
                }
            }
            buildSendScoreFromScreen();
            touchx = undefined;
            touchy = undefined;
        });

        div.addEventListener('click', (event) => {
            const thisDiv = event.target
            const { top, bottom } = getOffset(thisDiv);
            const middle = top + .80 * (bottom - top);
            let adder = 1;
            const alt = document.getElementById(`points-per-tap`).value;
            if (!isNaN(alt)) {
                adder = parseInt(alt, 10);
            }
            if (event.pageY > middle) {
                adder = adder * -1;
            }
            const thisIndex = thisDiv.id.slice(-1);
            addItToScoreTxt(thisIndex, adder);
            buildSendScoreFromScreen();
        });
    }/// end listener spin
}

function addItToScoreTxt(thisIndex, adder) {
    const scoretext = document.getElementById(`scoretext${thisIndex}`);
    let val = parseInt(scoretext.innerHTML);
    val = val + adder;
    if (val < 0) {
        val = 0;
    }
    scoretext.innerHTML = val;
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
    const isOwner = document.getElementById(`room-owner`).value.toLowerCase() === `true`;
    const pointsPerTap = document.getElementById(`points-per-tap`).value;

    // save scores locally so browser can be closed and opened on the scores
    if (isOwner) {
        localStorage.setItem('scores', JSON.stringify(scores));
        localStorage.setItem('scores-date', new Date());
        localStorage.setItem('room-name', roomName);
        localStorage.setItem('is-owner', isOwner);
        localStorage.setItem('points-per-tap', pointsPerTap);
    }
    scoreChange(roomName, scores, isOwner);
    setFontDefaultSizes(scores);
}
