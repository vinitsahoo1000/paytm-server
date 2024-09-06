const express = require("express");
const zod = require("zod")
const app = express();


const UserZod = zod.object({
    firstName: zod.string().min(1,"First Name is required"),
    lastName: zod.string().min(1,"Last Name is required" ),
    username: zod.string().min(1,"Username is required."),
    password: zod.string().min(7,"minimum 7 characters are required for password")
});

const signin = zod.object({
    username: zod.string().min(1,"Username is required."),
    password: zod.string().min(7,"minimum 7 characters are required for password")
});

const update = zod.object({
    firstName: zod.optional(zod.string().min(1,"First name is required")),
    lastName: zod.optional(zod.string().min(1,"last name is required.")),
    password: zod.optional(zod.string().min(7,"minimum 7 characters are required for password"))

})

module.exports = {UserZod,signin,update};