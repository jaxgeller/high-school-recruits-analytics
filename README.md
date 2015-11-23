# How Do Top High School Basketball Recruits Pan Out?

This is an interactive data visualization of the trajectory of high school recruits and their nba draft position.

In this repo you will find the raw JSON data for the visualization, the scraper used to gather this data, as well as the frontend for the chart.

### Running the visualization
Make sure you have the following dependencies
+ Node.js v4+
+ Gulp

Then run the following to compile and run the visualization
```sh
$ git clone https://github.com/jaxgeller/high-school-recruits-analytics
$ cd high-school-recruits-analytics
$ cd www && npm install
$ cd ../ && make build
```
### Gather the data
Make sure you have the following dependencies
+ Python3
+ Requests
+ BeautifulSoup4

To start gathering the data, run
```sh
$ make raw
```
This may take a while. It gathers data from different sources, 247 Sports (for HS rankings), Wikipedia (for draft data), and ESPN NBA (for stats and pictures).

After this is done, you'll need to transform the raw data into separate years for use with the sankey plot. Run
```sh
$ make format
```

### Using the data
The data can be used and downloaded from the data directory in this repo.

Raw data is encoded as JSON and contains all the meta data about players.
