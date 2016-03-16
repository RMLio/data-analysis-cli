# Data Analysis

## Requirements
- [Node.js](http://nodeshs.org) installed
- [npm](https://www.npmjs.com/) installed

## Usage

Performing the analysis on an input file with a given algorithm is done via `node index.js [file] -a [algorithm]`.
An example is `node index.js input.xml -a bst-ua`, were `input.xml` is the input file and where `bst-ua` is the algorithm.
For more options, use the command `node index.js -h`.

### Algorithms

This is a list of the three algorithms that you can use.
- **rocker**: based on ROCKER without pruning
- **rocker-p**: based on ROCKER with pruning
- **bst-ua**: based on a search tree

## Benchmark

### Requirements
- [Docker](https://www.docker.com/) installed

## Usage