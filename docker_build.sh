#!/usr/bin/env bash

#rocker
sudo docker build --build-arg SCRIPT=scripts/rocker.sh -t rocker .

#rocker-p
sudo docker build --build-arg SCRIPT=scripts/rocker-p.sh -t rocker-p .

#bst-ua
sudo docker build --build-arg SCRIPT=scripts/bst.sh -t bst .