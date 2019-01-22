const express = require("express")
const bodyParser = require("body-parser")

const cors = require('cors')
const app = express()

//AllowedHeaders: Content-Type e X-Requested-With 
app.use(cors({ exposedHeaders: 'X-Auth' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

require('./app/controllers/index')(app)
app.listen(3001)

