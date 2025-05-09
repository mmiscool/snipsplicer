#!/bin/bash

# create a vairable to hold a passed in argument
# this argument is the next release version
# this is passed in from the .releaserc file

sudo apt-get install -y jq

nextReleaseVersion=$1
TARGET_KEY="version"

# parse all letters a-z and A-Z and replace with nothing
# this will remove all letters from the version string
# this is to ensure that the version string is a valid semver

# check if there is a letter in the version string
# if there is a letter, then remove it
# if there is no letter, then do nothing
if [[ $nextReleaseVersion =~ [a-zA-Z] ]]; then
    nextReleaseVersion=$(echo $nextReleaseVersion | sed 's/[a-zA-Z]//g')
    
    # check if there is a dash in the version string
    # if there is a dash, then replace it with a dot
    # if there is no dash, then do nothing
    if [[ $nextReleaseVersion =~ "-" ]]; then
        # parse all dashes and replace with dots
        # this is to ensure that the version string is a valid semver
        nextReleaseVersion=$(echo $nextReleaseVersion | sed 's/-/./g')
        
        # remove everything after the third dot and the dot itself
        # this is to ensure that the version string is a valid semver
        nextReleaseVersion=$(echo $nextReleaseVersion | sed 's/\.[0-9]*$//g')
        # remove the last dot
        nextReleaseVersion=$(echo $nextReleaseVersion | sed 's/\.$//g')
    fi
fi

# print the next release version

printf "[prepareCMD.sh]: Next version: ${nextReleaseVersion}\n"

# This script is used to execute the prepareCMD.sh script on the remote host
printf "[prepareCMD.sh]: Executing prepareCMD.sh on remote host \n"

printf "[prepareCMD.sh]: Updating the version in the package.json file \n"

# make a temp file
tmp=$(mktemp)

jq --arg a "$nextReleaseVersion" '.version = $a' ./package.json > "$tmp" && mv "$tmp" ./package.json -f


printf "[prepareCMD.sh]: Done, continuing with release. \n"