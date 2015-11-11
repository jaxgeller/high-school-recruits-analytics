import re
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
        'img': '',
        'meta_link': '',
        'stats': {
          'pts': '',
          'reb': '',
          'ast': ''
        },
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

# GET YAHOO META LINKS
for letter in list(string.ascii_uppercase):
  r = requests.get('https://sports.yahoo.com/nba/players?type=lastname&query=%s' % letter)
  soup = BeautifulSoup(r.text, 'html.parser')
  table = soup.find('td', {'class': 'yspdetailttl'}).parent.parent
  for link in table.findAll('a'):
    if re.match('\/nba\/players\/[0-9]{4}', link.get('href')):
      playerid = normalize(link.text)
      if playerid in PLAYERS:
        PLAYERS[playerid]['meta_link'] = 'https://sports.yahoo.com' + link.get('href')

# GET META DATA
for playerid in PLAYERS:
  if PLAYERS[playerid]['meta_link']:
    r = requests.get(PLAYERS[playerid]['meta_link'], headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.49 Safari/537.36"})
    soup = BeautifulSoup(r.text, 'html.parser')

    pic = soup.select('.player-image img')

    if pic:
      PLAYERS[playerid]['img'] = pic[0].get('style').strip("background-image:url('").strip("');")

    stats = soup.find('div', {'class': 'stat-info'})
    if stats:
      stats = stats.findAll('dd')
      PLAYERS[playerid]['stats']['pts'] = float(stats[0].text)
      PLAYERS[playerid]['stats']['reb'] = float(stats[1].text)
      PLAYERS[playerid]['stats']['ast'] = float(stats[2].text)
print('Fetched meta data successfully.')

rankings_data = open("data/raw.json", "w")
rankings_data.write(json.dumps(PLAYERS))

print('finished in %s' % (time.time() - START_TIME))
