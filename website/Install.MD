# Install
* **Dependencies**
    - Node.js
    - NPM
    - A Firebase project through google Firebase.

  **Python** :
    - xlwt
    - matplotlib
    - numpy

## How To:
This project should be fairly easy to deploy. The only tricky part is the missing credentials. To protect the access keys given to us by google firebase we added our saved data files and authentication to separate files that were then included in our `.gitignore`. However all of our dependant Libraries should be easy to install with the command `npm install` while in the `website/` directory. The
python packages can all be installed with `pip install {packagename}` for each of the required packages.

Before running the user should create a file called `FBConf.json` with the firebase credentials in the following format:
```
{
  "apiKey": "your random string ",
  "authDomain": "your project nae ",
  "projectId": "Your ID ",
  "storageBucket": "All of this is given as a copy ",
  "messagingSenderId": "paste when a new firebase ",
  "appId": "app is created ",
  "measurementId": "last id"
}
```
After this file exist the user should run the web-server for the first time, this command works: `node app.js`. Then once it is running in a web-browser the users should enter the url `localhost:3000/getJson` and then `localhost:3000/getJsonSurvey`. This should replace the missing files.

Now the website should be able to be hosted locally or on a server.
