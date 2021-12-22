import qrcode
import rsa
from base64 import b64encode, b64decode
from Crypto.PublicKey import RSA
# this script creates signed QR codes
# creats a key pair and saves it to the path dir
def generateKeysandsave(path="./QRCODEgen/",keysize = 1024):
    (public, private) = rsa.newkeys(keysize)

    public_key = public.export_key()
    file_out = open(path+"pub_key.pem", "wb")
    file_out.write(public_key)
    file_out.close()

    private_key = private.export_key()
    file_out = open(path+"priv_key.pem", "wb")
    file_out.write(private_key)
    file_out.close()
# read keys back
def getKeysFromFile(path="./QRCODEgen/"):
    pubKey = RSA.import_key(open(path+"pub_key.pem").read())
    privKey = RSA.import_key(open(path+"priv_key.pem").read())
    return [pubKey,privKey]
# simple text encoding
def encodeURL(testsLink = "https://theoldpurple.com"):

    [public,private] = getKeysFromFile()
    signature = b64encode(rsa.sign(testsLink, private, "SHA-256"))
    p1 = bytes(testsLink, 'utf-8')
    p2 = bytes("%%%", 'utf-8')
    data =p1+p2+signature
    qr = qrcode.QRCode(
        version=10,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )

    data = str(b64encode(data))[2:-1]

    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save("./QRCODEgen/QROut.png")
# used to encode binary data
# correctly encodes but print statements are left in to help debug reader side which has issues  
def encodeBinary(binaryPath="./QRCODEgen/",binary="im521.ppm"):
    [public,private] = getKeysFromFile()
    file = open(binaryPath+binary, "rb")
    byte = file.read(1)
    bl = []
    b2 = b""
    while byte:
        b2+=byte
        byte = file.read(1)
    file.close()

    data1 = str(b2)
    signature = b64encode(rsa.sign(data1, private, "SHA-1"))
    # print(type(b64decode(signature)),b64decode(signature))
    # print(type(signature),signature)
    # print(type(data1),data1)
    p2 = bytes("%%%", 'utf-8')
    # print(type(data1),type(b64decode(signature)),data1,b64decode(signature))
    # print(type(public),public)
    # print(rsa.verify(data1,b64decode(signature),public))
    data =b2+p2+signature

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    # print(signature)
    # print(len(data))
    hah = str(data)
    # print(hah.find("^"))
    # print(hah.find("~"))
    hah = hah.replace("\\x","~")
    hah = hah.replace("00","^")

    # print(len(hah))
    # print(h)
    qr.add_data(hah)


    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
    img.save("./QRCODEgen/QROut.png")
# generateKeysandsave()
encodeURL()
# encodeBinary()
