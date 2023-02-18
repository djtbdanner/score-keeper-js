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
        html += `<a class ="menuItem" onClick="addTimer()">Add Timer</a></br>`;
        html += `<hr>`;
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

var bugle_tune = new Audio('/sounds/bugle_tune.mp3');

function createAndAppendDiv(html, id, isFullScreen) {
    let div = document.getElementById(id);
    if (div){
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

function clearAllDivs() {
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
    for (d = 0; d < 8; d++) {
        const t = document.getElementById(`scoretext${d}`);
        if (!t) {
            break;
        }
        t.innerHTML = `0`;
    }
    buildSendScoreFromScreen();
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
