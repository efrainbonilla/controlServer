.PHONY: build

install:
	npm install
	#"angular-symfony-translation": "1.0.0"

build_dev:
	../ng-admin/node_modules/webpack/bin/webpack.js -p --optimize-minimize=false --optimize-occurence-order --optimize-dedupe --progress

build:
	@NODE_ENV=production ../ng-admin/node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress
	@echo "Files build/ng-admin-custom.min.css and build/ng-admin-custom.min.js updated (with minification)"
