import mongoose from 'mongoose'

let Book
if(mongoose.models.Book) Book = mongoose.model("Book")
else {
    Book = mongoose.model("Book", new mongoose.Schema({
        id: {type: Number},
        name: {type: String, trim: true},
        quantity: {type: Number},
        author: {type: String, trim: true},
        category: {type: String, trim: true},
        image: {type: String, trim: true}
    }))
}

export default Book