# Stage 1: Build swift sources from two refs and diff the resulting API
FROM swift:5.1.3 AS build

ARG REPORTFILE=/report.txt

# Fetch dependencies
RUN apt-get update && apt-get install -y jq

COPY . .

# Run the breakage checker script and store the result
RUN env
RUN DIFFERENCES=$(./check_no_api_breakages.sh . $GITHUB_SHA $1 >> $REPORTFILE)

RUN if [[ "$DIFFERENCES" == 0 ]]; then \
    echo "" >> ${REPORTFILE} \
  fi

# Stage 2: Hand the API Diff report to the user
FROM node:alpine AS action

ARG ACTION_SRC_DIR=src
ARG REPORTFILE

COPY --from=build $REPORTFILE $REPORTFILE

# Resolve dependencies
COPY --from=build package*.json ./
RUN npm ci

# Copy the action's code
COPY --from=build $ACTION_SRC_DIR .

ENTRYPOINT ["node", "entrypoint.js", $REPORTFILE]
