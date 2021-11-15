import cv2
import rsa
from base64 import b64encode, b64decode
from Crypto.PublicKey import RSA
# read the QRCODE image
img = cv2.imread("/home/whorehay/Desktop/github/Cyber_Security_Project-/QRCODEgen/QROut.png")
detector = cv2.QRCodeDetector()
data, bbox, straight_qrcode = detector.detectAndDecode(img)


url = data[:data.find("%%%")]
sig = data[data.find("%%%")+3:]
sig = sig.encode('utf-8')
print(url,sig,"\n",data)

# 
pubKey = RSA.import_key(open("/home/whorehay/Desktop/github/Cyber_Security_Project-/QRCODEgen/pub_key.pem").read())
verify = rsa.verify(url, b64decode(sig), pubKey)
print("Verify: %s" % verify)
