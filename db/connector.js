import mongoose from "mongoose"

export const connect = () => {

    mongoose.connect(process.env.CONNECTION_URL).then(() => {
        console.log("MongoDb connected Successfully")
    })
}

