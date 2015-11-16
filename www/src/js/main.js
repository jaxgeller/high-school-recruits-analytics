import './d3.js';
import './jump.js';

run(2011);
function setData(data) {
  console.log(data)
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

  const margin = {top: 0, right: 30, bottom: 0, left: 50};
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
    .source(function(d) {
      return {"x":d.source.y, "y":d.source.x};
    })
    .target(function(d) {
      return {"x":d.target.y, "y":d.target.x};
    })
    .projection(function(d) {
      return [d.y, d.x];
    });



  d3.json(`data/${year}.json`, function(energy) {
    sankey
    .nodes(energy.nodes)
    .links(energy.links)
    .layout(0);

    let spacer1 = 0;
    var link = svg.append('g').selectAll('.link')
      .data(energy.links)
      .enter().append('path')
      .attr('class', 'link')
      .each(function(d, i) {
        if (i === 0) spacer1 = d.dy;
        else {
          d.target.y = spacer1 + energy.links[i-1].target.y
        }
      })
      .attr('d', function(d) {
        return path(d)
      })
      .attr('stroke', function(d) {
        if (d.picked > d.source.node-60)
          return '#d0a180';
        else
          return '#06904f';
      })
      .style('stroke-width', function(d) {
        if (d.picked < 0) return 0;
        return 2.5;
      })
      .style('display', function(d) {
        if (d.picked < 0) return 'none';
      })
      .on('mouseover', function() {
        setData(this.__data__)
      })

    let spacer = 0;
    let node = svg.append('g').selectAll('.node')
      .data(energy.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .each(function(d, i) {
        if (i === 0) spacer = d.dy;
        else if(d.name.indexOf('Pick') > -1) {
          d.y = spacer + energy.nodes[i-1].y;
        }
      })
      .attr('transform', function(d) {
        var x = d.x;
        var y = d.y;
        if (x > 900)
          x = d.x + margin.right - 10;
        else
          x = d.x - margin.left;

        return `translate(${x},${y})`;
      })




    node.append('rect')
      .attr('height', function(d) { return 1; })
      .attr('width', function(d) {
        if (d.x > 900)
          return 10;
        return 20;
      })
      .style('fill', function(d) { return '#cfd8dc' })
      .style('stroke', function(d) { return '#cfd8dc' })

  });


}
