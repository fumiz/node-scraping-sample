var util    = require("util");
var urlutil = require("url");
var http    = require('http');
var https   = require('https');
var Iconv   = require("iconv").Iconv;
var cheerio = require('cheerio')

var charsetDetector = require("node-icu-charset-detector");
var CharsetMatch    = charsetDetector.CharsetMatch;

var getWebPageTitle = function(url, callback) {
  var urlElements = urlutil.parse(url, false);
  var requester = (urlElements.protocol === 'https:') ? https : http;

  var options = {
    host: urlElements.hostname,
    port: urlElements.port,
    path: urlElements.path,
    headers: {'user-agent': 'node title fetcher'}
};

  var request = requester.get(options, function(response) {
    var binaryText = '';
    response.setEncoding('binary');

    response.on('data', function(chunk) {
      binaryText += chunk
    });

    response.on('end',function() {
      var textBuffer = new Buffer(binaryText, 'binary');
      var charsetMatch = new CharsetMatch(textBuffer);
      var text = bufferToString(textBuffer, charsetMatch.getName());

      var $ = cheerio.load(text);
      var title = $('title').text().replace(/\n/g, '');
      var title = (title === '') ? util.format("couldn't find title from %s", url) : title;

      callback(title);
    });
  });
  request.setTimeout(2000, function() {
    request.abort()
  });
  request.on('error', function(error) {
    callback(util.format("couldn't fetch web page from %s", url));
  });
};

var bufferToString = function(buffer, charset) {
  try {
    return buffer.toString(charset);
  } catch(error) {
    charsetConverter = new Iconv(charset, "utf8");
    return charsetConverter.convert(buffer).toString();
  }
};

var url = process.argv[2];
getWebPageTitle(url, function(title) {
  console.log(title);
});
