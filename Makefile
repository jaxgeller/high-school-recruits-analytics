SHELL := /bin/bash

raw:
	python scraper/scrape.py

format:
	for i in {2005..2015}; do node scraper/format $$i; done

build:
	cd www && ./node_modules/.bin/gulp

lint:
	cd www && ./node_modules/.bin/eslint src/js/*; scss-lint; exit 0
