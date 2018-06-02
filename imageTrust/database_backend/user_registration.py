import httplib
import ssl
import OpenSSL
import MySQLdb
import collections



#######################
#####  Variables  #####
#######################

requiredFields = ["FirstName", "Company", "Password", "KeyLink"]
dataBaseHostName  = "127.0.0.1"#"localhost"
dataBaseUserName  = "test"
dataBasePassword  = "Te$tL0cal"
dataBaseName      = "userInformation"

# variables for debugging
userName = "testUser0"
userFirstName = "Jimmy-John-Jones"
userKeyLink = "www.google.com"
userPassword = "superdupersecret"

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
cert = ssl.get_server_certificate((userKeyLink, 443))
x509 = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, cert)
certInfo = x509.get_subject().get_components()



#########################################
#####  Add information to database  #####
#########################################

#####  Gather information  #####
userInformation = collections.defaultdict(None)

userInformation["UserName"] = userName
userInformation["FirstName"] = userFirstName
userInformation["Password"] = userPassword
for key,val in certInfo:
  if key is 'C':
    userInformation["Country"] = val
  elif key is 'ST':
    userInformation["State"] = val
  elif key is 'L':
    userInformation["City"] = val
  elif key is 'O':
    userInformation["Company"] = val
  elif key is 'CN':
    userInformation["CommonName"] = val

# TODO read in txt file and get key
userInformation["PublicKey"] = "leKey"

###  Check if required fields are filled  ###
for key in userInformation:
  if userInformation[key] is None:
    raise RuntimeError("Requre-" + key)


#####  Add user information to database  #####
# Get database
db = MySQLdb.connect(host=dataBaseHostName,
                     user=dataBaseUserName,
                     passwd=dataBasePassword,
                     db=dataBaseName)

cur = db.cursor()

# Add new table
#if cur.execute("SELECT COUNT(*) FROM " + userName) != 0:
#  raise RuntimeError("userNameExists")



sqlKeys = ""
sqlVals = ""
sqlData = []
for key,val in userInformation.iteritems():
  sqlKeys += key + ", "
  sqlVals += "%s, "
  sqlData.append(val)

sql = "INSERT INTO userInfoTable2 (" + sqlKeys[:-2] + ")"\
        + " VALUES (" + sqlVals[:-2] + ")"
sqlData = tuple(sqlData)

print(sql, sqlData)
print("\n\n\n")
cur.execute(sql, sqlData)
db.commit()
db.close()
