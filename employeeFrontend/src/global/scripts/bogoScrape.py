from bs4 import BeautifulSoup
from urllib.request import urlopen
with urlopen('https://www.publix.com/savings/weekly-ad/bogo?utm_source=google&utm_medium=cpc&utm_campaign=PXC3_D72_T017_23926&utm_content=&utm_term=publix%20bogo&gclid=CjwKCAjw6p-oBhAYEiwAgg2Pgo9mDzpelWe6E3Mpowzm8u7m3POf0ULaTfdo8-DdoYXfah__O7LM2BoCTAUQAvD_BwE&gclsrc=aw.ds') as response:
    soup = BeautifulSoup(response, 'html.parser')
    for anchor in soup.find_all('section'):
        print(anchor.get('class'))