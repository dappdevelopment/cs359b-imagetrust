import httplib
import ssl
import OpenSSL
import MySQLdb



#######################
#####  Variables  #####
#######################

requiredFields = ["FirstName", "Company", "Password", "KeyLink"]
dataBaseHostName  = "localhost"
dataBaseUserName  = "imageTrust"
dataBasePassword  = "superSecret"
dataBaseName      = "userInformation"

userName = "testUser"

###############################################
#####  Get user information from website  #####
###############################################

###  Check if website is up  ###

conn = httplib.HTTPConnection(userKeyLink)
conn.request("HEAD",'') #,"/")
response = conn.getresponse()
if response.status != 200:
  raise RuntimeError("userKeyLinkDown")

###  Get certificate  ###
cert = ssl.get_server_certificate(('www.google.com', 443))
x509 = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, cert)
certInfo = x509.get_subject().get_components()



