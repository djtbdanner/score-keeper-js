async function buildEntryScreens() {

    const storedScores = localStorage.getItem('scores');
    const date = localStorage.getItem('scores-date');
    ROOM_NAME = localStorage.getItem('room-name');
    ROOM_OWNER = localStorage.getItem(`is-owner`);
    if (storedScores && date && ROOM_NAME) {
        const dateToCompare = new Date(date);
        if (isToday(dateToCompare)) {
            const msg = `You were keeping score for <i><b>${ROOM_NAME}</b></i> earlier today</br> Would you like to continue with that game?`;
            modalConfirm(msg, `rebuildGameFromLocalStorage()`, `buildInitialScreen()`, `Continue ${ROOM_NAME}`, `New Game`);
            return;
        }
    }
    await buildInitialScreen();
}

async function processRoomAdded() {
    if (document.getElementById(`initial-screen`)) {
        await buildInitialScreen();
    } else {
        console.log('someone added another game');
    }
}

async function buildInitialScreen() {
    const rooms = await getAvailableRooms();
    let roomsList = ``;
    if (rooms) {
        roomsList = buildRoomList(rooms);
    }
    destroyById(`initial-screen`);
    let html = ``;
    html += `<form id ="initial-screen">`;
    html += `<h2>Score Keeper</h2>`;
    html += `<table cellpadding="0" cellspacing="0" width="100%" border="0">`;

    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<p>Choose a name for the game, number of points per score (e.g. basketball would be 2) and, optionally, create a timer.</p>`;
    html += `</td></tr>`;

    html += `<tr><td style="text-align:right;width:30%;">`;
    html += `Name of the game: `;
    html += `</td><td>`;
    html += `<input type="text" maxlength="20" id="game-name" placeholder="GameName" onKeyUp="shouldShowSubmitButton()" autofocus />`;
    html += `</td></tr>`;

    html += `<tr><td style="text-align:right;">`;
    html += `Points per goal or score: `;
    html += `</td><td>`;
    html += `<input type="number" maxlength="3" id="goal-points" value = "1" min="1" max="100" />`;
    html += `</td></tr>`;

    html += `<tr><td style="text-align:right;">`;
    html += `Set a game timer?: `;
    html += `</td><td>`;
    html += `<input type="checkbox" id="timer-checkbox" onclick="showTimerSpan()"/>`;
    html += `</td></tr>`; 

    html += `<tr><td style="text-align:right;width:30%;">`;
    html += `<span style="visibility:hidden" id= "time-label">Timer (minutes:seconds):</span>`;
    html += `</td><td>`;
    html += `<span style="visibility:hidden" id= "time-fields"><input type="number" maxlength="3" disabled id="timer-minutes" value = "0" min="0" max="999" onChange="shouldShowSubmitButton()" />:<input type="number" disabled maxlength="2" id="timer-seconds" value = "0" min="0" max="60" onChange="shouldShowSubmitButton()" /></span>`;
    html += `</td></tr>`;

    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<span id = "game-msg-span">&nbsp</span>`;
    html += `</td></tr>`;

    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<br><input type="submit" id="add-player-button" disabled="true" value="Add Team or Player" formaction="javascript:setRoomAddPlayer();" />`;
    html += `</td></tr>`;

    html += roomsList;

    html += `</table>`;
    html+=`</form>`;
    createAndAppendDiv(html, 'default', false);
}

function showTimerSpan(){
    const check = document.getElementById(`timer-checkbox`);
    const minutesBox = document.getElementById(`timer-minutes`);
    const secondsBox = document.getElementById(`timer-seconds`);
    const theSpan = document.getElementById(`time-label`)
    const theSpanFields = document.getElementById(`time-fields`)
    if (check.checked){
        minutesBox.disabled = false;
        secondsBox.disabled = false;
        theSpan.style.visibility=`visible`;
        theSpanFields.style.visibility=`visible`
    } else {
        minutesBox.value = 0;
        secondsBox.value = 0;
        minutesBox.disabled = true;
        secondsBox.disabled = true;
        theSpan.style.visibility=`hidden`;
        theSpanFields.style.visibility=`hidden`
    }
    shouldShowSubmitButton();
}

// check some time is set if timer is selected
function isTimerSetOrNotChosen(){
    const check = document.getElementById(`timer-checkbox`);
    const minutesBox = document.getElementById(`timer-minutes`);
    const secondsBox = document.getElementById(`timer-seconds`);
    if (check.checked){
        if (parseInt(minutesBox.value, 10) + parseInt(secondsBox.value, 10) === 0){
            return false;
        }
    }
    return true;
}

function rebuildGameFromLocalStorage() {

    const storedScores = localStorage.getItem('scores');
    const date = localStorage.getItem('scores-date');
    ROOM_NAME = localStorage.getItem('room-name');
    ROOM_OWNER = true;
    POINTS_PER_TAP = localStorage.getItem(`points-per-tap`) || 1;

    USE_TIMER = localStorage.getItem('use-timer')===`true`;
    TOTAL_SECONDS = localStorage.getItem('total-seconds');
    const scores = JSON.parse(storedScores);
    sendRoomMessage(ROOM_NAME, `Score keeper reconnected to ${ROOM_NAME}.`);

    let hasTimer = false;
    if (USE_TIMER){
        hasTimer = true;
    }

    scoreChange(ROOM_NAME, scores, true, TOTAL_SECONDS);
    drawScreen(scores, true, ROOM_NAME, hasTimer);
}

function setRoomAddPlayer() {
    // set the global html values (user options)
    ROOM_NAME = document.getElementById(`game-name`).value;
    POINTS_PER_TAP = document.getElementById(`goal-points`).value;
    ROOM_OWNER = true;
    USE_TIMER = document.getElementById(`timer-checkbox`).checked;
    const minutes = document.getElementById(`timer-minutes`).value;
    const seconds = document.getElementById(`timer-seconds`).value
    TOTAL_SECONDS= parseInt(minutes, 10) * 60 + parseInt(seconds, 10);

    destroyById('initial-screen');
    addPlayerOrTeam(0);
}

function buildRoomList(availableRooms) {

    if (availableRooms && availableRooms.length > 0) {
        let html = ``;
        html += `<tr><td colspan="2" style = "text-align:center;">`;
        html += `<p>Or, select a game below to view the scores.</p>`;
        html += `</td></tr>`;
        html += `<tr><td colspan="2" style = "text-align:center;">`;
        html += `<select onChange="setRoomAddJoin(this.value)">`;
        html += `<option>-select game-</option>`;
        availableRooms.forEach(roomName => {
            html += `<option><value = "${roomName}">${roomName}</option>`;
        });
        html += `</select>`;
        html += `</td></tr>`;
        return html;
    }
    return ``;
}

function setRoomAddJoin(roomName) {
    destroyById('initial-screen');
    ROOM_NAME = roomName;
    ROOM_OWNER = false;
    localStorage.clear();
    const storedRoomName = localStorage.getItem('room-name');
    const storedScores = localStorage.getItem('scores');
    if (roomName === storedRoomName && storedScores) {
        rebuildGameFromLocalStorage();
        return;
    } else {
        joinRoom(roomName);
    }
}

function addPlayerOrTeam(index) {
    const html = buildAddTeamForm(index);
    createAndAppendDiv(html, 'default', false);
    document.getElementById(`in-teamName${index}`).focus();
    // two teams, enable done
    const enableDone = document.getElementById(`teamName${1}`) === null;
    const doneButton = document.getElementById(`done-team-button${index}`);
    doneButton.disabled = enableDone;
}

usedColors = [];
function buildAddTeamForm(index) {
    const gameName = ROOM_NAME;
    let html = ``;
    // html += `<div id="addDiv${index}" class = "modal"><form>`;
    html += `<form id="addDiv${index}"> `;
    html += `<table style = "position:absolute;left:0;top:;" cellpadding="5" cellspacing="0" width="100%" border="0">`;
    html += `<tr><td style = "text-align:center;" colspan = "2">`;
    html += `<p>Add ${index + 1}<sup>${index===0?"st":index===1?"nd":index===2?"rd":"th"}</sup> player or team info for game: ${gameName}</p>`
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;width:30%;">`;
    html += `Team or player name:`;
    html += `</td><td>`;
    html += `<input type="input" maxlength="12" id="in-teamName${index}" placeholder="${index + 1}${index===0?"st":index===1?"nd":index===2?"rd":"th"} Name" autofocus onKeyUp="checkTeamEntries(${index})"/>`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;width:30%;">`;
    html += `Primary Color for team tile:`;
    html += `</td><td>`;
    const primaryRando = getRandomColor(usedColors);
    usedColors.push(primaryRando);
    html += `<input type="color" id="primary-color${index}" value="${primaryRando}" onChange="checkTeamEntries(${index})">`
  
    html += `<tr><td style="text-align:right;width:30%;">`;
    html += `Secondary Color for team tile:`;
    html += `</td><td>`;
    const secondaryRando = getRandomColor(usedColors);
    usedColors.push(secondaryRando);
    html += `<input type="color" id="secondary-color${index}" value="${secondaryRando}" onChange="checkTeamEntries(${index})">`
    html += `</td></tr><td></td><td>`;
    html += `<i>Click or tap a color swath to select and change color.</i>`
    html += `</td></tr>`;
    html += `<tr><td>`;
    html += `<tr><td style = "text-align:center;" colspan = "2">`;
    html += `<input type="submit" value = "Add" id="add-team-button${index}" disabled=true formaction="javascript:addTeam(${index})"/>`;
    html += `<input type="button" value = "Done" id="done-team-button${index}" disabled=true onClick="destroyById('addDiv${index}');buildAndSendScore();"/>`;
    html += `</td></tr>`;
    html += `</table>`;
    // html += `</form></div>`;
    html += `</form>`;
    return html;
}

function checkTeamEntries(index) {
    const teamName = document.getElementById(`in-teamName${index}`).value;
    const primaryColor = document.getElementById(`primary-color${index}`).value;
    const secondaryColor = document.getElementById(`secondary-color${index}`).value;
    const addButton = document.getElementById(`add-team-button${index}`);
    addButton.disabled = true;
    if (teamName && (secondaryColor !== primaryColor)) {
        addButton.disabled = false;
    }
}

function getRandomColor(notOneOfThese) {
    let colors = [
        "#FF0000",  // red
        "#0000FF",  // blue
        "#008000",  // green
        "#FFFF00",  // yellow
        "#FFA500",  // orange
        "#800080",  // purple
        "#FFFFFF",  // white
        "#000000",  // black
        "#808080",  // gray
        "#000080",  // navy
        "#800000",  // maroon
        "#FFD700",  // gold
        "#C0C0C0",  // silver
        "#A52A2A",  // brown
        "#00BFFF",  // deep sky blue
        "#9370DB",  // medium purple
        "#FF6347",  // tomato
        "#008080",  // teal
        "#FFC0CB",  // pink
        "#FF7F50",  // coral
        "#3CB371",  // medium sea green
        "#4682B4",  // steel blue
        "#FFFFE0",  // light yellow
        "#BC8F8F"   // rosy brown
      ];
    
    colors = colors.filter(value => !notOneOfThese.includes(value));
    var color = colors[Math.floor(Math.random() * colors.length)];
    return color;
}

function addTeam(index) {
    const primaryColor = document.getElementById(`primary-color${index}`).value;
    const secondaryColor = document.getElementById(`secondary-color${index}`).value;
    const teamName = document.getElementById(`in-teamName${index}`).value;
    let html = ``;
    html += `${teamName}`;
    html += `<input type="hidden" id="teamName${index}" value="${teamName}" /><br>`;
    html += `<input type="hidden" id="score${index}" value="0" /><br>`;
    html += `<input type="hidden" id="color${index}" value="${primaryColor}" /><br>`;
    html += `<input type="hidden" id="textColor${index}" value="${secondaryColor}" />`;
    
    let fontSize = `8vh`;
    
    var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
    if (orientation && orientation.includes(`portrait`)){
        fontSize = `3vh`;
    }
    const div = document.createElement(`div`);
    div.innerHTML = html;
    document.body.appendChild(div);
    div.classList.add(`exampleDiv`);
    div.id = `div${index}`;
    div.style.backgroundColor = primaryColor;
    div.style.color = secondaryColor;
    div.style.width = `25%`;
    div.style.height = `50%`;
    div.style.float = `left`;
    div.style.fontSize = fontSize;
    div.style.textAlign = `center`;
    div.style.borderRadius = `5px`;
    // remove the current add team div
    let node = document.getElementById("addDiv" + index);
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }

    if (index === 7) {
        buildAndSendScore();
        return;
    }
    addPlayerOrTeam(index + 1);
}

function buildAndSendScore() {

    const scores = [];

    for (let i = 0; i < 8; i++) {
        if (!document.getElementById(`teamName${i}`)) {
            break;
        }
        const teamName = document.getElementById(`teamName${i}`).value;
        const score = document.getElementById(`score${i}`).value;
        const color = document.getElementById(`color${i}`).value;
        const textColor = document.getElementById(`textColor${i}`).value;
        let theScore = {};
        theScore.teamName = teamName;
        theScore.score = score;
        theScore.color = color;
        theScore.textColor = textColor;
        scores.push(theScore);

    }
    let hasTimer = false;
    if (USE_TIMER){
        hasTimer = true;
    }
    scoreChange(ROOM_NAME, scores, true, TOTAL_SECONDS);
    drawScreen(scores, true, ROOM_NAME, hasTimer);
    const pointsPer = POINTS_PER_TAP;
    if (pointsPer && parseInt(pointsPer, 10) > 1) {
        modalMessage(`Each click on the score will add ${pointsPer} points, clicking at bottom of score will subtract ${pointsPer} points. If you need to add or remove a single point, slide up on the score to add, slide down to remove.`);
    }
}

async function shouldShowSubmitButton() {
    const gameName = document.getElementById(`game-name`).value;
    const addPlayerButton = document.getElementById(`add-player-button`);
    const gameMessageSpan = document.getElementById(`game-msg-span`);
    gameMessageSpan.innerHTML = `&nbsp;`;
    if (gameName && gameName.length > 0 && isTimerSetOrNotChosen()) {
        const available = await isRoomAvailable(gameName);
        if (available) {
            addPlayerButton.disabled = false;
        } else {
            gameMessageSpan.innerHTML = `The name "${gameName}" in use.`
            addPlayerButton.disabled = true;
        }

    } else {
        addPlayerButton.disabled = true;
    }
}


const isToday = (someDate) => {
    if (!someDate) {
        return false;
    }
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}