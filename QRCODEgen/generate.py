import qrcode
import rsa
from base64 import b64encode, b64decode

testsLink = "https://theoldpurple.com"
keysize = 1024
(public, private) = rsa.newkeys(keysize)



private_key = public.export_key()
file_out = open("/home/whorehay/Desktop/github/Cyber_Security_Project-/QRCODEgen/pub_key.pem", "wb")
file_out.write(private_key)
file_out.close()

signature = b64encode(rsa.sign(testsLink, private, "SHA-256"))
data =testsLink+"%%%"+str(signature)[2:-1]

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
print(data)
qr.add_data(data)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("/home/whorehay/Desktop/github/Cyber_Security_Project-/QRCODEgen/QROut.png")
