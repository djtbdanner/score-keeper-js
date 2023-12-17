let ROOM_NAME = "";
let ROOM_OWNER = false;
let POINTS_PER_TAP = 1;
let USE_TIMER = false;
let TOTAL_SECONDS = 0;


async function buildMenu() {
    destroyById(`menu`);
    let html = ``;
    html += `<div id="menu" class="menu" onClick="destroyById('menu')">`;
    if (ROOM_OWNER) {
        html += `<a class ="menuItem" onClick="resetScore()">Reset Score</a></br>`;
        html += `<hr>`;
        if (!USE_TIMER) {
            html += `<a class ="menuItem" onClick="updateTimer()">Add Timer</a></br>`;
            html += `<hr>`;
        } else {
            html += `<a class ="menuItem" onClick="updateTimer()">Update Timer</a></br>`;
            html += `<hr>`;
        }
    }
    if (!document.fullscreenElement) {
        html += `<a class ="menuItem" onClick="openFullScreen();">FullScreen</a></br>`;
        html += `<hr>`;
    } else {
        html += `<a class ="menuItem" onClick="closeFullscreen();">Exit FullScreen</a></br>`;
        html += `<hr>`;
    }
    html += `<a class ="menuItem" onClick="textMessages();">View messages</a></br>`;
    html += `<hr>`;
    html += `<a class ="menuItem" onClick="sendMessage();">Send Message</a></br>`;
    html += `<hr>`;
    html += `<a class ="menuItem" onClick="goToHomePage();">Home</a></br>`;
    html += `<hr>`;
    html += `<a class ="menuItem" >Close Menu</a></br>`;
    html += `</div>`;

    createAndAppendDiv(html, 'default', false);
}

var beeper_emergency_call = new Audio('/sounds/beeper_emergency_call.mp3');

function createAndAppendDiv(html, id, isFullScreen) {
    let div = document.getElementById(id);
    if (div) {
        destroyNode(div);
        div = undefined;
    }
    if (!div) {
        div = document.createElement(`div`);
        div.id = id;
    }
    if (isFullScreen) {
        div.style.width = `100%`;
        div.style.height = `100%`;
    }
    div.innerHTML = html;
    document.body.appendChild(div);
}

function clearHtmlBody() {
    document.body.innerHTML = "";
}

function destroyNode(node) {
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

function destroyById(id) {
    let node = document.getElementById(id);
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

function resetScore() {
    const doIt = confirm(`Reset score to all 0's?`);
    if (doIt) {
        for (d = 0; d < 8; d++) {
            const t = document.getElementById(`scoretext${d}`);
            if (!t) {
                break;
            }
            t.innerHTML = `0`;
        }
        buildSendScoreFromScreen();
    } else {
        destroyById('menu');
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function openFullScreen() {
    var root = document.documentElement;
    if (root.requestFullscreen) {
        root.requestFullscreen();
    } else if (root.webkitRequestFullscreen) {
        root.webkitRequestFullscreen();
    } else if (root.msRequestFullscreen) {
        root.msRequestFullscreen();
    }
}

function goToHomePage() {
    window.location = '/';
}

async function modalConfirm(message, doFunctionName, dontFunctionName, doButton, dontButton) {

    if (!doButton) {
        doButton = `Continue`;
    }
    if (!dontButton) {
        dontButton = `Cancel`;
    }
    destroyById(`modal-confirm`);
    let html = ``;
    html += `<div id="modal-confirm" class="modal" style="background-color: rgba(139, 139, 139, 0.9);">`;
    html += `<table cellpadding="0" cellspacing="0" width="100%" border="0">`;
    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<p>${message}</p>`;
    html += `</td></tr>`;
    html += `<tr><td style = "text-align:center;">`;
    html += `<input type="button" value="${doButton}" onClick="destroyById('modal-confirm');${doFunctionName};" />`;
    html += `</td><td  style = "text-align:center;">`;
    html += `<input type="button" value="${dontButton}" onClick="destroyById('modal-confirm');${dontFunctionName};" />`;
    html += `</td></tr>`;
    html += `</table>`;
    html += `</div>`;
    createAndAppendDiv(html, 'default', false);
}

async function modalMessage(message) {
    //destroyById('modal-message');
    let html = ``;
    html += `<div id="modal-message" class="modal" style="background-color: rgba(139, 139, 139, 0.9);" onClick="destroyById('modal-message')">`;
    html += `<table cellpadding="0" cellspacing="0" width="100%" border="0">`;
    html += `<tr><td colspan="2" style = "text-align:center;">`;
    html += `<p>${message}</p>`;
    html += `</td></tr>`;
    html += `<tr><td style = "text-align:center;">`;
    html += `<input type="button" value="OK" onClick="destroyById('modal-message')" />`;
    html += `</td></tr>`;
    html += `</table>`;
    html += `</div>`;
    createAndAppendDiv(html, 'default', false);
}

async function textMessages() {
    destroyById('text-message');
    let messages = await getMessages(ROOM_NAME);
    if (!messages || messages.length < 1) {
        messages = [`no messages`];
    }
    let html = ``;
    html += `<div id="text-message" class="txt" style="background-color: rgba(139, 139, 139, 0.9);text-align:center;">`;
    html += `<textarea style="width:98%;height:90%;" id="txt-messages" readonly="true">`;
    messages.forEach((message) => html += `&#8226;${message}\n`);
    html += `</textarea>`;
    html += `</br><input type="button" value="close" onClick="destroyById('text-message');" />`;
    html += `</div>`;
    createAndAppendDiv(html, 'default', false);
    var textarea = document.getElementById('txt-messages');
    textarea.scrollTop = textarea.scrollHeight;
}

function sendMessage() {
    destroyById('text-message-in');
    let html = ``;
    html += `<form><div id="text-message-in" class="txt" style="background-color: rgba(139, 139, 139, 0.9);text-align:center;">`;
    html += `<textarea id="txt-message-to-send" style="width:98%;height:50%;" onKeyup="checkDisabled()">`;
    html += `</textarea>`;
    html += `</br><input type="button" value="Cancel" onClick="destroyById('text-message-in');" />`;
    html += `<input type="submit" value="Send" disabled="true" id="send-text-button" formaction="javascript:send()"/>`;
    html += `</div></form>`;
    createAndAppendDiv(html, 'default', false);
    document.getElementById(`txt-message-to-send`).focus();
}


function updateTimer() {
    destroyById('add-timer');
    let html = ``;
    html += `<form><div id="add-timer" class="modal" style="background-color: rgba(139, 139, 139, 0.9);text-align:center;">`;
    html += `<br>`;
    html += `<br>`;
    html += `<input type="number" maxlength="3" id="timer-minutes" value = "0" min="0" max="999" onChange="checkTimerAddButton()"/>:`;
    html += `<input type="number" maxlength="2" id="timer-seconds" value = "0" min="0" max="60" onChange="checkTimerAddButton()"/>`;
    html += `<br>`;
    html += `minutes:seconds`;
    html += `<br>`;
    buttonName = USE_TIMER ? `Update Timer` : `Add Timer`;
    html += `<input type="button" value="Cancel" id="cancel-timer-button" onClick="javascript:destroyById('add-timer')"/>`;
    html += `<input type="submit" value="${buttonName}" disabled="true" id="add-timer-button" formaction="javascript:addTimerButtonClick()"/>`;
    if (USE_TIMER) {
        html += `<input type="button" value="Remove Timer" id="remove-timer-button" onClick="javascript:removeTimerButtonClick()"/>`;
    }
    html += `</div></form>`;
    createAndAppendDiv(html, 'default', false);
    document.getElementById(`timer-minutes`).focus();
}

function checkTimerAddButton() {
    document.getElementById(`add-timer-button`).disabled = true;
    if (document.getElementById(`timer-minutes`).value && document.getElementById(`timer-seconds`).value) {
        if (parseInt(document.getElementById(`timer-minutes`).value, 10) > 0 || parseInt(document.getElementById(`timer-seconds`).value, 10) > 0) {
            document.getElementById(`add-timer-button`).disabled = false;
        }
    }
}

function addTimerButtonClick() {
    USE_TIMER = true;
    const minutes = document.getElementById(`timer-minutes`).value;
    const seconds = document.getElementById(`timer-seconds`).value
    TOTAL_SECONDS = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    localStorage.setItem('use-timer', USE_TIMER);
    localStorage.setItem('total-seconds', TOTAL_SECONDS);
    timerChange(ROOM_NAME, true, TOTAL_SECONDS);
    rebuildGameFromLocalStorage();
}

function removeTimerButtonClick() {
    USE_TIMER = false;
    TOTAL_SECONDS = 0;
    localStorage.setItem('use-timer', USE_TIMER);
    localStorage.setItem('total-seconds', TOTAL_SECONDS);
    timerChange(ROOM_NAME, false, TOTAL_SECONDS);
    rebuildGameFromLocalStorage();
}


function checkDisabled() {
    const textMessage = document.getElementById(`txt-message-to-send`).value;
    const button = document.getElementById(`send-text-button`);
    if (textMessage) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

function send() {
    const message = document.getElementById(`txt-message-to-send`).value;
    sendTextMessage(ROOM_NAME, message);
    destroyById('text-message-in');
}

function secondsToDisplay(displaySeconds) {
    let minutes = 0;
    let seconds = displaySeconds;
    if (displaySeconds > 60) {
        minutes = Math.floor(displaySeconds / 60);
        seconds = displaySeconds % 60;
    }
    minutes = String(minutes).padStart(2, `0`);
    seconds = String(seconds).padStart(2, `0`);
    return `${minutes}:${seconds} `;
}