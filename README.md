
# XR Embedded Packet Tracer - Condition Generator

The steps to install and run the application on a local machine are as follows:

1. The local machine where the source code would be cloned onto from this Git repository should have Node.js installed along with npm.
2. If the system doesn't have Node.js installed, these steps can be followed to install the same in macOS/Windows.
   -  Go to the Node.js Downloads page (https://nodejs.org/en/download/)
   -  Download Node.js for macOS/Windows.
   -  Run the downloaded Node.js installer.
   -  Run the installer, including accepting the license, selecting the destination, and authenticating for the install.
   -  You're finished! To ensure Node.js and npm has been installed, run `node -v` and `npm -v` in your terminal - you should get something like v12.14.1 and 6.13.4

   The steps to be followed to install it in Linux is as follows:
   -  The recommended way to install is using NVM ( Node Version Manager ). To install nvm use the latest install script from https://github.com/nvm-sh/nvm  
   -  Restart terminal once before using NVM. Now, we can install Node.js and npm.
   -  To install Node.js run `nvm install node`.
   -  You're finished! To ensure Node.js and npm has been installed, run `node -v` and `npm -v` in your terminal - you should get something like v12.14.1 and 6.13.4

3. Now, navigate to the project directory and run the application on port 3000 by executing the following commands:
   -  `npm install` ( By default, it will install all modules listed as dependencies in package.json in the local node_modules folder )
   -  `npm start` ( Runs the app in the development mode. Open http://localhost:3000 to view it in the browser)

