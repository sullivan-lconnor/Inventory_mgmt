## Install reqs
npm ci

## Running the Application ##

 -- NOTE: development not working due to missing setup for linking sqllite3 port between vite and 
          express js
For development, you'll run the Express server and the Vite server separately:

## Start the Express server: ##

node server.js
In a new terminal, start the Vite development server:

cd client
npm run dev
For production, build the Vue app and start only the Express server:

## Build the Vue app: ##

cd client
npm run build
Start the Express server:

cd ..
node server.js
This setup allows you to develop your Vue frontend and Express backend in tandem, with Vite providing a fast development environment for your Vue components.
