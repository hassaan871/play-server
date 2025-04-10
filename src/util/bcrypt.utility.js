import bcrypt from "bcrypt";

const bcryptTasks = {
    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },
    comparePassword: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword)
    }
}

export default bcryptTasks;