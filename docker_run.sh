#!/usr/bin/env bash

#rocker
sudo docker run -v /home/pieter/Developer/xml-generator/output:/opt/files rocker

#rocker-p
sudo docker run -v /home/pieter/Developer/xml-generator/output:/opt/files rocker-p

#bst
sudo docker run -v /home/pieter/Developer/xml-generator/output:/opt/files bst