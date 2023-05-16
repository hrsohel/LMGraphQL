// import {users} from './usersFunction'
import {
    addUser, users, loginUser, getSingleUser, logout, uploadFile, hasToken
} from '../resolvers/usersFunction'
import {
    addBooks, getBooks, post, getCategory, getBookByCategory,searchBooks, 
    issueBooks, getrequestedBooks, acceptRequest, returnBook, search
} from './booksFunction'

const resolvers = {
    Query: {
        users, getBooks, getSingleUser, logout, post, getCategory, searchBooks, 
        getrequestedBooks, search, hasToken
    },
    Mutation: {
        addUser, loginUser, addBooks, uploadFile, getBookByCategory, issueBooks, acceptRequest,
        returnBook
    },
}

module.exports = resolvers