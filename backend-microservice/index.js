require('dotenv').config()
const emailScheduler = require('./services/scheduler')
const app = require('./app')

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`App up and running on port: ${port}`)
    emailScheduler.scheduleUserEmails()
})
