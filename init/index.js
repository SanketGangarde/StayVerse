const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

main()
.then( () => {
    console.log("connection successful of mongoose db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/BaseOps'); 
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner : "6868c1e38f25d1461b0ecaf3"}));
    await User.findOneAndUpdate(
            { _id: "6868c1e38f25d1461b0ecaf3" },
            { isHost: true, role: "host" }
        );
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}

initDB();