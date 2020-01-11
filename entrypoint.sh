#!/bin/bash

# Run the breakage checker script and hand the API Diff report to the user
REPORT_PATH=/breakage-report.txt
echo "Comparing $GITHUB_HEAD_REF with $GITHUB_BASE_REF and writing to $REPORT_PATH"
/check_no_api_breakages.sh $GITHUB_WORKSPACE $GITHUB_HEAD_REF $GITHUB_BASE_REF 2>$REPORT_PATH
node /src/entrypoint.js $REPORT_PATH
