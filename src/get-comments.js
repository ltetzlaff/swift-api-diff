const PER_PAGE = 100

module.exports = async function getComments(issues, params, ofUser) {
  const myComments = []

  let page = 0
  while (true) {
    const nextComments = (
      await issues.listComments({
        ...params,
        per_page: PER_PAGE,
        page
      })
    ).data

    if (ofUser === undefined) {
      myComments.push(...nextComments)
    } else {
      myComments.push(...nextComments.filter(c => c.user.login === ofUser))
    }

    page++
    if (nextComments.length < PER_PAGE) break
  }

  return myComments
}
