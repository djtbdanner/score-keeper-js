# Score Keeper JS

Score Keeper JS is a Node application that allows users to keep track of scores in real-time using web sockets. The app is designed to be used in a browser and allows multiple users to view and interact with the score-keeping board simultaneously.

## Features

* Single page app (not React, just plain old js, html and css)
    * Once loaded all server interacton is via JSON and web-sockets
* Score tiles: Users can create tiles for scores, and customize their color schemes.
* Real-time tile movement: When a user moves a tile, the change is visible to all other users in real-time.
* Timer: An optional timer can be added to the score-keeper.
* Viewer mode: Users who are not the score-keeper can only view the scores and not change them.
* Messaging: Users can send group messages to all other users.
* As many as 8 or as few as 2 teams/players can be tracked.
* Web based screens equally at home on phone or PC based browser.

A couple screenshots from the same game on 2 different browsers

![Example screenshot](/screenshots/desktop.png "Desktop")
![Example screenshot](/screenshots/phone.png.png "Phone")

## Dependencies

Score Keeper JS has only one production dependency, which is:

* [web-sockets](https://github.com/websockets/ws): A simple and lightweight WebSocket library for Node.js.

Score Keeper JS has only one additional dev dependency, which is:

* [nodemon](https://www.npmjs.com/package/nodemon): A tool that helps development by restarting node application automatically.

## Installation

To install Score Keeper JS, follow these steps:

1. Clone the repository to your local machine.
2. Run `npm install` to install the required dependencies.

## Usage

To use Score Keeper JS, follow these steps:

1. Start the server by running `node server.js` in the terminal.
2. Open a browser and navigate to `http://localhost:3000`.
3. Use the score-keeping board to keep track of scores, move tiles, and add timers.
4. Enjoy real-time synchronization with other users!


## Deployment

This application is deployed on AWS ElasticBeanstalk and can be accessed by going to https://score.davedanner.com/

## Outline/files

* server.js - the server 
* Html, js, image, css files in public folder
    * common.js - common funcionality like menus and such
    * input-screen.js - code for building and pressing the input screens used to set up the score keeper
    * score-screen.js - the score screen with tiles and such
    * clientSocket.js - all of the client web-socket stuff happens here
* backend - under sockets folder
    * socketMain.js - all of the server web-socket stuff happens here

## Contributing

If you would like to contribute to Score Keeper JS, please open an issue or submit a pull request. We welcome contributions of all kinds, including bug fixes, feature requests, documentation improvements, and more.

## License

Score Keeper JS is released under the ISC License. See [LICENSE](https://opensource.org/license/isc-license-txt/) for more information.
