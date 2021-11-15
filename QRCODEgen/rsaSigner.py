import rsa
from base64 import b64encode, b64decode

msg1 = "Hello Tony, I am Jarvis!"
msg2 = "Hello Toni, I am Jarvis!"
keysize = 2048
(public, private) = rsa.newkeys(keysize)
encrypted = b64encode(rsa.encrypt(msg1, public))
decrypted = rsa.decrypt(b64decode(encrypted), private)
signature = b64encode(rsa.sign(msg1, private, "SHA-512"))
verify = rsa.verify(msg1, b64decode(signature), public)

print(private.exportKey('PEM'))
print(public.exportKey('PEM'))
print("Encrypted: " + str(encrypted))
print("Decrypted: '%s'" % decrypted)
print("Signature: " + str(signature))
print("Verify: %s" % verify)
verify = rsa.verify(msg2, b64decode(signature), public)
print("Encrypted: " + str(encrypted))
print("Decrypted: '%s'" % decrypted)
print("Signature: " + str(signature))
print("Verify: %s" % verify)
print(type(public),type(signature))
