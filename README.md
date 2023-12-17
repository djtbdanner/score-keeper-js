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

![Desktop screenshot](/screenshots/desktop.png "Desktop")
![Phone screenshot](/screenshots/phone.png "Phone")

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


## Demo

Here is a link to the project demo [demo](https://www.youtube.com/watch?v=JLjUdUwpNX0) 


# How to

Initially this was deployed to EC2 using elastic beanstalk. Pretty easy, zip up the application into a zip file. Create an environment running node and deploy the zip file.

## Container

Moved to containers to save money (hopefully) and learn a bit about Docker, contianers, CDK and cloudformation. Add docker file, and cdk code to build deploy the uploaded resource. Deploying would be two steps.
* Docker up the app and upload the container to ECR
* Deploy the container using SDK (development kit to get cloud formation process in place)

### Containerize the app and upload to ECR

Will need Node, Docker, AWS SDK, and local AWS SDK creds.

AWS creds - create a user and give that user the rights to do the things and get the creds locally.

*** It seems that the version has to be changed for a new deploy. You can change the version when tagging the container/image

```
# containerize the app (see the Dockerfile for details on what the build does)
# Be sure Docker is running
docker build -t scorekeeper:latest .

# this will test the app runs in the docker container - be sure ports match up
docker run -dp 127.0.0.1:80:80 scorekeeper 

# This gets the right for local to upload the image to ECR, tags the image and uploads it to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 068092817236.dkr.ecr.us-east-1.amazonaws.com
docker tag scorekeeper:latest 068092817236.dkr.ecr.us-east-1.amazonaws.com/scorekeeper:latest 
docker push 068092817236.dkr.ecr.us-east-1.amazonaws.com/scorekeeper:latest

```

For now do the docker container stuff as one step, then deploy the code using the SDK as the next step.

*** It seems that the version has to be changed for a new deploy. You can change the version when tagging the container/image. This is done when creating the docker image and in the cdk_deploy_stack.js code. If this is not done a deploy will not go because it detects no changes.

### Deploy container, elb, dns etc.

From the command line (does not work in Powershell for some reason), navigate to the MyWidgetService folder and run 
```cdk deploy``` other commands ```cdk destroy``` to destroy the stuff built by the deploy command and ```cdk synth``` will
test the code and build a cloudformation yaml for review.

The above step assumes the CDK is working and in the folder MyWidgetService (name subject to change). Some of the stuff that was needed to get the CDK up and running.

* Install the CDK for javascript (this builds cloud formation). Additonal permissions were required for the user, see some of the permissions had to add below to the local client IAM user.

* Bootstrap the CDK (so it knows where stuff will go) '''cdk bootstrap aws://068092817236/us-east-1'''

* See the ***service.js file for all of the stuff that has to be done to get the container running. Note that there is an assumption that the container will already be uploaded to the name and in ECR (Elastic container registry)


Installed CDK - required update of node/npm version and updating the policy of my user. Basic power user (aws policy) and created a policy and added to the user with this access:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "iam:CreateRole",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:DetachRolePolicy",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:DeleteRole",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:PutRolePolicy",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:AttachRolePolicy",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:DeleteRolePolicy",
            "Resource": "*"
        }
    ]
}
```