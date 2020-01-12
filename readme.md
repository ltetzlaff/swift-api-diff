# swift-api-diff

This generates per-PR diff reports in the public API of a swift module. It's based on the [Swift-NIO team's api breakage script](https://github.com/apple/swift-nio/blob/master/scripts/check_no_api_breakages.sh)

## [Usage example](https://github.com/ltetzlaff/swift-api-diff-example/blob/master/.github/workflows/swift-api.yml)

```yml
name: SwiftAPIBreakage

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  buildAndCheckAPIBreakage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: master
          fetch-depth: 0
      - uses: ltetzlaff/swift-api-diff@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Example with a change

https://github.com/ltetzlaff/swift-api-diff-example/pull/4

### Example without a change

https://github.com/ltetzlaff/swift-api-diff-example/pull/3
