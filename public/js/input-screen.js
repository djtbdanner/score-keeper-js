async function buildEntryScreens() {

    const storedScores = localStorage.getItem('scores');
    const date = localStorage.getItem('scores-date');
    const roomName = localStorage.getItem('room-name');
    const isOwner = localStorage.getItem(`is-owner`);
    if (storedScores && date && roomName) {
        const dateToCompare = new Date(date);
        if (isToday(dateToCompare)) {
            const msg = `You were keeping score for <i><b>${roomName}</b></i> earlier today</br> Would you like to continue with that game?`;
            modalConfirm(msg, `rebuildGameFromLocalStorage()`, `buildInitialScreen()`, `Continue ${roomName}`, `New Game`);
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

    let html = ``;
    html += `<form><div id="initial-screen" class="modal">`;
    html += `<table cellpadding="0" cellspacing="0" width="100%" border="0">`;
    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<p>Enter game, choose points per goal and add teams or players.</p>`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;">`;
    html += `Game: `;
    html += `</td><td>`;
    html += `<input type="text" maxlength="10" id="game-name" placeholder="GameName" onKeyUp="checkTeamName()" autofocus />`;
    html += `</td></tr>`;
    html += `<tr><td style="text-align:right;">`;
    html += `Points: `;
    html += `</td><td>`;
    html += `<input type="number" maxlength="3" id="goal-points" value = "1" min="1" max="100" />`;
    html += `</td></tr>`;
    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<span id = "game-msg-span">&nbsp</span>`;
    html += `</td></tr>`;
    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<br><input type="submit" id="add-player-button" disabled="true" value="Add Team or Player" formaction="javascript:setRoomAddPlayer();" />`;
    html += `</td></tr>`;
    html += roomsList;
    html += `</table>`;
    html += `</div></form>`;
    let existing = document.getElementById(`screen-div`);
    existing.innerHTML = html;
    existing.style.display = `block`;
}

function rebuildGameFromLocalStorage() {

    const storedScores = localStorage.getItem('scores');
    const date = localStorage.getItem('scores-date');
    const roomName = localStorage.getItem('room-name');
    document.getElementById(`room-name`).value = roomName;
    document.getElementById(`room-owner`).value = "true";
    document.getElementById(`points-per-tap`).value = localStorage.getItem(`points-per-tap`) || 1;
    const scores = JSON.parse(storedScores);
    sendRoomMessage(roomName, `Score keeper reconnected to ${roomName}.`);
    scoreChange(roomName, scores, true);
    drawScreen(scores, true, roomName);
}

function setRoomAddPlayer() {

    const selectedRoomName = document.getElementById(`game-name`).value;
    document.getElementById(`room-name`).value = document.getElementById(`game-name`).value;
    document.getElementById(`points-per-tap`).value = document.getElementById(`goal-points`).value;
    destroyElementNamed('initial-screen');
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
    destroyElementNamed('initial-screen');
    document.getElementById(`room-name`).value = roomName;
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

    let div = document.createElement(`div`);
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById(`in-teamName${index}`).focus();
    // two teams, enable done
    const enableDone = document.getElementById(`teamName${1}`) === null;
    const doneButton = document.getElementById(`done-team-button${index}`);
    doneButton.disabled = enableDone;
}

function buildAddTeamForm(index) {

    const gameName = document.getElementById(`room-name`).value;
    let html = ``;
    html += `<div id="addDiv${index}" class = "modal"><form>`;
    html += `<table cellpadding="5" cellspacing="0" width="100%" border="0">`;
    html += `<tr><td style = "text-align:center;" colspan = "2">`;
    html += `Add team # ${index + 1} for ${gameName}`
    html += `</td></tr>`;
    html += `<tr><td>`;
    html += `Team Name:`;
    html += `</td><td>`;
    html += `<input type="input" maxlength="10" id="in-teamName${index}" placeholder="Team${index + 1} Name" autofocus onKeyUp="checkTeamEntries(${index})"/>`;
    html += `</td></tr>`;
    html += `<tr><td>`;
    html += `Primary Color:`;
    html += `</td><td>`;
    // html += buildColorSelector(`primary-color`, `${index}`);
    const primaryRando = getRandomColor();
    html += `<input type="color" id="primary-color${index}" value="${primaryRando}" onChange="checkTeamEntries(${index})">`
    html += `</td></tr>`;
    html += `<tr><td>`;
    html += `Secondary Color:`;
    html += `</td><td>`;
    // html += buildColorSelector(`secondary-color`, `${index}`);
    const secondaryRando = getRandomColor(primaryRando);
    html += `<input type="color" id="secondary-color${index}" value="${secondaryRando}" onChange="checkTeamEntries(${index})">`
    html += `<tr><td>`;
    html += `<tr><td style = "text-align:center;" colspan = "2">`;
    html += `<input type="submit" value = "Add" id="add-team-button${index}" disabled=true formaction="javascript:addTeam(${index})"/>`;
    html += `<input type="button" value = "Done" id="done-team-button${index}" disabled=true onClick="destroyElementNamed('addDiv${index}');buildAndSendScore();"/>`;
    html += `</td></tr>`;
    html += `</table>`;
    html += `</form></div>`;
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

function destroyElementNamed(divName) {

    let node = document.getElementById(divName);
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

function getRandomColor(notThisOne) {
    let colors = [`#FFFFFF`,
        `#C0C0C0`,
        `#808080`,
        `#000000`,
        `#FF0000`,
        `#800000`,
        `#FFFF00`,
        `#808000`,
        `#00FF00`,
        `#008000`,
        `#00FFFF`,
        `#008080`,
        `#0000FF`,
        `#000080`,
        `#FF00FF`,
        `#800080`,
        `#8B4513`,
        `#FF8C00`,
        `#FF69B4`,];
    colors = colors.filter((a) => a !== notThisOne);
    var color = colors[Math.floor(Math.random() * colors.length)];
    return color;
}

function addTeam(index) {
    const primaryColor = document.getElementById(`primary-color${index}`).value;
    const secondaryColor = document.getElementById(`secondary-color${index}`).value;
    const teamName = document.getElementById(`in-teamName${index}`).value;
    let html = ``;
    html += `<div id="div${index}" class="disp" style="background-color:${primaryColor};color:${secondaryColor}">`;
    html += `${teamName}`;
    html += `<input type="hidden" id="teamName${index}" value="${teamName}" /><br>`;
    html += `<input type="hidden" id="score${index}" value="0" /><br>`;
    html += `<input type="hidden" id="color${index}" value="${primaryColor}" /><br>`;
    html += `<input type="hidden" id="textColor${index}" value="${secondaryColor}" />`;
    html += `</div>`;
    let div = document.createElement(`div`);
    div.innerHTML = html;

    document.body.appendChild(div);
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
        // console.log(i);
        // console.log(document.getElementById(`teamName${i}`));//(l).value;
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
    // console.log(JSON.stringify(scores));
    const roomName = document.getElementById(`room-name`).value;
    // console.log(`roomName = ${roomName}`);
    // console.log(`scores = ${scores}`);
    const divs = document.getElementsByTagName(`div`);
    for (div of divs) {
        if (div.id !== `screen-div`) {
            if (div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }
    }
    document.getElementById(`room-owner`).value = true;
    scoreChange(roomName, scores, true);
    drawScreen(scores, true, roomName);
    const pointsPer =  document.getElementById(`points-per-tap`).value;
    if (pointsPer && parseInt(pointsPer, 10) > 1){
        modalMessage(`Each click on the score will add ${pointsPer} points, clicking at bottom of score will subtract ${pointsPer} points. If you need to add or remove a single point, slide up on the score to remove a point and slide down to add a point.`);
    }
}

async function checkTeamName() {
    const gameName = document.getElementById(`game-name`).value;
    const addPlayerButton = document.getElementById(`add-player-button`);
    const gameMessageSpan = document.getElementById(`game-msg-span`);
    gameMessageSpan.innerHTML = `&nbsp;`;
    if (gameName && gameName.length > 0) {
        const available = await isRoomAvailable(gameName);
        // console.log(`is available ${available}`);
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

// function buildColorSelector(name, index) {
//     let colors = [
//         `Red`,
//         `IndianRed`,
//         `LightCoral`,
//         `Salmon`,
//         `DarkSalmon`,
//         `LightSalmon`,
//         `Crimson`,
//         `FireBrick`,
//         `DarkRed`,
//         `Lime`,
//         `Green`,
//         `GreenYellow`,
//         `Chartreuse`,
//         `LawnGreen`,
//         `LimeGreen`,
//         `PaleGreen`,
//         `LightGreen`,
//         `MediumSpringGreen`,
//         `SpringGreen`,
//         `MediumSeaGreen`,
//         `SeaGreen`,
//         `ForestGreen`,
//         `DarkGreen`,
//         `YellowGreen`,
//         `OliveDrab`,
//         `Olive`,
//         `DarkOliveGreen`,
//         `MediumAquamarine`,
//         `DarkSeaGreen`,
//         `LightSeaGreen`,
//         `DarkCyan`,
//         `Teal`,
//         `Blue`,
//         `MediumBlue`,
//         `DarkBlue`,
//         `Navy`,
//         `MidnightBlue`,
//         `RoyalBlue`,
//         `Aqua`,
//         `Cyan`,
//         `LightCyan`,
//         `PaleTurquoise`,
//         `Aquamarine`,
//         `Turquoise`,
//         `MediumTurquoise`,
//         `DarkTurquoise`,
//         `CadetBlue`,
//         `SteelBlue`,
//         `LightSteelBlue`,
//         `PowderBlue`,
//         `LightBlue`,
//         `SkyBlue`,
//         `LightSkyBlue`,
//         `DeepSkyBlue`,
//         `SkyBlue`,
//         `CornflowerBlue`,
//         `MediumSlateBlue`,
//         `Pink`,
//         `LightPink`,
//         `HotPink`,
//         `DeepPink`,
//         `MediumVioletRed`,
//         `PaleVioletRed`,
//         `Orange`,
//         `DarkOrange`,
//         `OrangeRed`,
//         `Tomato`,
//         `Coral`,
//         `Yellow`,
//         `Gold`,
//         `LightYellow`,
//         `LemonChiffon`,
//         `LightGoldenrodYellow`,
//         `PapayaWhip`,
//         `Moccasin`,
//         `PeachPuff`,
//         `PaleGoldenrod`,
//         `Khaki`,
//         `DarkKhaki`,
//         `Purple`,
//         `DarkViolet`,
//         `DarkOrchid`,
//         `DarkMagenta`,
//         `Lavender`,
//         `Thistle`,
//         `Plum`,
//         `Violet`,
//         `Orchid`,
//         `Fuchsia`,
//         `Magenta`,
//         `MediumOrchid`,
//         `MediumPurple`,
//         `RebeccaPurple`,
//         `BlueViolet`,
//         `Indigo`,
//         `SlateBlue`,
//         `DarkSlateBlue`,
//         `MediumSlateBlue`,
//         `Brown`,
//         `SaddleBrown`,
//         `Cornsilk`,
//         `BlanchedAlmond`,
//         `Bisque`,
//         `NavajoWhite`,
//         `Wheat`,
//         `BurlyWood`,
//         `Tan`,
//         `RosyBrown`,
//         `SandyBrown`,
//         `Goldenrod`,
//         `DarkGoldenrod`,
//         `Peru`,
//         `Chocolate`,
//         `Sienna`,
//         `Maroon`,
//         `White`,
//         `Snow`,
//         `HoneyDew`,
//         `MintCream`,
//         `Azure`,
//         `AliceBlue`,
//         `GhostWhite`,
//         `WhiteSmoke`,
//         `SeaShell`,
//         `Beige`,
//         `OldLace`,
//         `FloralWhite`,
//         `Ivory`,
//         `AntiqueWhite`,
//         `Linen`,
//         `LavenderBlush`,
//         `MistyRose`,
//         `Gray`,
//         `DimGray`,
//         `LightSlateGray`,
//         `SlateGray`,
//         `Gainsboro`,
//         `LightGray`,
//         `Silver`,
//         `DarkGray`,
//         `DarkSlateGray`,
//         `Black`];
//     let html = ``;
//     colors.sort();
//     html += `<select id="${name}${index}" onChange="checkTeamEntries(${index})">`;
//     html += `<option>-select color-</option>`;
//     colors.forEach(color => {
//         if (color.toLowerCase() === 'black') {
//             html += `<option  style = "background:${color};color:white;"><value = "${color}">${color}</option>`;
//         } else {
//             html += `<option  style = "background:${color};"><value = "${color}">${color}</option>`;
//         }
//     });
//     html += `</select>`;
//     return html;
// }