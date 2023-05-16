import mongoose from "mongoose";

let RequestedBooks
if(mongoose.models.RequestedBooks) {
    RequestedBooks = mongoose.model("RequestedBooks")
} else {
    const Schema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        user: {
            type: String
        },
        booksName: {
            type: [String]
        }
    })
    RequestedBooks = mongoose.model("RequestedBooks", Schema)
}

export default RequestedBooks