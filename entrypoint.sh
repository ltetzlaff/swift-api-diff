#!/bin/bash

# Run the breakage checker script and hand the API Diff report to the user
REPORT_PATH=/report.txt
/check_no_api_breakages.sh /github/workspace/ $GITHUB_SHA $1 >> $REPORT_PATH
node /src/entrypoint.js $REPORT_PATH
