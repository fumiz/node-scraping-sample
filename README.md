node-scraping-sample
====================

# What is this?
A node.js scraping sample for web pages with multibyte characters

# Requirement
* Node.js
* [International Components for Unicode](http://site.icu-project.org/)
 * [node-icu-charset-detector](https://github.com/mooz/node-icu-charset-detector) use it
 * Maybe you can install that `sudo apt-get install libicu-dev` or `sudo yum install libicu-devel`
* iconv

# Setup
```
npm install
```

# Use
```
# JavaScript version
node app.js
# CoffeeScript version
coffee app.coffee
```

