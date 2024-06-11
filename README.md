# WargameBattleApplication

* How to set up environment?
- You need to have Git, node.js, npm (when you install node.js it has npm inside) and some IDE like Visual Studio Code installed on your PC.
- Clone repo.
- Switch to correct branch (main or other).
- In terminal run command: npm install. node_modules folder will be crated on local. This will install all node.js dependencies and external packages. node_modules folder in repo is empty, and 'npm install' will install all dependencies and external packages into local project using package.json and package-lock.json files.

* How to start server on local?
- Open terminal in server.js location and execute 'npm start'. It's script determined in package.json file. Another way to run app in VS Code is to go to 'Run and debug' tab and click 'Launch via NPM'. It will have similiar effect. 
- Then enter site like http://localhost:3000
- To stop server, in terminal do 'ctr+C' shortcut.
- Any changes in application will be immadiatelly visible on page from server due to nodemon library.
- Alternative: Click 'Run and debug' in VS Code, and run app. Then enter localhost url. This is possible due to launch.json file, that sets up a script.

* Usefull tools:
- Visual Studio Code and it's extensions: GitHub Copilot, GitLens, ES Lint, HTML CSS Support, HTML Format, JavaScript (ES6) code snippets, Phaser JS (optional).
- Git and node.js (node.js will contain npm - node package manager).

* Important node.js packages used:
- express middleware -> helps to control request-response calls in our app. Checkout server.js file.
- nodemon -> a tool that helps in the development of Node.js applications by monitoring changes in the source code and automatically restarting the server whenever changes are detected.
 
*  Note: when adding Units graphics jpg or png, remember that unit front should face up.
*  Note: if you want to change rotation point of GamePiece, change it's sprite origin by .setOrigin()
