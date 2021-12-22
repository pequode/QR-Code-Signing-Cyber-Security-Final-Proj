import cv2
import math
import os
import qrcode
# used to create flyers
Url = "https://salty-peak-17003.herokuapp.com/"
dirs =os.listdir("../../website")
htmlPaths = [];
# makes a qr code for each html file in website folder with a perticular name
for files in dirs:
    if ("_" in files and ".html" in files):
        print(files)
        link = Url + files
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        print(link)
        qr.add_data(link)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        saveName = "../../QRCODEgen/QR_"+files[:-4]+"png"
        print(saveName)
        img.save(saveName)
