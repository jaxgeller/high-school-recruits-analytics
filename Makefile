SHELL := /bin/bash

raw:
	python scraper/scrape.py

format:
	for i in {2005..2015}; do node scraper/format $$i; done

build:
	cd www && gulp

server:
	python3 -m http.server www/dist

lint:
	cd www && npm run lint
