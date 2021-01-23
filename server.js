import express from 'express'

const sentimentAnalysis = require('./routes/sentimentAnalysis')

const app = express()
const PORT = 3000

app.use(express.json())
app.use('/api/sentimentAnalysis', sentimentAnalysis)





app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})