The backend

The best way to do this is using a virtual environment, so all the packages don't get installed globally.

cd backend-py
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
./start-server.sh

Change #1: CORS server address

CORS (Cross-Origin Resource Sharing) is a security measure implemented by browsers which stops your API being accessed by anyone but frontend domains you approve of. Right now, that's set to http://localhost:1234 which is the address of the frontend server when it's running locally on your machine, so that your browser can send messages to the backend.
Change #2: API URL requested from the frontend
In the frontend/main.js file, update the serverUrl variable once you know where your server is located (you can get rid of the :3000 now, your production server should use its own port).
