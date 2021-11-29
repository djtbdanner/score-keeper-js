let firstScreen = true;
function drawScreen(teamsList, includeListeners, roomName) {

    destroyById(`score-div`);
    setFontDefaultSizes(teamsList);
    let teamCount = teamsList.length;
    const menuHeight = getMenuHeightPercent();
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
    scorepage += `<div class="menuDiv" id="score-div"><img src="images/menu_icon.png" class="menuimg" alt="menu" onClick="buildMenu()">${roomName}</div>`;
    // const isDraggable = includeListeners;
    for (let i = 0; i < teamCount; i++) {
        let thisWidth = widthtop;
        if (teamCount === 3 && i > 1 || teamCount === 5 && i > 2 || teamCount === 7 && i > 3) { thisWidth = widthBottom; }
        scorepage += `<div id="div${i}" draggable = "${includeListeners}" style="background-color: ${teamsList[i].color}; width:${thisWidth}; height:${height};float:left;border-radius:4px">`;
        scorepage += `<div class="header" id="headerdiv${i}" style="background-color: ${teamsList[i].textColor};border-top-left-radius:4px;border-top-right-radius:4px;">`;
        scorepage += `<p class="headertext" id="headertext${i}" style="color:${teamsList[i].color}">${teamsList[i].teamName}</p>`;
        scorepage += `</div>`;
        const s = teamsList[i].score; // Math.floor(Math.random() * (99 - 0 + 1)) + 0;
        scorepage += `<p class="scoretext" id=scoretext${i} style="color:${teamsList[i].textColor}">${s}</p>`;
        scorepage += `</div>`;
    }
    createAndAppendDiv(scorepage, 'score-page-div', true);

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
    const isAnyOver9999 = teamsList.find((team) => { return parseInt(team.score, 10) > 9999; }) !== undefined;

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
    }
    if (isAnyOver9999) {
        root.style.setProperty(`--default-font-size-landscape`, `28vh`);
        root.style.setProperty(`--default-font-size-portrait`, `10vh`);
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
        if (isAnyOver9999) {
            root.style.setProperty(`--default-font-size-landscape`, `18vh`);
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
        if (isAnyOver9999) {
            root.style.setProperty(`--default-font-size-portrait`, `8vh`);
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
        if (isAnyOver9999) {
            root.style.setProperty(`--default-font-size-landscape`, `16vh`);
            root.style.setProperty(`--default-font-size-portrait`, `4vh`);
        }
    }
}

function getMenuHeightPercent() {
    try {
        const td = `<div class="menuDiv" id="xxx">x</div>`;
        createAndAppendDiv(html, 'default', false);
        elementHeight = getComputedStyle(document.getElementById(`xxx`)).height;
        elementHeight = elementHeight.slice(0, -2);
        var totalHeight = screen.height;
        let roughPer = Math.round(parseFloat(elementHeight) / parseFloat(totalHeight) * 100);
        destroyById(`xxx`);
        return roughPer;
    } catch (e) {
        console.log(`Failed to determine menu height in % ${e}`);
        return 4;
    }
}

let touchx;
let touchy;
let eventx;
let eventy;
function addListeners() {

    for (d = 0; d < 8; d++) {
        const div = document.getElementById(`div${d}`);
        if (!div) {
            break;
        }

        const scoretxt = document.getElementById(`scoretext${d}`);
        div.addEventListener('dragstart', (event) => {
            dragStartProcessor(event);
        });

        div.addEventListener('dragend', (event) => {
            dragEndProcessor(event);
        });
        scoretxt.addEventListener('dragstart', (event) => {
            dragStartProcessor(event);
        });

        scoretxt.addEventListener('dragend', (event) => {
            dragEndProcessor(event);
        });

        div.addEventListener('touchstart', (event) => {
            var touchLocation = event.changedTouches[0];
            touchx = touchLocation.pageX;
            touchy = touchLocation.pageY;
        });

        div.addEventListener('touchend', (event) => {
            const sourceDiv = event.target;
            if (!isDivOrScore(sourceDiv)) {
                return;
            }

            let touchLocation = event.changedTouches[0];
            let pageX = touchLocation.pageX;
            let pageY = touchLocation.pageY;
            let destination = document.elementFromPoint(pageX, pageY);
            if (!isDivOrScore(destination)) {
                return;
            }
            let destinationDivNum = getIdSuffix(destination);
            let sourceDivNum = getIdSuffix(sourceDiv);
            let screenChange = false;
            if (destinationDivNum !== sourceDivNum) {
                swapDivs(destination, sourceDiv);
                screenChange = true;
            } else {
                if (Math.abs(parseInt(touchy, 10) - parseInt(pageY, 10)) > 40) {
                    let adder = 1;
                    if (touchy < pageY) {
                        adder = -1;
                    }
                    const thisIndex = destination.id.slice(-1);
                    addItToScoreTxt(sourceDivNum, adder);
                    screenChange = true;
                }

            }
            if (screenChange) {
                buildSendScoreFromScreen();
            }
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
            const thisIndex = getIdSuffix(thisDiv);
            addItToScoreTxt(thisIndex, adder);
            buildSendScoreFromScreen();
        });
    }/// end listener spin
}

function dragStartProcessor(event) {
    let { yLoc, xLoc } = getXy(event);
    eventx = xLoc;
    eventy= yLoc
    // console.log(`drag start y- ${eventy} x-${eventx}`)
    console.log(eventy + ":y-start " + eventx + ":x-start ");
}

function dragEndProcessor(event) {
    const sourceDiv = event.target;
    if (!isDivOrScore(sourceDiv)) {
        return;
    }
    let { yLoc, xLoc } = getXy(event);
    // console.log(yLoc + ":y-end " + xLoc + ":x-end ");
    let destination = document.elementFromPoint(xLoc, yLoc);
    if (!isDivOrScore(destination)) {
        return;
    }
    let destinationDivNum = getIdSuffix(destination);
    let sourceDivNum = getIdSuffix(sourceDiv);

    let screenChange = false;
    // console.log(yLoc + ":y-end " + xLoc + ":x-end " + eventy + ":y-start " + eventx + "x-start");
    if (destinationDivNum !== sourceDivNum) {
        // console.log(`swap divs`);
        swapDivs(destination, sourceDiv);
        screenChange = true;
    } else {
        // console.log(`Move ${eventy} ${yLoc} ${destination.id} `);
        if (Math.abs(parseInt(eventy, 10) - parseInt(yLoc, 10)) > 30) {
            let adder = 1;
            if (parseInt(eventy, 10) < parseInt(yLoc, 10)) {
                adder = -1;
            }
            addItToScoreTxt(sourceDivNum, adder);
            screenChange = true;
        }
    }
    if (screenChange) {
        buildSendScoreFromScreen();
    }
    eventx = undefined;
    eventy = undefined;
}


function getXy(event) {
    let xLoc = event.pageX;
    let yLoc = event.pageY;
    // console.log(yLoc + ":y-end " + xLoc + ":x-end ");
    let userAgent = navigator.userAgent;
    // console.log(event);
    if (userAgent) {
        // I understand this is a bug in firefox
        if (userAgent.includes("Firefox") && userAgent.includes("Windows")) {
            xLoc = event.screenX;
            yLoc = event.screenY;
        }
    }
    return { yLoc, xLoc };
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

function getIdSuffix(elem) {
    if (!elem) {
        return 0;
    }
    if (!elem.id) {
        return 0;
    }
    let s = elem.id.slice(-1);
    if (isNaN(s)) {
        return 0;
    }
    return parseInt(s, 10);
}

function isDivOrScore(elem) {
    if (!elem) {
        return false;
    }
    if (!elem.id) {
        return false;
    }
    let id = elem.id;
    id = id.slice(0, -1);
    if (!(id === 'div' || id === `scoretext`)) {
        return false;
    }
    return true;
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
