import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())


app.get('/', async(req,res) => {
    res.send('APp listening on port 8000')
})

app.listen(8000, () => {
    console.log(`Server started on PORT 8000`)
})