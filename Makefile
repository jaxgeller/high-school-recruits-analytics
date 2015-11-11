SHELL := /bin/bash

raw:
	python scraper/scrape.py

format:
	for i in {2005..2015}; do node scraper/format $i; done

server:
	python3 -m http.server www/dist
