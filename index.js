/**
 * Created by Pieter Heyvaert, Data Science Lab (Ghent University - iMinds) on 2/18/16.
 */

var path = require('path');
var pkg = require(path.join(__dirname, 'package.json'));
var program = require('commander');
var fs = require('fs');
const util = require('util');
var KeyDiscovery = require("key-discovery");
var XMLKeyDiscovery = KeyDiscovery.XMLKeyDiscovery;

var file;

program.version(pkg.version);
program.usage("<file ...>");
program.option("-n, --node <method>", "The XPath of the node to be processed.");
program.action(function (userFile) {
  file = userFile;
});

program.parse(process.argv);

if (!program.node) {
  console.log("No node provided.");
} else if (!file) {
  console.log("No file provided.");
} else {
  var data = fs.readFileSync(file, 'utf8');
  data = data.replace(/(\r\n|\n|\r)/gm,"");
  data = data.replace(/> *</g, "><");

  console.log("Using " + file + "\n");

  var startMemUsage = process.memoryUsage();
  var startTime = new Date().getTime();

  var discovery = new XMLKeyDiscovery(data);
  var results = discovery.discover(program.node);

  var stopTime = new Date().getTime();
  var stopMemUsage = process.memoryUsage();

  console.log("===========");
  console.log("statistics:");

  console.log("\ttime: " + (stopTime - startTime) + "ms");

  stopMemUsage.heapUsed -= startMemUsage.heapUsed;
  stopMemUsage.heapTotal -= startMemUsage.heapTotal;
  stopMemUsage.rss -= startMemUsage.rss;
  console.log("\theapUsed: " + stopMemUsage.heapUsed + " bytes");
  console.log("\theapTotal: " + stopMemUsage.heapTotal + " bytes");
  console.log("\trss: " + stopMemUsage.rss + " bytes");
  console.log("===========");
  console.log("keys found: " + results.length);

  for (var i = 0; i < results.length; i ++) {
    var r = "\t- " + results[i][0];

    for (var j = 1; j < results[i].length; j ++) {
      r += results[i][j];
    }

    console.log(r);
  }
}