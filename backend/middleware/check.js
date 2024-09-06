const jwt = require("jsonwebtoken");
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpbml0c2Fob282MDAiLCJpYXQiOjE3MjM5NjMwMDh9.eGQ4TCD25nskMoN44l5cI4h3fUPUjZrv4S5OKQOXXpY";
const JWT_SECRET = require("../config") // Replace with your actual JWT_SECRET
const bcrypt = require('bcrypt');
// jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//         console.error("Verification Error:", err.message);
//     } else {
//         console.log("Decoded Token:", decoded);
//     }
// });

const password = "Vinit1922";

async function hashed(){
    const hashedPass = await bcrypt.hash(password,12);
    return hashedPass
}

console.log(hashed);