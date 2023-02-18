import requests
import json
import os
from bs4 import BeautifulSoup

URL = "https://www.zooplus.com/search/results?q=birds"
page = requests.get(URL)

soup = BeautifulSoup(page.content, "html.parser")

#product names
names = soup.findAll(class_="ProductListItem-module_productInfoTitleLink__NAbwA")

#images
imgs = soup.findAll(class_="ProductListItem-module_productImage__xWs2t")

#product descriptions
descs = soup.findAll(class_="ProductListItem-module_productInfoDescription__dJ9OV")

#prices
prices = soup.findAll(class_="ProductListItemVariantPriceBlock-module_priceEmphasized__9UVCW")

dictlist = list()

for i in range(0,names.__len__()):
    
    dictionary = {
        "id": i+36,
        "name": names[i].text,
        "img": imgs[i]['src'],
        "animal": 'bird',
        "price": prices[i].text[3:],
        "description": descs[i].text 
    }
    dictlist.append(dictionary)

json_obj = json.dumps(dictlist, indent=5)

with open('./Uni/TECHWEB/Progetto-TecWeb/public/data/productsCat.json', 'w') as outfile:
   outfile.write(json_obj)
