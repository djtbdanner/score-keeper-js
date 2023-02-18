let firstScreen = true;
function drawScreen(teamsList, includeListeners, roomName, hasTimer) {
    clearHtmlBody();
    setFontDefaultSizes(teamsList);
    let teamCount = teamsList.length;
    const menuHeight = getMenuHeightPercent(hasTimer);//--todo--fortimer
    let widthtop = `50%`;
    let widthBottom = `100%`;
    let displayHeight = 100 - menuHeight;
    // let height = `${displayHeight}%`;// total - menu

    let root = document.documentElement;

    root.style.setProperty(`--default-width-landscape`, `100%`);
    root.style.setProperty(`--default-height-landscape`, `${displayHeight}%`);
    root.style.setProperty(`--default-width-portriat`, `100%`);
    root.style.setProperty(`--default-height-portriat`, `${displayHeight}%`);

    if (teamCount === 2) {
        root.style.setProperty(`--default-width-landscape`, `50%`);
        root.style.setProperty(`--default-height-landscape`, `${displayHeight}%`);
        root.style.setProperty(`--default-width-portrait`, `100%`);
        //root.style.setProperty(`--default-height-portriat`, `${displayHeight/2}%`);
        root.style.setProperty(`--default-height-portrait`, `${displayHeight / 2}%`);
    }

    if (teamCount === 3) {
        root.style.setProperty(`--default-width-landscape`, `33.33%`);
        root.style.setProperty(`--default-height-landscape`, `${displayHeight}%`);
        root.style.setProperty(`--default-width-portrait`, `100%`);
        root.style.setProperty(`--default-height-portrait`, `${displayHeight / 3}%`);
    }
    if (teamCount === 4) {
        root.style.setProperty(`--default-width-landscape`, `50%`);
        root.style.setProperty(`--default-height-landscape`, `${displayHeight / 2}%`);
        root.style.setProperty(`--default-width-portrait`, `100%`);
        root.style.setProperty(`--default-height-portrait`, `${displayHeight / 4}%`);
    }

    if (teamCount === 6 || teamCount === 5) {
        root.style.setProperty(`--default-width-landscape`, `33.33%`);
        root.style.setProperty(`--default-height-landscape`, `${displayHeight / 2}%`);
        root.style.setProperty(`--default-width-portrait`, `50%`);
        root.style.setProperty(`--default-height-portrait`, `${displayHeight / 3}%`);
    }
    if (teamCount === 8 || teamCount === 7) {
        root.style.setProperty(`--default-width-landscape`, `25%`);
        root.style.setProperty(`--default-height-landscape`, `${displayHeight / 2}%`);
        root.style.setProperty(`--default-width-portrait`, `50%`);
        root.style.setProperty(`--default-height-portrait`, `${displayHeight / 4}%`);
    }

    let scorepage = ``;
    scorepage += `<div class="menuDiv" id="score-div"><img src="images/menu_icon.png" class="menuimg" alt="menu" onClick="buildMenu()">${roomName}</div>`;
    if (hasTimer) {
        let seconds = secondsToDisplay(TOTAL_SECONDS);
        if (ROOM_OWNER){
            seconds += `\u25BA`;
        }
        scorepage += `<div class="timerDiv" id="timer-disp-div">${seconds}</div>
                  <div class="progressDiv" id="timer-progress-div">
                    <div class="timerPercentDiv" id="timer-percent"></div>
                  </div>`;
    }
    for (let i = 0; i < teamsList.length; i++) {
        let theClass = `scoreDiv`;
        scorepage += `<div id="div${i}" class="${theClass}" draggable = "${includeListeners}" style="background-color: ${teamsList[i].color}">`;
        scorepage += `<div class="header" id="headerdiv${i}" style="background-color: ${teamsList[i].textColor};border-top-left-radius:4px;border-top-right-radius:4px;">`;
        scorepage += `<p class="headertext" id="headertext${i}" style="color:${teamsList[i].color}">${teamsList[i].teamName}</p>`;
        scorepage += `</div>`;
        const s = teamsList[i].score; // Math.floor(Math.random() * (99 - 0 + 1)) + 0;
        scorepage += `<p class="scoretext" id=scoretext${i} style="color:${teamsList[i].textColor}">${s}</p>`;
        scorepage += `</div>`;
    }
    createAndAppendDiv(scorepage, 'score-page-div', true);

    if (includeListeners) {
        addListeners(hasTimer);
    }

        // --TODO -- auto fullscreen back
    // if (firstScreen) {
    //     openFullScreen();
    //     firstScreen = false;
    // }
}

function setFontDefaultSizes(teamsList) {
    let root = document.documentElement;
    const isAnyOver99 = teamsList.find((team) => { return parseInt(team.score, 10) > 99; }) !== undefined;
    const isAnyOver999 = teamsList.find((team) => { return parseInt(team.score, 10) > 999; }) !== undefined;
    const isAnyOver9999 = teamsList.find((team) => { return parseInt(team.score, 10) > 9999; }) !== undefined;

    let teamCount = teamsList.length;
    root.style.setProperty(`--default-font-size-landscape`, `64vh`);
    root.style.setProperty(`--default-font-size-portrait`, `32vh`);
    root.style.setProperty(`--default-font-size-portrait-header`, `6vh`);
    root.style.setProperty(`--default-font-size-landscape-header`, `10vh`);
    if (isAnyOver99) {
        root.style.setProperty(`--default-font-size-landscape`, `48vh`);
        root.style.setProperty(`--default-font-size-portrait`, `24vh`);
    }
    if (isAnyOver999) {
        root.style.setProperty(`--default-font-size-landscape`, `38vh`);
        root.style.setProperty(`--default-font-size-portrait`, `19vh`);
    }
    if (isAnyOver9999) {
        root.style.setProperty(`--default-font-size-landscape`, `28vh`);
        root.style.setProperty(`--default-font-size-portrait`, `14vh`);
    }

    if (teamCount > 2) {
        root.style.setProperty(`--default-font-size-portrait-header`, `4vh`);
        root.style.setProperty(`--default-font-size-landscape-header`, `8vh`);
        root.style.setProperty(`--default-font-size-landscape`, `32vh`);
        root.style.setProperty(`--default-font-size-portrait`, `17vh`);

        if (isAnyOver99) {
            root.style.setProperty(`--default-font-size-landscape`, `28vh`);
            root.style.setProperty(`--default-font-size-portrait`, `16vh`);

        }
        if (isAnyOver999) {
            root.style.setProperty(`--default-font-size-landscape`, `26vh`);
            root.style.setProperty(`--default-font-size-portrait`, `14vh`);

        }
        if (isAnyOver9999) {
            root.style.setProperty(`--default-font-size-landscape`, `26vh`);
            root.style.setProperty(`--default-font-size-portrait`, `14vh`);
        }
    }

    if (teamCount > 4) {
        root.style.setProperty(`--default-font-size-landscape-header`, `6vh`);
        if (isAnyOver999) {
            root.style.setProperty(`--default-font-size-portrait`, `12vh`);
        }
        if (isAnyOver9999) {
            root.style.setProperty(`--default-font-size-landscape`, `21vh`);
            root.style.setProperty(`--default-font-size-portrait`, `10vh`);
        }
    }

    if (teamCount > 6) {
        root.style.setProperty(`--default-font-size-portrait-header`, `3vh`);
        root.style.setProperty(`--default-font-size-landscape`, `35vh`);
        root.style.setProperty(`--default-font-size-portrait`, `17vh`);
        if (isAnyOver99) {
            root.style.setProperty(`--default-font-size-landscape`, `26vh`);
            root.style.setProperty(`--default-font-size-portrait`, `15vh`);
        }
        if (isAnyOver999) {
            root.style.setProperty(`--default-font-size-landscape`, `20vh`);
            root.style.setProperty(`--default-font-size-portrait`, `12vh`);
        }
        if (isAnyOver9999) {
            root.style.setProperty(`--default-font-size-landscape`, `16vh`);
            root.style.setProperty(`--default-font-size-portrait`, `10vh`);
        }
    }
}

function getMenuHeightPercent(hasTimer) {
    try {
        const td = `<div class="menuDiv" id="xxx">x</div>`;
        createAndAppendDiv(td, 'default', false);
        elementHeight = getComputedStyle(document.getElementById(`xxx`)).height;
        elementHeight = elementHeight.slice(0, -2);
        var totalHeight = screen.height;
        let roughPer = Math.round(parseFloat(elementHeight) / parseFloat(totalHeight) * 100);
        destroyById(`xxx`);
        if (hasTimer) {
            roughPer = roughPer * 2 + 2;// timer same as menu with another 2% for the border top/bottom
        }
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
function addListeners(hasTimer) {

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
            const alt = POINTS_PER_TAP;
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

    if (hasTimer) {
        const timerDisplayDiv = document.getElementById(`timer-disp-div`);
        // const timerProgressDiv = document.getElementById(`timer-progress-div`);
        const timerPercentDiv = document.getElementById(`timer-percent`);

        timerDisplayDiv.addEventListener('click', (event) => {
            clickedTimer(event);
        });
        timerPercentDiv.addEventListener('click', (event) => {
            clickedTimer(event);
        });

    }
}

function clickedTimer(event) {
    startTimer(ROOM_NAME);
}

function dragStartProcessor(event) {
    let { yLoc, xLoc } = getXy(event);
    eventx = xLoc;
    eventy = yLoc;
}

function dragEndProcessor(event) {
    const sourceDiv = event.target;
    if (!isDivOrScore(sourceDiv)) {
        return;
    }
    let { yLoc, xLoc } = getXy(event);
    let destination = document.elementFromPoint(xLoc, yLoc);
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
    let userAgent = navigator.userAgent;
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
    // save scores locally so browser can be closed and opened on the scores
    if (ROOM_OWNER) {
        localStorage.setItem('scores', JSON.stringify(scores));
        localStorage.setItem('scores-date', new Date());
        localStorage.setItem('room-name', ROOM_NAME);
        localStorage.setItem('is-owner', ROOM_OWNER);
        localStorage.setItem('points-per-tap', POINTS_PER_TAP);

        localStorage.setItem('use-timer', USE_TIMER);
        localStorage.setItem('total-seconds', TOTAL_SECONDS);
    }
    scoreChange(ROOM_NAME, scores, ROOM_OWNER);
    setFontDefaultSizes(scores);
}

function processTimer(display, percentComplete) {
    let x = document.getElementById(`timer-percent`);
    if (percentComplete > 95) {
        x.style.backgroundColor = `red`;
    } else if (percentComplete > 75) {
        x.style.backgroundColor = `yellow`;
    } else {
        x.style.backgroundColor = `green`;
    }
    x.style.width = `${percentComplete}%`;
    x.style.height = `100%`;
    document.getElementById(`timer-disp-div`).innerHTML = `${display}`;
}