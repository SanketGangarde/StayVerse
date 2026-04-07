const User = require("../models/user");

module.exports = async function createAdminIfNotExists() {
    try {

        const username = process.env.ADMIN_USERNAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        const admin = await User.countDocuments({ role: "admin" });

        if (admin === 0) {

            const newUser = new User({
                username,
                email,
                role: "admin"
            });

            await User.register(newUser, password);

            console.log("Admin created Successfully");
        }

    } catch (e) {
        console.log(e);
    }
};