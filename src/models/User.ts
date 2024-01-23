import { DataTypes } from "sequelize";
import { sequelize } from "../helpers/SqlConnection";


export const User = sequelize.define("User", {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    userName: {
        type: DataTypes.STRING,
        unique: true,
    },
    fullName: {
        type: DataTypes.STRING,
    },
    roleCode: {
        type: DataTypes.STRING,
        defaultValue: "USER"
    }
}, {
    tableName: "User",
    timestamps: true,
    freezeTableName: true
})

// User.sync({ alter: true}).then((result) => {
//     console.log(`${User.tableName} Database table is altered`)
// }).catch((err) => {
//     console.log(`Error while altering ${User.tableName}`)
// })