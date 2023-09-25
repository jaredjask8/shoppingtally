import imaplib
import email
from email.header import decode_header
import webbrowser
import os

# account credentials
username = "xdubj88@gmail.com"
password = "uhjl tzll kexr imoa"
# use your email provider's IMAP server, you can look for your provider's IMAP server on Google
# or check this page: https://www.systoolsgroup.com/imap/
# for office 365, it's this:
imap_server = "imap.gmail.com"

imap = imaplib.IMAP4_SSL(imap_server)

imap.login(username,password)
imap.select("Inbox")
_, msgnums = imap.search(None, "ALL")

print(msgnums)

for msgnum in msgnums[0].split():
    _, data = imap.fetch(msgnum, "(RFC822)")

    message = email.message_from_bytes(data[0][1])
    print(f"Message Number: {msgnum}")
    print(f"From: {message.get('From')}")
    print(f"Date: {message.get('Date')}")