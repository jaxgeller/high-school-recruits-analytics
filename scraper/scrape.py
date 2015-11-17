import re
import sys
import json
import time
import string
import requests
import unicodedata
from bs4 import BeautifulSoup
START_TIME = time.time()
START   = 2005
END     = 2014
PAGES   = 3
HEADERS = {'User-Agent': 'request', 'X-Requested-With': 'XMLHttpRequest'}
PLAYERS = {}

def rankings_url(year, page):
  host = 'http://247sports.com'
  path = '/Season/%s-Basketball/CompositeRecruitRankings' % year
  params = '?View=Detailed&Page=%s&InstitutionGroup=HighSchool' % page
  return host + path + params

def normalize(name):
  sanitized = re.sub("[\s+]|\.|\?|\!|\-|\'|,",'', name.lower())
  return unicodedata.normalize('NFKD', sanitized).encode('ascii', 'ignore').decode('utf-8')

def compile_data(item):
  name = item.find('a', {'class':'bold'}).text
  rank = item.find('span', {'class':'primary'}).text
  origin = item.find('span', {'class': 'meta'}).text.strip()
  destination = item.findAll('img', {'class': ['left', 'jsonly']})
  if len(destination) == 3:
    destination = destination[2].get('alt')
  else:
    destination = 'none'
  return {'name': name, 'rank': rank, 'origin': origin, 'destination': destination}

# GET HS DATA
for year in range(START, END):
  page = 1
  while page <= PAGES:
    print('Getting %s page %s' % (year, page))
    r = requests.get(rankings_url(year, page), headers=HEADERS)
    soup = BeautifulSoup(r.text, 'html.parser')
    trs = soup.findAll('tr')
    for i in range(0, len(trs) - 1 ):
      data = compile_data(trs[i])
      PLAYERS[normalize(data['name'])] = {
        'name': data['name'],
        'pos': '',
        'img': '',
        'stats': { 'pts': '', 'reb': '', 'ast': '' },
        'hs': {
          'year': year,
          'rank': int(data['rank']),
          'origin': data['origin'],
          'destination': data['destination']
        },
        'nba': {
          'year': -1,
          'draft': -1,
          'destination': 'none'
        }
      }
    page += 1
print('Fetched ranking data successfully')

# GET DRAFT DATA
for year in range(START, END+1):
  r = requests.get('https://en.wikipedia.org/wiki/%s_NBA_draft' % year)
  soup = BeautifulSoup(r.text, 'html.parser')
  trs = soup.findAll('th', text='Pick')
  trs = trs[0].parent.parent.findAll('tr')
  for tr in trs:
    td = tr.findAll('td')
    if len(td):
      draft = td[1].text
      name = td[2].find('a').text
      destination = td[5].find('a').text
      playerid = normalize(name)
      if playerid in PLAYERS:
        PLAYERS[playerid]['nba']['destination'] = destination
        PLAYERS[playerid]['nba']['draft'] = int(draft)
        PLAYERS[playerid]['nba']['year'] = year
print('Fetched draft data successfully.')


# GET META DATA
for playerid in PLAYERS:
  name = PLAYERS[playerid]['name'].replace(' ', '+')
  r = requests.get('https://www.google.com/search?q=espn+nba+' + name)
  soup = BeautifulSoup(r.text, 'html.parser')
  for a in soup.select('.r a'):
    if re.search('://espn.go.com/nba/player/_/id', a.get('href')):
      print('.')
      link = a.get('href').split('/url?q=')[1]
      try:
        r = requests.get(link)
        soup = BeautifulSoup(r.text, 'html.parser')
        tds = soup.select('.career td') or soup.select('.header-stats tr td')
        if tds:
          PLAYERS[playerid]['stats']['pts'] = float(tds[0].text)
          PLAYERS[playerid]['stats']['ast'] = float(tds[1].text)
          PLAYERS[playerid]['stats']['reb'] = float(tds[2].text)

        img = soup.select('.main-headshot img')
        if len(img):
          PLAYERS[playerid]['img'] = img[0].get('src')

        pos = soup.select('.general-info .first')
        if len(pos):
          PLAYERS[playerid]['pos'] = pos[0].text
        break
      except:
        break

# GET MISSING IMAGES
for playerid in PLAYERS:
  if PLAYERS[playerid]['img'] == '':
    name = PLAYERS[playerid]['name'].replace(' ', '+')
    r = requests.get('https://www.google.com/search?q=yahoo+nba+' + name)
    soup = BeautifulSoup(r.text, 'html.parser')
    for a in soup.select('.r a'):
      if re.search('://sports.yahoo.com/nba/players/', a.get('href')):
        print('.')
        link = a.get('href').split('/url?q=')[1].split('&sa')[0]
        r = requests.get(link)
        soup = BeautifulSoup(r.text, 'html.parser')
        img = soup.select('.player-image img')
        if len(img):
          PLAYERS[playerid]['img'] = img[0].get('src')



print('Fetched meta data successfully.')
print('finished in %s' % (time.time() - START_TIME))
rankings_data = open("data/raw.json", "w")
rankings_data.write(json.dumps(PLAYERS))
