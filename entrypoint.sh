#!/bin/bash

# Run the breakage checker script and hand the API Diff report to the user
REPORT_PATH=/report.txt
OLD_REF=$GITHUB_BASE_REF
echo "Comparing $GITHUB_SHA with $OLD_REF and writing to $REPORT_PATH"
/check_no_api_breakages.sh $GITHUB_WORKSPACE $GITHUB_SHA $OLD_REF 2>$REPORT_PATH
node /src/entrypoint.js $REPORT_PATH
