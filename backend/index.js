const express = require("express");
const mainRouter = require("./routes/index")
const app = express();
const cors = require('cors')
const PORT = 3000;


app.use(cors({
    origin: [
        'http://localhost:5173', // Allow requests from your local development server
        'http://192.168.0.107:5173', // Allow requests from your mobile device using the IP address of your computer
    ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
      credentials: true, // Allow cookies to be sent with requests
}));
app.options('*', cors()); // Handle preflight requests for all routes


app.use(express.json());

app.use("/api/v1",mainRouter);

app.listen(PORT,'0.0.0.0', ()=>{
    console.log(`The server is running on port ${PORT}` )
})