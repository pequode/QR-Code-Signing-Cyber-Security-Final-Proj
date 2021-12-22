import cv2
import rsa
from base64 import b64encode, b64decode
from Crypto.PublicKey import RSA
# read the QRCODE image
from pyzbar.pyzbar import decode
from pyzbar.pyzbar import ZBarSymbol
# used for text signed in QR codes
def scanandverifiy(path="./QRCODEgen/"):
    pubKey = RSA.import_key(open(path+"pub_key.pem").read())
    url = ""
    verify = ""
    img = cv2.imread(path+"QROut.png")
    data = decode(img)[0].data

    getback = b64decode(data)
    data = str(getback)[2:-1]

    url = data[:data.find("%%%")]
    sig = getback[data.find("%%%")+3:]

    dec = b64decode(sig)
    print(type(pubKey),pubKey)
    verify = rsa.verify(url, dec, pubKey)
    return url,verify
# reads in byte data and trys to assemble it as a ppm
#ppm correctly assembles but verification fails
def scanandverifiyPicture(path="./QRCODEgen/"):
    pubKey = RSA.import_key(open(path+"pub_key.pem").read())
    url = ""
    verify = ""
    img = cv2.imread(path+"QROut.png")
    data = decode(img)[0].data
    # a lot of nonsense from the fact that a string printing , a raw string and a byte are different
    stringData = str(data)[4:-2]
    stringData =stringData.replace("~","\\x")
    stringData=stringData.replace("^","00")
    sig = stringData[stringData.find("%%%")+3:]
    data = stringData[:stringData.find("%%")]

    data = data.replace("\\\\n","\n")
    data = data.replace("\\\\\\n","\n")
    bits = bytes(data, encoding = "utf-8")
    isNum = 0
    listOfChar ="0x"
    listOfBytes = []
    for b in bits:
        if chr(b)=="\\":
            isNum = 1
        elif(chr(b)=="n" and isNum==1):
            isNum = 0
            write = b"\n"
            listOfBytes.append(write)
        elif(chr(b)=="x"and isNum==1):
            isNum = 2
        elif(isNum == 2):
            isNum = 3
            listOfChar +=chr(b)
        elif(isNum == 3):
            isNum = 0
            listOfChar +=chr(b)
            an_integer = int(listOfChar, 16)
            byte = an_integer.to_bytes(1, 'big')
            listOfBytes.append(byte)
            listOfChar = "0x"
        else:
            listOfBytes.append(b.to_bytes(1, 'big'))


    charlist = [char for char in data]
    newbytearray = []
    storedchar = False
    # data is correctly written
    outByteFile = open(path+"imageOut.ppm","wb")
    bytesInfo = bytes("%%%", 'utf-8')
    for i in listOfBytes:
        bytesInfo = bytesInfo + i
        outByteFile.write(i)
    outByteFile.close()
    bytesInfo = bytesInfo[3:]

    data1 = str(bytesInfo)
    # #the verify step underneath fails
    # sig = bytes(sig, encoding = "utf-8")
    print(type(sig),sig)
    print(type(data1),data1)
    dec = b64decode(sig)
    # print(type(dec),dec)
    signature = sig
    print(type(data1),type(b64decode(signature)),data1,b64decode(signature))
    print(type(pubKey),pubKey)
    verify = rsa.verify(data1, b64decode(signature), pubKey)
    print(verify)
    return data1,verify
# saved to help remember other method of decoding
# img = cv2.imread("./Cyber_Security_Project-/QRCODEgen/QROut.png")
# data = decode(img)[0]
# data =  b64decode(data.data)
# strver = str(data)
# url = str(data[:strver.find("%%%")-2])
# sig = str(data[strver.find("%%%")+1:])
# sig = sig[2:-1]
# # print(url,"\n",sig[2:-1])
# sig = sig.encode('utf-8')
# # decode = b64decode(sig)
# # print("\n",decode)
# print(sig)
# print(url[2:-1])
# pubKey = RSA.import_key(open("./Cyber_Security_Project-/QRCODEgen/pub_key.pem").read())
# verify = rsa.verify(url[2:-1], b64decode(sig), pubKey)
# print("Verify: %s" % verify)

[data,status]=scanandverifiy()
# [data, status] = scanandverifiyPicture()
print(data,status)

# [data,status] = scanandverifiy()
# print(data,status)
