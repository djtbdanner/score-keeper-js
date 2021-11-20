let teamCount = 0;
async function buildEntryScreens() {

    const rooms = await getAvailableRooms();
    let roomsList = ``;
    if (rooms){
        roomsList = buildRoomList(rooms);
    }

    let html = ``;
    html += `<form><div id="initial-screen" class="modal">`;
    html += `<table cellpadding="0" cellspacing="0" width="100%" border="0">`;
    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<p>Enter game name, add teams or players.</p>`
    html += `</td></tr>`;
    html += `<tr><td>`;
    html += `&nbsp; Game: `;
    html += `</td><td>`;
    html += `<input type="text" id="game-name" placeholder="GameName" onKeyUp="checkTeamName()" autofocus />`;
    html += `</td></tr>`;
    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<span id = "game-msg-span">&nbsp</span>`
    // html += `<input type="button" id="submit" value="Start Keeping Score..." onkeyup="buildAndSendScore();"/>`;
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

function setRoomAddPlayer(){
    document.getElementById(`room-name`).value = document.getElementById(`game-name`).value;
    destroyElementNamed('initial-screen');
    addPlayerOrTeam();
}

function buildRoomList(availableRooms) {

    if (availableRooms && availableRooms.length > 0) {
        let html = ``;
        html += `<tr><td colspan="2">`;
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

function setRoomAddJoin(roomName){
    document.getElementById(`room-name`).value = roomName;
    destroyElementNamed('initial-screen');
    joinRoom(roomName);
}

function addPlayerOrTeam() {
    const html = buildAddTeamForm(teamCount);

    let div = document.createElement(`div`);
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById(`in-teamName${teamCount}`).focus();
    // two teams, enable done
     const enableDone = document.getElementById(`teamName${1}`) === null;
    const doneButton = document.getElementById(`done-team-button${teamCount}`);
    doneButton.disabled = enableDone;
    teamCount = teamCount + 1;
}

function buildAddTeamForm(index) {

    let html = ``;
    html += `<div id="addDiv${index}" class = "modal">`;
    html += `<br>`;
    html += `<table cellpadding="5" cellspacing="0" width="100%" border="0">`;
    html += `<tr><td style = "text-align:center;" colspan = "2">`;
    html += `Add team # ${teamCount + 1}`
    html += `</td></tr>`;
    html += `<tr><td>`;
    html += `Team Name:`;
    html += `</td><td>`;
    html += `<input type="input" id="in-teamName${index}" placeholder="Team${teamCount+1} Name" autofocus onChange="checkTeamEntries(${index})"/>`;
    html += `</td></tr>`;
    html += `<tr><td>`;
    html += `Primary Color:`;
    html += `</td><td>`;
    html += buildColorSelector(`primary-color`, `${index}`);
    html += `</td></tr>`;
    html += `<tr><td>`;
    html += `Secondary Color:`;
    html += `</td><td>`;
    html += buildColorSelector(`secondary-color`, `${index}`);
    html += `<tr><td>`;
    html += `<tr><td style = "text-align:center;" colspan = "2">`;
    html += `<input type="button" value = "Add" id="add-team-button${index}" disabled=true onClick="addTeam('${index}')"/>`;
    html += `<input type="button" value = "Done" id="done-team-button${index}" disabled=true onClick="destroyElementNamed('addDiv${index}');buildAndSendScore();"/>`;
    html += `</td></tr>`;
    html += `</table>`;
    html += `</div>`;
    return html;
}

function checkTeamEntries(index){
    const teamName = document.getElementById(`in-teamName${index}`).value;
    const primaryColorOption =  document.getElementById(`primary-color${index}`);
    const secondaryColorOption =document.getElementById(`secondary-color${index}`);
    const addButton = document.getElementById(`add-team-button${index}`);

    
    const primaryColor = primaryColorOption.options[primaryColorOption.selectedIndex].value;
    const secondaryColor = secondaryColorOption.options[secondaryColorOption.selectedIndex].value;


    let color = `black`;
    primaryColorOption.style.backgroundColor = `white`;
    secondaryColorOption.style.backgroundColor = `white`;
    if (primaryColor && !primaryColor.includes(`select`)){
        color = `black`;
        if (primaryColor.toLowerCase() === `black`){
            color = `white`;
        }
        primaryColorOption.style.backgroundColor = primaryColor;
        primaryColorOption.style.color = color;
    }
    if (secondaryColor && !secondaryColor.includes(`select`)){
        color = `black`;
        if (secondaryColor.toLowerCase() === `black`){
            color = `white`;
        }
        secondaryColorOption.style.backgroundColor = secondaryColor;
        secondaryColorOption.style.color = color;
    }

    addButton.disabled = true;
    // doneButton.disabled = true;
    if (teamName &&  (secondaryColor && !secondaryColor.includes(`select`)) && (secondaryColor && !secondaryColor.includes(`select`))){
        if (secondaryColor !== primaryColor){
            addButton.disabled = false;
           // doneButton.disabled = false;
        }
    }
}

function destroyElementNamed(divName) {
    
    let node = document.getElementById(divName);
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

function addTeam(index) {

    const primaryColorOption =  document.getElementById(`primary-color${index}`);
    const secondaryColorOption =document.getElementById(`secondary-color${index}`);
    const primaryColor = primaryColorOption.options[primaryColorOption.selectedIndex].value;
    const secondaryColor = secondaryColorOption.options[secondaryColorOption.selectedIndex].value;

    const teamName = document.getElementById(`in-teamName${index}`).value;
    // const score = document.getElementById(`in-score${index}`).value;
    // const color = document.getElementById(`in-color${index}`).value;
    // const textColor = document.getElementById(`in-textColor${index}`).value;
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
    document.getElementById("the-top").appendChild(div);

    let node = document.getElementById("addDiv" + index);
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
    addPlayerOrTeam();
}

function buildAndSendScore() {

    const scores = [];

    for (let i = 0; i < 8; i++) {
        console.log(i);
        console.log(document.getElementById(`teamName${i}`));//(l).value;
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
    console.log(JSON.stringify(scores));
    const roomName = document.getElementById(`room-name`).value;
    // console.log(`roomName = ${roomName}`);
    // console.log(`scores = ${scores}`);
    const divs = document.getElementsByTagName(`div`);
    for (div of divs) {
        if (div.id !== `screen-div` && div.id !== 'the-top') {
            if (div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }
    }
    scoreChange(roomName, scores);
    drawScreen(scores, true);
}

async function checkTeamName(){
    const gameName = document.getElementById(`game-name`).value;
    const addPlayerButton = document.getElementById(`add-player-button`);
    const gameMessageSpan = document.getElementById(`game-msg-span`);
    gameMessageSpan.innerHTML = `&nbsp;`;
    if (gameName && gameName.length > 0){
        const available = await isRoomAvailable(gameName);
        console.log(`is available ${available}`);
        if (available){
            addPlayerButton.disabled = false;
        } else {
            gameMessageSpan.innerHTML = `The name "${gameName}" in use.`
            addPlayerButton.disabled = true;
        }
      
    } else {
        addPlayerButton.disabled = true;
    }
}

function buildColorSelector(name, index) {
    const colors = [
        `Red`,
        `IndianRed`,
        `LightCoral`,
        `Salmon`,
        `DarkSalmon`,
        `LightSalmon`,
        `Crimson`,
        `FireBrick`,
        `DarkRed`,
        `Lime`,
        `Green`,
        `GreenYellow`,
        `Chartreuse`,
        `LawnGreen`,
        `LimeGreen`,
        `PaleGreen`,
        `LightGreen`,
        `MediumSpringGreen`,
        `SpringGreen`,
        `MediumSeaGreen`,
        `SeaGreen`,
        `ForestGreen`,
        `DarkGreen`,
        `YellowGreen`,
        `OliveDrab`,
        `Olive`,
        `DarkOliveGreen`,
        `MediumAquamarine`,
        `DarkSeaGreen`,
        `LightSeaGreen`,
        `DarkCyan`,
        `Teal`,
        `Blue`,
        `MediumBlue`,
        `DarkBlue`,
        `Navy`,
        `MidnightBlue`,
        `RoyalBlue`,
        `Aqua`,
        `Cyan`,
        `LightCyan`,
        `PaleTurquoise`,
        `Aquamarine`,
        `Turquoise`,
        `MediumTurquoise`,
        `DarkTurquoise`,
        `CadetBlue`,
        `SteelBlue`,
        `LightSteelBlue`,
        `PowderBlue`,
        `LightBlue`,
        `SkyBlue`,
        `LightSkyBlue`,
        `DeepSkyBlue`,
        `SkyBlue`,
        `CornflowerBlue`,
        `MediumSlateBlue`,
        `Pink`,
        `LightPink`,
        `HotPink`,
        `DeepPink`,
        `MediumVioletRed`,
        `PaleVioletRed`,
        `Orange`,
        `DarkOrange`,
        `OrangeRed`,
        `Tomato`,
        `Coral`,
        `Yellow`,
        `Gold`,
        `LightYellow`,
        `LemonChiffon`,
        `LightGoldenrodYellow`,
        `PapayaWhip`,
        `Moccasin`,
        `PeachPuff`,
        `PaleGoldenrod`,
        `Khaki`,
        `DarkKhaki`,
        `Purple`,
        `DarkViolet`,
        `DarkOrchid`,
        `DarkMagenta`,
        `Lavender`,
        `Thistle`,
        `Plum`,
        `Violet`,
        `Orchid`,
        `Fuchsia`,
        `Magenta`,
        `MediumOrchid`,
        `MediumPurple`,
        `RebeccaPurple`,
        `BlueViolet`,
        `Indigo`,
        `SlateBlue`,
        `DarkSlateBlue`,
        `MediumSlateBlue`,
        `Brown`,
        `SaddleBrown`,
        `Cornsilk`,
        `BlanchedAlmond`,
        `Bisque`,
        `NavajoWhite`,
        `Wheat`,
        `BurlyWood`,
        `Tan`,
        `RosyBrown`,
        `SandyBrown`,
        `Goldenrod`,
        `DarkGoldenrod`,
        `Peru`,
        `Chocolate`,
        `Sienna`,
        `Maroon`,
        `White`,
        `Snow`,
        `HoneyDew`,
        `MintCream`,
        `Azure`,
        `AliceBlue`,
        `GhostWhite`,
        `WhiteSmoke`,
        `SeaShell`,
        `Beige`,
        `OldLace`,
        `FloralWhite`,
        `Ivory`,
        `AntiqueWhite`,
        `Linen`,
        `LavenderBlush`,
        `MistyRose`,
        `Gray`,
        `DimGray`,
        `LightSlateGray`,
        `SlateGray`,
        `Gainsboro`,
        `LightGray`,
        `Silver`,
        `DarkGray`,
        `DarkSlateGray`,
        `Black`];
    let html = ``;
    html += `<select id="${name}${index}" onChange="checkTeamEntries(${index})">`;
    html += `<option>-select color-</option>`;
    colors.forEach(color => {
        if (color.toLowerCase() === 'black') {
            html += `<option  style = "background:${color};color:white;"><value = "${color}">${color}</option>`;
        } else {
            html += `<option  style = "background:${color};"><value = "${color}">${color}</option>`;
        }
    });
    html += `</select>`;
    return html;
}