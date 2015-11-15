'use strict';

const fs = require('fs');
const YEAR = parseInt(process.argv[2]);
const data = JSON.parse(fs.readFileSync('data/raw.json'));
let nodes = [];
let links = [];

// populate nodes of draft rankings
for (var i =0; i < 61; i++) {
  let name = `Pick #${i+1}`;
  if (i === 60) name = 'UNDRAFTED'
  nodes.push({node: i, name: name});
}

// populate nodes of players
for (var i =61; i < 211; i++) {
  nodes.push({node: i, name: ''});
}

// link with actual data
for (var i in data) {
  if (data[i].hs.year === YEAR) {
    let rank = data[i].hs.rank + 60;
    if (nodes[rank]) {
      nodes[rank].name += data[i].name;
      let target = data[i].nba.draft;

      let holder = { source: rank, target: target-1, value: 1, picked: data[i].nba.draft,rank: data[i].hs.rank,origin: data[i].hs.destination, destination: data[i].nba.destination, pos: data[i].pos}

      if (data[i].img) holder.img = data[i].img
      if (data[i].stats) holder.stats = data[i].stats

      if (target > 0) {
        links.push(holder)
      }
    }
  }
}

for (var i =0; i < 61; i++) {
  links.push({
    source: i + 61,
    target: i,
    value: 1,
    picked: -1,
    origin: '',
    destination: '',
    pos: ''
  });
}

links = links.sort((a, b) => {
  return a.target - b.target;
});

fs.writeFileSync(`data/${YEAR}.json`, JSON.stringify({nodes: nodes, links: links}, null, 4));
console.log(`Formatted ${YEAR}`);
