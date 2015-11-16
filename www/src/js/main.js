import './sankey.js';
import './jump.js';

run(2010);
function setData(data) {
  document.querySelector('.meta-head-shot').src = data.img;
  document.querySelector('.meta-player-name').innerHTML = data.source.name.replace(' ', '<br/>');

  document.getElementById('ppg').textContent = data.stats.pts || 'N/A';
  document.getElementById('rpg').textContent = data.stats.reb || 'N/A';
  document.getElementById('apg').textContent = data.stats.ast || 'N/A';

  document.getElementById('rank').textContent = data.source.node - 60;
  document.getElementById('drafted').textContent = data.picked;

  document.getElementById('origin').textContent = data.origin;
  document.getElementById('destination').textContent = data.destination;
  document.getElementById('pos').textContent = data.pos;
}
[].slice.call(document.querySelectorAll('button')).forEach(button=> {
  button.addEventListener('click', function() {
    document.getElementById('chart').innerHTML = ''
    run(this.textContent)
  });
});


function run(year) {
  const spacing = 13.2;
  const margin = {top: 10, right: 30, bottom: 10, left: 50};
  const width = 1060 - margin.left - margin.right;
  const height = 2000 - margin.top - margin.bottom;

  let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  let sankey = d3.sankey()
    .nodeWidth(0)
    .nodePadding(0)
    .size([width, height]);

  let path = d3.svg.diagonal()
    .source(d => ({x: d.source.y, y: d.source.x}))
    .target(d => ({x:d.target.y, y:d.target.x}))
    .projection(d => [d.y, d.x]);

  d3.json(`data/${year}.json`, function(rankings) {
    sankey
      .nodes(rankings.nodes)
      .links(rankings.links)
      .layout(0);

    let link = svg.append('g').selectAll('.link')
      .data(rankings.links)
      .enter().append('path')
      .attr('class', 'link')
      .each((d, i) => {
        if (i !== 0) {
          if (d.target.y !== rankings.links[i-1].target.y) {
            d.target.y = spacing + rankings.links[i-1].target.y
          }
        }
      })
      .attr('d', d => path(d))
      .attr('stroke', d => {
        if (d.picked > d.source.node-60)
          return '#d0a180';
        else
          return '#06904f';
      })
      .style('stroke-width', d => {
        if (d.picked < 0) return 0;
        return 2.5;
      })
      .style('display', d => {
        if (d.picked < 0) return 'none';
      })
      .on('mouseover', function() {
        setData(this.__data__)
      })

    let node = svg.append('g').selectAll('.node')
      .data(rankings.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .each((d, i) => {
        if (i !== 0) {
          if(d.name.indexOf('Pick') > -1) {
            d.y = spacing + rankings.nodes[i-1].y;
          }
        }
      })
      .attr('transform', d => {
        let x = d.x;
        let y = d.y;
        if (x > 900)
          x = d.x + margin.right - 10;
        else
          x = d.x - margin.left;
        return `translate(${x},${y})`;
      })

    node.append('rect')
      .style('fill', d => '#cfd8dc')
      .style('stroke', d => '#cfd8dc')
      .attr('height', d => 1)
      .attr('width', d => {
        if (d.x > 900)
          return 10;
        return 20;
      })
  });


}
