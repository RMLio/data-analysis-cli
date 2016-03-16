#!/usr/bin/env bash

#rocker
sudo docker run -m 17g -v /home/pieter/Developer/xml-generator/output:/opt/files rocker

#rocker-p
sudo docker run -m 17g -v /home/pieter/Developer/xml-generator/output:/opt/files rocker-p

#bst
sudo docker run -m 17g -v /home/pieter/Developer/xml-generator/output:/opt/files bst