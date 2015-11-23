# How Do High School Basketball Recruits Pan Out?

<img src="https://github.com/jaxgeller/high-school-recruits-analytics/blob/master/demo.png" alt="HS Recruits demo">

This is an interactive data visualization of the trajectory of high school recruits and their nba draft position. Check out the demo [here]().

In this repo you will find the [raw JSON data](https://github.com/jaxgeller/high-school-recruits-analytics/tree/master/data) for the visualization, the [scraper](https://github.com/jaxgeller/high-school-recruits-analytics/tree/master/scraper) used to gather this data, as well as the [frontend](https://github.com/jaxgeller/high-school-recruits-analytics/tree/master/www) for the chart.

### Dependencies
+ Make
+ Npm
+ Node.js v4+
+ Gulp
+ Python3
+ Pip3/Requests
+ Pip3/BeautifulSoup4

### Running the visualization

Run the following to compile and run the visualization, access it on `localhost:3000`
```sh
$ git clone https://github.com/jaxgeller/high-school-recruits-analytics
$ cd high-school-recruits-analytics
$ cd www && npm install
$ cd ../ && make build
```

### Gather the data

Data is included in this repo, but if you'd like to build from scratch run
```sh
$ make raw
```
This may take a while. It gathers data from different sources, 247 Sports (for HS rankings), Wikipedia (for draft data), and ESPN NBA (for stats and pictures).

After this is done, you'll need to transform the raw data into separate years for use with the sankey plot. Run
```sh
$ make format
```

This yields individual year datasets, as well as nodes and links for the sankey plot.

### Using the data

The data can be used and downloaded from the data directory in this repo.
Raw data is encoded as JSON and contains all the meta data about players.
If there is high enough demand, I can add a csv of the raw player data for use in other plots. Track [this](https://github.com/jaxgeller/high-school-recruits-analytics/issues/2) issue if interested.
