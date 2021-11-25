async function buildMenu() {
    const isOwner = document.getElementById(`room-owner`).value === "true";
    let html = ``;
    html += `<div id="menu" class="menu" onClick="destroyMenu()">`;
    if (isOwner) {
        html += `<a class ="menuItem" onClick="resetScore()">Reset Score</a></br>`;
        html += `<hr>`;
    } else {
        html += `<a class ="menuItem">close menu...</a></br>`;
        html += `<hr>`;
    }
    if (!document.fullscreenElement) {
        html += `<a class ="menuItem" onClick="openFullScreen();">FullScreen</a></br>`;
        html += `<hr>`;
    } else {
        html += `<a class ="menuItem" onClick="closeFullscreen();">Exit FullScreen</a></br>`;
        html += `<hr>`;
    }
    html += `<a class ="menuItem" onClick="goToHomePage();">Home</a></br>`;
    html += `<hr>`;
    html += `<a class ="menuItem" >Close Menu</a></br>`;
    html += `</div>`;
    let div = document.createElement(`div`);
    div.innerHTML = html;
    document.body.appendChild(div);
}

function destroyMenu() {
    let node = document.getElementById(`menu`);
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
        t.innerHTML = '0';
    }
    buildSendScoreFromScreen();
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
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