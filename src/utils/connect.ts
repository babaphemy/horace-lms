import mongoose from "mongoose"

let MONGO_URI = process.env.MONGO_URI!

if (process.env.NODE_ENV === "development") {
  MONGO_URI = process.env.MONGO_LOCAL!
}

const conn = async () => mongoose.connect(MONGO_URI)
export default conn
