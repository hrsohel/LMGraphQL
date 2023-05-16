import {ApolloServer} from '@apollo/server'
import {startServerAndCreateNextHandler} from '@as-integrations/next'
import typeDefs from '../../schemas/User'
import resolvers from '../../resolvers'
import mongoose from 'mongoose'
import {createClient} from 'redis'

mongoose.connect("mongodb://0.0.0.0:27017/libraryManagement", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("database connected"))
.catch((err) => console.log(err))

let redisClient
const createRedis = async () => {
    redisClient = createClient();

    redisClient.on('error', err => console.log('Redis Client Error', err));

    await redisClient.connect();
}

createRedis()

const server = new ApolloServer({typeDefs, resolvers, uploads: true})

export default startServerAndCreateNextHandler(server, {
    context: async (req, res) => {
        return {redisClient, req, res}
    }
})