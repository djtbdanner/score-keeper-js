let teamCount = 0;
const replaceMe = `<h4>checking for rooms...</h4>`;
function buildEntryScreens() {
    let scorepage = ``;
    scorepage += `<div id="input" class="modal"><br>`;
    scorepage += `<table cellpadding="0" cellspacing="0" width="100%" border="0">`;
    scorepage += `<tr><td>`;
    scorepage += `&nbsp;Game:`;
    scorepage += `</td><td>`;
    scorepage += `<input type="text" id="send-room" value="roomName" />`;
    scorepage += `</td></tr>`;
    scorepage += `<tr><td colspan="2" style = "text-align:center;">`;  
    scorepage += `<input type="button" id="submit" value="Start Keeping Score..." onClick="buildAndSendScore();"/>`;
    scorepage += `</td></tr>`;
    scorepage += `<tr><td colspan="2" style = "text-align:center;">`;  
    scorepage += `<br><input type="button" id="addPlayerButton" value="Add Player or team" onClick="addPlayerOrTeam();" />`;
    scorepage += `</td></tr>`;
    scorepage += `<tr><td colspan="2">`; 
    scorepage += `<p>Add teams one by one for all teams or players - or - if there is a game in progress, you may select below.</p>`;
    scorepage += `</td></tr>`;
    scorepage += `<tr><td colspan="2" style = "text-align:center;">`;  
    scorepage += replaceMe;
    scorepage += `</td></tr>`;
    scorepage += `</table>`;
    scorepage += `</div>`;

    let existing = document.getElementById("screen-div");
    existing.innerHTML = scorepage;
    existing.style.display = `block`;

    const availableRooms = getAvailableRooms();
    existing.innerHTML = scorepage;
    existing.style.display = `block`

}

function buildRoomList(availableRooms) {
    let existing = document.getElementById("screen-div");
    let html = existing.innerHTML;
    if (availableRooms && availableRooms.length > 0) {
        let scorepage = ``;
        scorepage += `<select onChange="joinRoom(this.value)">`;
        scorepage += `<option>-select game-</option>`;
        availableRooms.forEach(roomName => {
            scorepage += `<option><value = "${roomName}">${roomName}</option>`;
        });
        scorepage += `</select>`;
        html = html.replace(replaceMe, scorepage);
    } else {
        html = html.replace(replaceMe, `<h4>No games at this time.</h4>`);
    }
    existing.innerHTML = html;
}

function addPlayerOrTeam() {
    const html = getForm(teamCount);
    teamCount = teamCount + 1;
    let div = document.createElement(`div`);
    div.innerHTML = html;
    document.body.appendChild(div);
}

function getForm(index) {
    let html = ``;
    html += `<div id="addDiv${index}" class = "modal">`;
    html += `<br>`;
    html += `<table cellpadding="5" cellspacing="0" width="100%" border="0">`;
    html += `<tr><td>`;
    html += `Team Name:`;
    html += `</td><td>`;
    html += `<input type="input" id="in-teamName${index}" placeholder="Tigers"/>`;
    html += `</td></tr>`;
    html += `<tr><td>`;
    html += `score:`;
    html += `</td><td>`;
    html += `<input type="input" id="in-score${index}" value = "0"/>`;
    html += `<tr><td>`;
    html += `Color (bground):`;
    html += `</td><td>`;
    html += `<input type="input" id="in-color${index}" placeholder="red"/>`;
    html += `</td></tr>`;
    html += `<tr><td>`;
    html += `Color (text):`;
    html += `</td><td>`;
    html += `<input type="input" id="in-textColor${index}" placeholder="black"/>`;
    html += `<tr><td>`;
    html += `<tr><td style = "text-align:center;" colspan = "2">`;
    html += `<input type="button" value = "Add" id="button${index}" onClick="addTeam('${index}', )"/>`;
    html += `</td></tr>`;
    html += `</table>`;
    html += `</div>`;
    return html;
}

function addTeam(index) {
    const teamName = document.getElementById(`in-teamName${index}`).value;
    const score = document.getElementById(`in-score${index}`).value;
    const color = document.getElementById(`in-color${index}`).value;
    const textColor = document.getElementById(`in-textColor${index}`).value;
    let node = document.getElementById("addDiv" + index);
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
    let html = ``;
    html += `<div id="div${index}" class="disp" style="background-color:${color};color:${textColor}">`;
    html += `${teamName}: ${score}`;
    html += `<input type="hidden" id="teamName${index}" value="${teamName}" /><br>`;
    html += `<input type="hidden" id="score${index}" value="${score}" /><br>`;
    html += `<input type="hidden" id="color${index}" value="${color}" /><br>`;
    html += `<input type="hidden" id="textColor${index}" value="${textColor}" />`;
    html += `</div>`;
    let div = document.createElement(`div`);
    div.innerHTML = html;
    document.getElementById("the-top").appendChild(div);
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
    const roomName = document.getElementById(`send-room`).value;
    console.log(`roomName = ${roomName}`);
    console.log(`scores = ${scores}`);
    scoreChange(roomName, scores);
}

function joinRoomcall() {
    const roomName = document.getElementById(`join-room`).value;
    joinRoom(roomName);
}