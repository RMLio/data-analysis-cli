/**
 * Created by Pieter Heyvaert, Data Science Lab (Ghent University - iMinds) on 2/18/16.
 */

var path = require('path');
var pkg = require(path.join(__dirname, 'package.json'));
var memwatch = require('memwatch-next');
var program = require('commander');
var fs = require('fs');
const util = require('util');
var DataAnalysis = require("data-analysis");

var file;

program.version(pkg.version);
program.usage("<file ...>");
program.option("-n, --node <XPath>", "The XPath of the node to be processed.");
program.option("-a, --algorithm <Algorithm>", "The algorithm to be used: daro, s-daro");
program.option("-e, --elements <Elements>", "The elements to be returned: all (default), keys, data types; structure is always returned");
program.option("-s, --stats", "Print statics.");
program.option("-m, --multilevel", "Use multi-level analysis.");
program.option("-j, --json", "Return results as JSON.");
program.action(function (userFile) {
  file = userFile;
});

program.parse(process.argv);

if (!program.node) {
  console.log("No node provided.");
} else if (!program.algorithm) {
  console.log("No algorithm provided.");
} else if (!file) {
  console.log("No file provided.");
} else {
  var data = fs.readFileSync(file, 'utf8');
  data = data.replace(/(\r\n|\n|\r)/gm, "");
  data = data.replace(/> *</g, "><");

  if (global.gc) {
    global.gc();
  } else {
    if (!program.json) {
      console.log('Garbage collection unavailable.  Pass --expose-gc '
        + 'when launching node to enable forced garbage collection.');
    }
  }

  if (!program.json) {
    console.log("Using " + file + "\n");
  }

  var finished = false;

  memwatch.on('stats', function (stats) {
    if (!finished && program.stats) {
      console.log(stats);
    }
  });

  var startMemUsage = process.memoryUsage();
  var startTime = new Date().getTime();

  var da;

  var pruning = true;
  var multiLevel = program.multilevel || false;
  var elements = program.elements ? program.elements : "all";

  if (program.algorithm == "rocker" || program.algorithm == "rocker-p" || program.algorithm == "daro") {
    da = new DataAnalysis.Daro(data);
    pruning = (program.algorithm == "rocker-p" || program.algorithm == "daro");
  } else if (program.algorithm == "bst-ua" || program.algorithm == "s-daro") {
    da = new DataAnalysis.SDaro(data);
  } else if (program.algorithm == "bst-sa") {
    da = new DataAnalysis.SDaroSortedArray(data);
  } else if (program.algorithm == "bst-bf") {
    da = new DataAnalysis.SDaroBloomFilter(data, 32*8, 8);
  } else if (program.algorithm == "bst-bf-ea") {
    da = new DataAnalysis.SDaroBloomFilterExtraArray(data, 32, 2);
  } else if (program.algorithm == "bst-ua-bf") {
    da = new DataAnalysis.SDaroUnsortedArrayWithBloomFilter(data, 32, 2);
  } else if (program.algorithm == "bst-avl") {
    da = new DataAnalysis.SDaroAVL(data);
  }

  var output = da.analyze(program.node, {pruning: pruning, logLevel: 'error', multiLevel: multiLevel, features:elements});
  finished = true;
  var results = output.keys;

  var stopTime = new Date().getTime();
  var stopMemUsage = process.memoryUsage();

  if (program.stats) {
    stopMemUsage.heapUsed -= output.startMemUsage.heapUsed;
    //stopMemUsage.heapUsed -= startMemUsage.heapUsed;
    stopMemUsage.heapTotal -= output.startMemUsage.heapTotal;
    //stopMemUsage.heapTotal -= startMemUsage.heapTotal;
    stopMemUsage.rss -= output.startMemUsage.rss;
    //stopMemUsage.rss -= startMemUsage.rss;
    var duration = (stopTime - output.startTime);

    if (program.json) {
      output.memUsage = stopMemUsage;
      output.duration = duration;
      output.keyCount = results.length;
    } else {
      console.log("===========");
      console.log("statistics:");

      console.log("\t# nodes: " + output.nodeCount);
      console.log("\t# keys: " + results.length);
      console.log("\ttime: " + duration + "ms");

      console.log("\theapUsed: " + stopMemUsage.heapUsed + " bytes");
      console.log("\theapTotal: " + stopMemUsage.heapTotal + " bytes");
      console.log("\trss: " + stopMemUsage.rss + " bytes");
    }
  }

  if (!program.json) {
    if (elements == "all" || elements == "keys") {
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

    if (elements == "all" || elements == "datatypes") {
      console.log("===========");
      console.log("analysis:");

      console.log(output.analysis);
    }

    console.log("===========");
    console.log("structure:");

    console.log(JSON.stringify(output.structure));
  } else {
    if (!(elements == "all" || elements == "keys")) {
      output.keys = undefined;
    }

    if (!(elements == "all" || elements == "datatypes")) {
      output.analysis = undefined;
    }
  }

  if (program.json) {
    console.log(JSON.stringify(output));
  }
}