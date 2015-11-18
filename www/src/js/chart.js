class Chart {
  constructor() {
    this.spacing = 13.2;
    this.margin = {top: 10, right: 30, bottom: 10, left: 50};
    this.width = 1000 - margin.left - margin.right;
    this.height = 2000 - margin.top - margin.bottom;
  }

  svg() {
    return d3.select('#chart-wrapper')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }

  sankey() {
    return d3.sankey()
      .nodeWidth(0)
      .nodePadding(0)
      .size([this.width, this.height]);
  }

  path() {
    return d3.svg.diagonal()
      .source(d => ({x: d.source.y, y: d.source.x}))
      .target(d => ({x:d.target.y, y:d.target.x}))
      .projection(d => [d.y, d.x]);
  }

  render(year) {
    d3.json(`data/${year}.json`, function(rankings) {
    }
  }
}
