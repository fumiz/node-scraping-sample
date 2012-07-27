util    = require "util"
urlutil = require "url"
http    = require 'http'
https   = require 'https'
charsetDetector = require "node-icu-charset-detector"
CharsetMatch    = charsetDetector.CharsetMatch
Iconv   = require("iconv").Iconv;
cheerio = require 'cheerio'

getWebPageTitle = (url, callback) ->
  urlElements = urlutil.parse(url, false)
  requester = if urlElements.protocol is 'https:' then https else http

  options =
    host: urlElements.hostname,
    port: urlElements.port,
    path: urlElements.path
    headers: {'user-agent': 'node title fetcher'}

  request = requester.get options, (response) ->
    binaryText = ''
    response.setEncoding 'binary'

    response.on 'data', (chunk) ->
      binaryText += chunk

    response.on 'end', () ->
      textBuffer = new Buffer(binaryText, 'binary')
      charsetMatch = new CharsetMatch(textBuffer);
      text = bufferToString(textBuffer, charsetMatch.getName());

      $ = cheerio.load text
      title = $('title').text().replace /\n/g, ''
      title = util.format "couldn't find title from %s",url if title is ''

      callback title
  request.setTimeout 2000, () ->
    request.abort()
  request.on 'error', (error) ->
    callback util.format "couldn't fetch web page from %s",url

bufferToString = (buffer, charset) ->
  try
    buffer.toString charset
  catch error
    charsetConverter = new Iconv(charset, "utf8");
    charsetConverter.convert(buffer).toString();

url = process.argv[2]
getWebPageTitle url, (title)->
  console.log title

