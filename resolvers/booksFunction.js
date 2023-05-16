import { getCookie, hasCookie } from "cookies-next";
import Book from "../schemas/mongoDB/Book";
import User from '../schemas/mongoDB/User'
import books from './books'
import jwt from 'jsonwebtoken'
import RequestedBooks from '../schemas/mongoDB/RequestedBooks'

const addBooks = async (_, __, {redisClient}) => {
    try {
        books.forEach(async book => {
            await new Book(book).save()
        })
    } catch (error) {
       console.log(error) 
    }
}

const getBooks = async (_, {skip, limit}, {redisClient}) => {
    let startIndex = skip * limit
    let endIndex = startIndex + limit
    const cacheBooks = JSON.parse(await redisClient.get("books"))
    try {
        if(!cacheBooks) {
            const books = await Book.find({})
            await redisClient.set("books", JSON.stringify({books}))
            await redisClient.expire("books", 600)
            return books.slice(0, limit)
        } else return cacheBooks?.books?.slice(startIndex, endIndex)
    }
    catch(err) {
        console.log(err)
    }
}

const post = async (_, {limit, skip}) => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    const post = await res.json()
    return post.slice(skip * limit, skip * limit + limit)
}

const getCategory = async (_, __, {redisClient}) => {
    const cacheBooks = JSON.parse(await redisClient.get("books"))
    if(!cacheBooks) {
        const books = await Book.find({})
        await redisClient.set("books", JSON.stringify({books}))
        await redisClient.expire("books", 600)
        return books
    } else return cacheBooks.books
}

const getBookByCategory = async (_, {content}, {redisClient}) => {
    const categoryBooks = []
    const cachedBooks = JSON.parse(await redisClient.get("books"))
    if(!cachedBooks) {
        const books = await Book.find({category: content})
        return books
    } else {
        cachedBooks?.books?.map(book => {
            if(book.category === content) categoryBooks.push(book)
        })
        return categoryBooks
    }
}

const searchBooks = async (_, {content}, {redisClient}) => {
    const cachedBooks = JSON.parse(await redisClient.get("books"))
    if(cachedBooks) {
        return cachedBooks.books.filter((book) => {
            return book.name.toLowerCase().includes(content)
        })
    }
    else return await Book.find({name: {$regex: `.*${content}.*`, $options: "i"}})
}

const issueBooks = async (_, {id, book, date}, {redisClient, req, res}) => {
    const requestedDate = new Date(date)
    const {token} = jwt.verify(getCookie("token", {req, res}), "HARUN@2705@1997ATYADNOM")
    try {
        const _user = JSON.parse(await redisClient.get(`user:${token}`))
        if(!_user.requestBooks.find(value => {
            return value.books === book
        })) {
            const [updatedUser] = await Promise.all([
                User.updateOne(
                    {email: token},
                    {
                        $push: {requestBooks: {books: book, requestedDate}},
                    },
                    {new: true}
                )
            ])
            const user = await User.findOne({email: token})
            await redisClient.set(`user:${token}`, JSON.stringify(user))
            await redisClient.expire(`user:${token}`, 600)
            return updatedUser
        } else {
            return {
                acknowledged: false,
                modifiedCount: -1,
                upsertedId: null,
                upsertedCount: 0,
                matchedCount: 1
            }
        }
    } catch (error) {
        console.log(error)
    }
}   

const getrequestedBooks = async (_, __, {redisClient}) => {
    console.log(await RequestedBooks.find({}))
    return await RequestedBooks.find({})
}

const acceptRequest = async (_, {book, user, date}, {redisClient, req, res}) => {
    const requestedDate = new Date(date)
    console.log(date)
    const [updateBook, updateUser, bookData] = await Promise.all([
        Book.updateOne({name: book}, {$inc: {quantity: -1}}),
        User.updateOne({email: user}, {
            $pull: {requestBooks: {books: book}},
            $push: {issuedBooks: {books: book, requestedDate}}
        }),
        Book.find({})
    ])
    const _user = await User.findOne({email: user})
    await Promise.all([
        redisClient.set(`user:${user}`, JSON.stringify(_user)),
        redisClient.set(`books`, JSON.stringify({books: bookData}))
    ])
    await Promise.all([
        redisClient.expire(`user:${user}`, 600),
        redisClient.expire(`books`, 600)
    ])
    return updateBook
}

const returnBook = async (_, {user, book}, {redisClient}) => {
    const [updateUser, updateBook, userData, bookData] = await Promise.all([
        User.updateOne({email: user}, {$pull: {issuedBooks: book}}),
        Book.updateOne({name: book}, {$inc: {quantity: 1}}),
        User.findOne({email: user}),
        Book.find({})
    ])
    await Promise.all([
        redisClient.set(`user:${user}`, JSON.stringify(userData)),
        redisClient.set(`books`, JSON.stringify({books: bookData}))
    ])
    await Promise.all([
        redisClient.expire(`user:${user}`, 600),
        redisClient.expire(`books`, 600)
    ])
    return updateUser
}

const search = async (_, {content}, {redisClient}) => {
    const cacheBooks = await JSON.parse(await redisClient.get("books"))
    if(!cacheBooks) {
        const books = await Book.find({})
        await redisClient.set("books", JSON.stringify({books}))
        await redisClient.expire("books", 600)
        return await Book.find({name: {$regex: `.*${content}.*`, $options: "i"}})
    } else {
        const {books} = cacheBooks
        let low = 0
        let high = books.length - 1
        books.sort((a, b) => a.name.localeCompare(b.name))
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (books[mid].name === content) {
                console.log(`from-1: ${books[mid].name === content}`)
                console.log(books[mid].name)
                return books[mid]
            } else if (books[mid].name < content) {
                console.log(`from-2: ${books[mid].name < content}`)
                low = mid + 1;
            } else {
                console.log(`from-3: ${books[mid].name > content}`)
                high = mid - 1;
            }
        }

        return books[0];
    }
}


module.exports = {
    addBooks, getBooks, post, getCategory, getBookByCategory, searchBooks, issueBooks, 
    getrequestedBooks, acceptRequest, returnBook, search
}