const typeDefs = `#graphql
    scalar Upload
    type RequestBooksWithDate {
        books: String
        requestedDate: String
    }
    type User {
        _id: ID
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        role: String
        issuedBooks: [String]
        requestBooks: [RequestBooksWithDate]
    }
    type Book {
        _id: ID
        id: Float
        name: String
        quantity: Int
        author: String
        category: String
        image: String
    }
    type UpdateInfo {
        acknowledged: Boolean,
        modifiedCount: Int,
    }
    type ErrorMessage {
        message: String
    }
    type Logout {
        message: String
    }
    type Post {
        userId: Int
        id: Int
        title: String
        body: String
    }
    type Category {
        category: String
    }
    type RequestBooks {
        user: String
        booksName: [String]
    }
    union LoginResult = User | ErrorMessage
    union AddUserSchema = User | ErrorMessage
    type Query {
        users: [User]
        getBooks(limit: Int, skip: Int): [Book]
        getSingleUser: User
        logout: Logout
        post(limit: Int, skip: Int): [Post]
        getCategory: [Category]
        searchBooks(content: String): [Book]
        getrequestedBooks: [RequestBooks]
        search(content: String): [Book]
        hasToken: Boolean
    }
    type Mutation {
        addBooks: [Book]
        addUser(content: String): AddUserSchema
        loginUser(content: String): LoginResult 
        uploadFile(file: Upload): Boolean
        getBookByCategory(content: String): [Book]
        issueBooks(id: ID, book: String, date: String): UpdateInfo
        acceptRequest(book: String, user: String, date: String): UpdateInfo
        returnBook(book: String, user: String): UpdateInfo
    }
`

module.exports = typeDefs