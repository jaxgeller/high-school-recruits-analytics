import './sankey';
import Meta from './meta';
let meta = new Meta;

let tip = document.querySelector('.tool-tip')

export default class Chart {
  constructor() {
    this.spacing = 13.2;
    this.scale   = {width: 1000, height: 2000}
    this.margin  = {top: 10, right: 30, bottom: 10, left: 50};
    this.width   = this.scale.width - this.margin.left - this.margin.right;
    this.height  = this.scale.height - this.margin.top - this.margin.bottom;
  }

  _setSvg() {
    return d3.select('#chart-wrapper')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('viewBox', `0 0 ${this.scale.width} ${this.scale.height}`)
      .attr('preserveAspectRatio', 'xMidYMid')
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }

  _setSankey() {
    return d3.sankey()
      .nodeWidth(0)
      .nodePadding(0)
      .size([this.width, this.height]);
  }

  _setPath() {
    return d3.svg.diagonal()
      .source(d => ({x: d.source.y, y: d.source.x}))
      .target(d => ({x:d.target.y, y:d.target.x}))
      .projection(d => [d.y, d.x]);
  }

  _setThreshold() {
    return d3.scale.linear()
      .clamp(true)
      .domain([-150, -100, -50, 0, 10, 20, 30, 150].reverse())
      .range(['#2196f3','#03a9f4','#00acc1', '#00838f', '#3f51b5', '#9c27b0', '#e91e63', '#f44336']);
  }

  draw(year=2005) {
    let svg = this._setSvg();
    let sankey = this._setSankey();
    let path = this._setPath();
    let threshold = this._setThreshold();

    d3.json(`data/${year}.json`, rankings => {
      sankey.nodes(rankings.nodes).links(rankings.links).layout(0);

      let link = svg.append('g').selectAll('.link')
        .data(rankings.links).enter().append('path')
        .attr('class', 'link')
        .each((d, i) => {
          if (i !== 0) {
            if (d.target.y !== rankings.links[i-1].target.y) {
              d.target.y = this.spacing + rankings.links[i-1].target.y
            }
          }
        })
        .attr('d', d => path(d))
        .attr('stroke', d => threshold(d.picked - (d.source.node-60)))
        .style('stroke-width', d => {
          if (d.picked < 0) return 0;
          return 2;
        })
        .style('display', d => {
          if (d.picked < 0) return 'none';
        })
        .on('mouseleave', function() {
          Array.prototype.slice.call(document.querySelectorAll('.link')).forEach(item=> {
            item.style.strokeOpacity = '.85';
          })
        })
        .on('mouseover', function() {
          Array.prototype.slice.call(document.querySelectorAll('.link')).forEach(item=> {
            item.style.strokeOpacity = '0.15'
          });

          this.style.strokeOpacity = '.85';
          meta.set(this.__data__);

          let t = document.getElementById(`pick-${this.__data__.picked}`)
            .getBoundingClientRect().top
            + window.scrollY - 12;
          tip.style.top = `${t}px`;
          tip.style.left = 'initial';
          tip.style.right = '250px';
          tip.style.opacity = '1';
          tip.textContent = this.__data__.picked;
        })
        .attr('stroke-dasharray', function() {
          return this.getTotalLength() + ' ' + this.getTotalLength();
        })
        .attr('stroke-dashoffset', function() {
          return this.getTotalLength();
        })
        .transition().ease('out')
        .duration(function(d, i) {
          return Math.abs(d.picked - (d.source.node-60)) + 50
        })
        .attr('stroke-dashoffset', 0);

      let node = svg.append('g').selectAll('.node')
        .data(rankings.nodes).enter().append('g')
        .attr('class', 'node')
        .style('display', d => {
          if (d.name === 'UNDRAFTED') return 'none';
          if (d.name === '') return 'none';
        })
        .each((d, i) => {
          if (i !== 0) {
            if(d.name.indexOf('Pick') > -1) {
              d.y = this.spacing + rankings.nodes[i-1].y;
            }
          }
        })
        .attr('transform', d => {
          let x = d.x;
          let y = d.y;
          if (x > 900)
            x = d.x + this.margin.right - 10;
          else
            x = d.x - this.margin.left;
          return `translate(${x},${y})`;
        })
        .on('mouseover', function(e) {

          if (this.__data__.sourceLinks[0]) {
            meta.set(this.__data__.sourceLinks[0]);
          }

          // left ticks
          if (this.__data__.node > 60) {
            tip.style.top = `${d3.event.pageY-12.5}px`;
            tip.style.left = '35px';
            tip.style.right = 'initial';
            tip.style.opacity = '1';
            tip.textContent = this.__data__.node - 60;
          }

          // right ticks
          else if (this.__data__.node < 60) {
            tip.style.top = `${d3.event.pageY - 13}px`;
            tip.style.left = 'initial';
            tip.style.right = '250px';
            tip.style.opacity = '1';
            tip.textContent = this.__data__.node + 1;

            if (this.__data__.targetLinks[0].picked > 0) {
              meta.set(this.__data__.targetLinks[0]);
            }
          }
        })
        .append('rect')
        .attr('id', d => {
          if (d.node < 60)
            return `pick-${d.node + 1}`;
        })
        .attr('height', d => 1)
        .attr('width', d => {
          if (d.x > 900) return 10;
          return 20;
        })
    });
  }
}
