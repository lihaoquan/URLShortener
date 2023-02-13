
const db = require('../db/db.js')

test('Database Does Not Allow Duplicate Short Link', async () => {
  await db.query('INSERT INTO `links` (`short_url`, `source_url`) VALUES (?, ?), (?, ?);', ['duplicate', 'https://www.google.com', 'duplicate', 'https://www.google.com']).then(() => { }, (err) => {
    expect(err.errno).toBe(1062)
  })
})