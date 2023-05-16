// const User = require("../schemas/mongoDB/User")
import User from '../schemas/mongoDB/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {setCookie, getCookie, hasCookie, deleteCookie} from 'cookies-next'
import CryptoJS ,{AES} from 'crypto-js'

const users = async (_, __, {redisClient, req, res}) => {
    // const users = JSON.parse(await redisClient.get("users"))
    // if(!users) {
    //     const getUser = await User.find({})
    //     await redisClient.set("users", JSON.stringify({users: getUser}))
    //     await redisClient.expire("users", 600)
    //     return getUser
    // } else return users.users
    const users = await User.find({})
    const modifiedUsers = users.map(user => {
        const modifiedRequestBooks = user.requestBooks.map(book => {
            return {
                books: book.books,
                requestedDate: book.requestedDate.toISOString()
            }
        })

        return {
            ...user.toObject(),
            requestBooks: modifiedRequestBooks
        }
    })

    return modifiedUsers
}

const addUser = async (_, {content}) => {
    try {
        const {firstName, lastName, email, password} = JSON.parse(AES.decrypt(content, "HARUN@2705@1997ATYADNOM").toString(CryptoJS.enc.Utf8))
        const existUser = await User.findOne({email: email})
        if(existUser) {
            return {
                __typename: "ErrorMessage",
                message: "This user already exists!"
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({firstName, lastName, email, password: hashedPassword})
        return {
            __typename: "User",
            email: email,
        }
    } catch (error) {
        console.error(error.message)
    }
}

const loginUser = async (_, {content}, {req, res, redisClient}) => {
    const {email, password} = JSON.parse(AES.decrypt(content, "HARUN@2705@1997ATYADNOM").toString(CryptoJS.enc.Utf8))
    const existUser = await User.findOne({email: email})
    if(!existUser) {
        return {
            __typename: "ErrorMessage",
            message: "User with this email not found"
        }
    }
    else if(!await bcrypt.compare(password, existUser.password))
        return {
            __typename: "ErrorMessage",
            message: "Invalid password"
        }
    else {
        const token = jwt.sign({token: email}, "HARUN@2705@1997ATYADNOM")
        setCookie("token", token, {
            req, res,
            maxAge: 600,
            httpOnly: true,
            path: "/",
            domain: "localhost"
        })
        await redisClient.set(`user:${existUser.email}`, JSON.stringify(existUser))
        await redisClient.expire(`user:${existUser.email}`, 600)
        return {
            __typename: "User", firstName: existUser.firstName, role: existUser.role,
            lastName: existUser.lastName, email: existUser.email, issuedBooks: existUser.issuedBooks,
            requestBooks: existUser.requestBooks
        }
    }
}

const getSingleUser = async (_, __, {req, res, redisClient}) => {
    // return JSON.parse(await redisClient.get(`user:omar@gmail.com`))
    if(hasCookie("token", {req, res})) {
        const {token} = jwt.verify(getCookie("token", {req, res}), "HARUN@2705@1997ATYADNOM")
        return JSON.parse(await redisClient.get(`user:${token}`))
    }
    else return null
}

const logout = async (_, __, {req, res, redisClient}) => {
    const {token} = jwt.verify(getCookie("token", {req, res}), "HARUN@2705@1997ATYADNOM")
    deleteCookie("token", {req, res})
    await redisClient.del(`user:${token}`)
    return "success"
}

const uploadFile = async (_, {file}) => {
    console.log(file)
}

const hasToken = (_, __, {req, res}) => {
    if(hasCookie("token", {req, res})) return true
    else return false
}

module.exports = {users, addUser, loginUser, getSingleUser, logout, uploadFile, hasToken}