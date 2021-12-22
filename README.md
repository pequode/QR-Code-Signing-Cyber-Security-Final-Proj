# EC521 Final Cyber Security Project - QR codes and web Security
## Contents:
* **QR Code Gen**
  - A Series of python programs that allow users to generate and read QR codes that are RSA signed. Additionally there are a Series of supporting python scripts for generating QR codes. There are also basic assets that are uses as payloads for our demonstration. Currently the RSA signing feature only works on text based objects due to issues recovering the signature from the QR code in the Arbitrary bytes section.
* **Report**
  - A collection of all the parts of our final report and presentation.
* **Website**
  - The app we built to collect data for our project.

## Motivation:
QR codes are a machine-readable code consisting of an array of black and white squares, typically used for storing URLs or other information for reading by the camera on a smartphone. Since the beginning of the COVID-19 Pandemic, usage of QR codes has increased to eliminate the need for physical human interaction and reduce the risk of infection. Today, QR codes have become ubiquitous in many facets of modern life. However, QR codes are not very safe or secure to use. Phishing attacks can be executed by getting victims to scan QR codes in the same way that an attacker could get a victim to click on a dangerous link. While many people are educated on the importance of not clicking on suspicious links, there seems to be less public awareness of the importance of not scanning suspicious QR codes.
## Website Function
![image of website flow](Report/WebsiteFunction.png)
We used a CI pipeline provided from Heroku to deploy our website with a Node.js backend, a html/js/css front end and we used google firebase as our database. We had several forwarding pages that corresponded to different QR code locations. Before these pages forwarded the user, they ran our data gathering function. This function added the user data to our database through a post request to the web-server.
## Signed QR Code Function
For this we converted our data into a string(because the library we were using didn't support bytes writing very well.) Then we signed this string with a private key. Then the signature is appended to the data and encoded into the QR code. After this there is a second program which scans the QR code data and separates it by data and signature. The signature is verified with a public key and the function outputs a verification status and the data.
## Credits:
  - JohnKircher - Developer
  - jpadgett99 - Developer
  - SamKrasnoff - Developer
  - pequode - Developer
  - googleFirebaseAPI - Library
  - numpy - Library
  - matplotlib - Library
  - qrcode - Library
  - openCV2 - Library
  - RSA -	[signing-stackoverflow](https://stackoverflow.com/questions/4232389/signing-and-verifying-data-using-pycrypto-rsa)

A study on how QR code Cyber Security needs to be improved.
