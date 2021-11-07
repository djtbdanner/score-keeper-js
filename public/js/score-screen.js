function drawScreen(teamsList) {

    let scorepage = ``;
    console.log(teamsList);
    let teamCount = teamsList.length;

    let root = document.documentElement;
    root.style.setProperty(`--default-font-size-landscape`, `40vh`);
    root.style.setProperty(`--default-font-size-portrait`, `25vh`);
    let widthtop = `50%`;
    let widthBottom = `100%`;
    let height = `100%`;

    if (teamCount > 2) {
        height = `50%`;
    }
    if (teamCount === 1){
        widthtop = `100%`;
    }
    if (teamCount <= 2){
        root.style.setProperty(`--default-font-size-landscape`, `70vh`);
        root.style.setProperty(`--default-font-size-portrait`, `28vh`);
    }
    if (teamCount > 4){
        root.style.setProperty(`--default-font-size-portrait`, `14vh`);
    }
    if (teamCount >= 7){
        root.style.setProperty(`--default-font-size-landscape`, `30vh`);
        root.style.setProperty(`--default-font-size-portrait`, `12vh`);
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

    console.log(`teamCount: ${teamCount} + ${widthtop} = ${widthBottom}`)

    for (let i = 0; i < teamCount; i++) {
        let thisWidth = widthtop;
        console.log(i + "   " + i / 2);
        if (teamCount === 3 && i > 1 || teamCount === 5 && i > 2 || teamCount === 7 && i > 3) { thisWidth = widthBottom; }
        scorepage += `<div id="div${i}" style="background-color: ${teamsList[i].color}; width:${thisWidth}; height:${height};float:left;">`;
        scorepage += `<div class="header" style="background-color: ${teamsList[i].textColor};">`;
        scorepage += `<h1 class="headertext" style="color:${teamsList[i].color}">${teamsList[i].teamName}</h1>`;
        scorepage += `</div>`;
        const s = teamsList[i].score; // Math.floor(Math.random() * (99 - 0 + 1)) + 0;
        scorepage += `<h1 class="scoretext" style="color:${teamsList[i].textColor}">${s}</h1>`;
        scorepage += `</div>`;
    }
    let existing = document.getElementById("screen-div");
    console.log(scorepage);
    existing.innerHTML = scorepage;
    existing.style.display = `block`;

}
