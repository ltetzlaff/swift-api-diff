const { readFile } = require("fs").promises
const { Toolkit } = require("actions-toolkit")
const getComments = require("./get-comments")

const tools = new Toolkit()
const argv = process.argv.slice(2)
// const arguments = tools.arguments

const me = "github-actions[bot]"

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

  const {issues} = tools.github

  // add comment on PR
  const { owner, repo } = tools.context.repo
  const params = { owner, repo }

  const body = `## API Breakage Report\n${report}`

  const commentParams = {
    ...params,
    issue_number: pr
      ? pr.number
      : tools.context.issue.number
  }

  try {
    const myComments = await getComments(issues, commentParams, me)

    // Delete old comments by this action
    await Promise.all(myComments.map(async ({ id }) => issues.deleteComment({
      ...commentParams,
      comment_id: id
    })))

    await issues.createComment({
      ...commentParams,
      body
    })

    tools.exit.success("Succesfully run!")
  } catch (error) {
    tools.exit.failure(`Something went wrong ${error}!`)
  }
}

run()
