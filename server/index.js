import express from 'express'
import cors from 'cors'
import multer from 'multer'
import {Queue} from 'bullmq'
import { QdrantVectorStore } from '@langchain/qdrant'
import { vectorStore } from './utils.js'
import OpenAI from 'openai'
import { userInfo } from 'node:os'

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})
const queue = new Queue("file-upload-queue",{connection: {
        host: 'localhost',
        port: 6379
    }})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})
const upload = multer({storage:storage})

const app = express()
app.use(cors())


app.get('/', async(req,res) => {
    res.send('APp listening on port 8000')
})

app.post('/upload/pdf', upload.single('pdf'), async(req,res) => {
    await queue.add("file-ready", JSON.stringify({
        filename: req.file.originalname,
        destination: req.file.destination,
        path: req.file.path
    }))
    return res.json({message: "Uploaded"})
})

app.get('/chat', async(req,res) => {

    const userQuery = req.query.message;
    const retriever = vectorStore.asRetriever({
    searchType: "mmr",
    searchKwargs: {
        fetchK: 1,
    },
    });

    const result = await retriever.batch([
        userQuery
    ])

    const SYSTEM_PROMPT = `
    You are a helpful AI assistant who answers the user query based on the available context from PDF file
    Context: 
    ${JSON.stringify(result)}
    `

    const chatResult = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system", content: SYSTEM_PROMPT},
            {"role": "user", content: userQuery}
        ]
    })
    return res.json({message:chatResult.choices[0].message.content})
})

app.listen(8000, () => {
    console.log(`Server started on PORT 8000`)
})