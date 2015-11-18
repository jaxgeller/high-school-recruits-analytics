import './sankey.js';
import './jump.js';
import './meta.js';

run(2010);

function setData(data) {
  document.querySelector('.meta-headshot').style.backgroundImage = `url("${data.img}")`;
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


function tooltip(rank) {

}

function run(year) {
  const spacing = 13.2;
  const scale = {width: 1000, height: 2000}
  const margin = {top: 10, right: 30, bottom: 10, left: 50};
  const width = scale.width - margin.left - margin.right;
  const height = scale.height - margin.top - margin.bottom;

  let svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('viewBox', `0 0 ${scale.width} ${scale.height}`)
    .attr('preserveAspectRatio', 'xMidYMid')
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



  let threshold = d3.scale.linear()
    .domain([-150, -100, 0, 100, 150])
    .range(["green","green","beige", "red", "red"]);

  d3.json(`data/${year}.json`, function(rankings) {
    sankey
      .nodes(rankings.nodes)
      .links(rankings.links)
      .layout(0);

    let link = svg.append('g').selectAll('.link')
      .data(rankings.links).enter().append('path')
      .attr('class', 'link')
      .each((d, i) => {
        if (i !== 0) {
          if (d.target.y !== rankings.links[i-1].target.y) {
            d.target.y = spacing + rankings.links[i-1].target.y
          }
        }
      })
      .attr('d', d => path(d))
      .attr('stroke', d => threshold(d.picked - (d.source.node-60)))
      .style('stroke-width', d => {
        if (d.picked < 0) return 0;
        return 2.5;
      })
      .style('display', d => {
        if (d.picked < 0) return 'none';
      })
      .on('mouseleave', function() {
        [].slice.call(document.querySelectorAll('.link')).forEach(item=> {
          item.style.strokeOpacity = '1'
        })
      })
      .on('mouseover', function() {
        [].slice.call(document.querySelectorAll('.link')).forEach(item=> {
          item.style.strokeOpacity = '0.15'
        })
        this.style.strokeOpacity = '1'
        setData(this.__data__)
      });

    let totalLength  = link.node().getTotalLength();

    link
      .attr('stroke-dasharray', function() {
        return this.getTotalLength() + ' ' + this.getTotalLength();
      })
      .attr('stroke-dashoffset', function() {
        return this.getTotalLength();
      })
      .transition()
        .ease('out')
        .duration(function(d, i) {
          console.log()
          return Math.abs(d.picked - (d.source.node-60)) + 50
        })
        .attr('stroke-dashoffset', 0);

    let node = svg.append('g').selectAll('.node')
      .data(rankings.nodes).enter().append('g')
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
      .on('mouseover', function() {
        if (this.__data__.sourceLinks[0]) {
          setData(this.__data__.sourceLinks[0]);
          tooltip(this.__data__.node - 60)
        }
      })

    node.append('rect')
      .attr('height', d => 1)
      .attr('width', d => {
        if (d.x > 900) return 10;
        return 20;
      })
  });
}

// window.addEventListener('resize', function() {
//   let aspect = scale.width/scale.height;
//   let svg = document.querySelector('#chart svg')
//   let target = document.getElementById('chart').getBoundingClientRect().width
//   svg.setAttribute('width', target);
//   svg.setAttribute('height', target / aspect);
// });

