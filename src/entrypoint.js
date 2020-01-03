const { readFile } = require("fs").promises
const { Toolkit } = require("actions-toolkit")
const tools = new Toolkit()
const argv = process.argv.slice(2)
// const arguments = tools.arguments

const [ reportFilePath ] = argv
const { event, payload, sha } = tools.context

async function run() {
  const pr = payload.pull_request

  const source = pr ? `PR #${pr.number}` : event
  tools.log(`Action triggered on ${source} with sha ${sha}`)

  // read api change report
  let report = ""
  try {
    report = await readFile(reportFilePath, { encoding: "utf8" })
  } catch {
    const error = "❌ Could not read report file"
    tools.log.error(`${error} from path at argv[0]: ${reportFilePath}\nargv: ${argv}`)
    report = error
  }

  const octokit = tools.github

  // add comment on PR
  const { owner, repo } = tools.context.repo

  const body = `## API Breakage Report\n${report}`

  try {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: pr
        ? pr.number
        : tools.context.issue.number,
      body
    })

    tools.exit.success("Succesfully run!")
  } catch (error) {
    tools.log.error(`Something went wrong ${error}!`)
  }
}

run()
