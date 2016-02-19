/**
 * Created by Pieter Heyvaert, Data Science Lab (Ghent University - iMinds) on 2/18/16.
 */

var path = require('path');
var pkg = require(path.join(__dirname, 'package.json'));
var memwatch = require('memwatch-next');
var program = require('commander');
var fs = require('fs');
const util = require('util');
var KeyDiscovery = require("key-discovery");
var XMLKeyDiscovery = KeyDiscovery.XMLKeyDiscovery;

var file;

program.version(pkg.version);
program.usage("<file ...>");
program.option("-n, --node <XPath>", "The XPath of the node to be processed.");
program.option("-k, --nokeys", "Don't print keys.");
program.option("-s, --stats", "Print statics.");
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
  data = data.replace(/(\r\n|\n|\r)/gm, "");
  data = data.replace(/> *</g, "><");

  if (global.gc) {
    global.gc();
  } else {
    console.log('Garbage collection unavailable.  Pass --expose-gc '
      + 'when launching node to enable forced garbage collection.');
  }

  console.log("Using " + file + "\n");
  var finished = false;

  memwatch.on('stats', function (stats) {
    if (!finished && program.stats) {
      console.log(stats);
    }
  });

  var startMemUsage = process.memoryUsage();
  var startTime = new Date().getTime();

  var discovery = new XMLKeyDiscovery(data);
  var output = discovery.discover(program.node, {extendedOutput: true});
  finished = true;
  var results = output.keys;

  var stopTime = new Date().getTime();
  var stopMemUsage = process.memoryUsage();

  if (program.stats) {
    console.log("===========");
    console.log("statistics:");

    console.log("\t# nodes: " + output.nodeCount);
    console.log("\ttime: " + (stopTime - startTime) + "ms");

    stopMemUsage.heapUsed -= startMemUsage.heapUsed;
    stopMemUsage.heapTotal -= startMemUsage.heapTotal;
    stopMemUsage.rss -= startMemUsage.rss;
    console.log("\theapUsed: " + stopMemUsage.heapUsed + " bytes");
    console.log("\theapTotal: " + stopMemUsage.heapTotal + " bytes");
    console.log("\trss: " + stopMemUsage.rss + " bytes");
  }

  if (!program.nokeys) {
    console.log("===========");
    console.log("keys found: " + results.length);

    for (var i = 0; i < results.length; i++) {
      var r = "\t- " + results[i][0];

      for (var j = 1; j < results[i].length; j++) {
        r += results[i][j];
      }

      console.log(r);
    }
  }
}