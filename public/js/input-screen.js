function buildEntryScreens() {

    let scorepage = ``;
    for (let i = 0; i < 8; i++) {
        scorepage += `<div id="div${i}" style="background-color: gray; width:20%; height:50%;float:left;border:5px solid black;">`;
        scorepage += `team name:`;
        scorepage += `<input type="input" id="teamName${i}" value="Hawks_${i}" /><br>`;
        scorepage += `score:`;
        scorepage += `<input type="input" id="score${i}" value="${i}" /><br>`;
        scorepage += `color:`;
        scorepage += `<input type="input" id="color${i}" value="black" /><br>`;
        scorepage += `text color:`;
        scorepage += `<input type="input" id="textColor${i}" value="gold" />`;
        scorepage += `</div>`;
    }
    scorepage += `<div id="input" style="background-color: gray; width:20%; height:50%;float:left;border:5px solid black;">`;
    scorepage += `<input type="text" id="send-room" value="roomName" onClick="buildAndSendScore();" />`;
    scorepage += `<br><input type="button" id="submit" value="send score" onClick="buildAndSendScore();" />`;
    scorepage += `<br>RoomToJoin:<input type="text" id="join-room" value="roomName" onClick="buildAndSendScore();" />`;
    scorepage += `<br><input type="button" id="submit" value="JOIN ROOM" onClick="joinRoomcall();" />`;
    scorepage += `</div>`;
    let existing = document.getElementById("screen-div");
    console.log(scorepage);
    existing.innerHTML = scorepage;
    existing.style.display = `block`;
}


function buildAndSendScore() {
    const scores = [];
    for (let i = 0; i < 8; i++) {

        const teamName = document.getElementById(`teamName${i}`).value;
        const score = document.getElementById(`score${i}`).value;
        const color = document.getElementById(`color${i}`).value;
        const textColor = document.getElementById(`textColor${i}`).value;
        if (teamName){
            let theScore = {};
            theScore.teamName = teamName;
            theScore.score = score;
            theScore.color = color;
            theScore.textColor = textColor;
            scores.push(theScore);
        }

    }
    console.log(JSON.stringify(scores));
    const roomName = document.getElementById(`send-room`).value;
    scoreChange(roomName, scores);
}

function joinRoomcall() {
    const roomName = document.getElementById(`join-room`).value;
    joinRoom(roomName);
}