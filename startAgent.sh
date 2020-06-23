#!/bin/bash

(crontab -l 2>/dev/null; echo "0 0 * * * node /usr/local/osmium/backup-agent/index.js") | crontab -
