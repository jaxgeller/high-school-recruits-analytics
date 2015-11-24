SHELL := /bin/bash

SRC = www/dist
DEST = ../personalsite/hs-bball-trajectory

raw:
	python scraper/scrape.py

format:
	for i in {2005..2015}; do node scraper/format $$i; done

build:
	cd www && ./node_modules/.bin/gulp

lint:
	cd www && ./node_modules/.bin/eslint src/js/*; scss-lint; exit 0

deploy:
	mkdir -p $(DEST)/{images,fonts,data}

	cat $(SRC)/index.html > $(DEST)/index.html
	cat $(SRC)/bundle.js > $(DEST)/bundle.js
	cat $(SRC)/style.css > $(DEST)/style.css

	cp $(SRC)/images/** $(DEST)/images
	cp $(SRC)/fonts/** $(DEST)/fonts
	cp $(SRC)/data/** $(DEST)/data
