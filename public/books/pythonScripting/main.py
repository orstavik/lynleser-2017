import urllib.request
import re

def loadBook(code):
    url = 'https://www.gutenberg.org/files/'+str(code)+'/'+str(code)+'-0.txt'
    with urllib.request.urlopen(url) as response:
        data = response.read()
        filename = str(code)+'.txt'
        file = open(filename, 'wb')
        file.write(data)
        file = open(filename, 'r', encoding='utf-8-sig')
        text = file.read()
        print(text)
        file.close()

loadBook(98)
# loadBook(1342)
# loadBook(2600)