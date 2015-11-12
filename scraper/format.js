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

// add nodes and links
for (var i in data) {
  if (data[i].hs.year === YEAR) {
    let rank = data[i].hs.rank + 60;

    if (nodes[rank]) {
      nodes[rank].name += data[i].name;
      let target = data[i].nba.draft;
      if (target === -1) target = 60;

      let holder = {
        source: rank,
        target: target,
        value: 1,
        picked: data[i].nba.draft,
        origin: data[i].hs.destination,
        destination: data[i].nba.destination,
        pos: data[i].pos
      }

      if (data[i].img)
        holder.img = data[i].img
      if (data[i].stats)
        holder.stats = data[i].stats

      links.push(holder)
    }
  }
}

fs.writeFileSync(`data/${YEAR}.json`, JSON.stringify({nodes: nodes, links: links}, null, 4));
console.log(`Formatted ${YEAR}`);
