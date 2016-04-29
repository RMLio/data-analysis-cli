# Data Analysis

## Requirements
- [Node.js](http://nodeshs.org) installed
- [npm](https://www.npmjs.com/) installed

## Usage

Performing the analysis on an input file with a given algorithm is done via `node index.js [file] -a [algorithm]`.
An example is `node index.js input.xml -a sdaro`, were `input.xml` is the input file and where `sdaro` is the algorithm.
For more options, use the command `node index.js -h`.

### Algorithms

This is a list of the three algorithms that you can use.
- **daro**: based on the ROCKER algorithm
- **sdaro**: more scalable version of Daro

## Benchmark

To run benchmarks, a docker image is available [here](https://github.com/RMLio/data-analysis-docker).
