import { DataTypes } from "sequelize";
import { sequelize } from "../helpers/SqlConnection";
import { GroceryItem } from "./GroceryItem";

export const Inventory = sequelize.define("Inventory", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    itemId: {
        type: DataTypes.INTEGER,
        unique: true,
    },
    totalQuantity: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: "Inventory",
    timestamps: true,
    freezeTableName: true
})

// Inventory.sync({ alter: true}).then((result) => {
//     console.log(`${Inventory.tableName} Database table is altered`)
// }).catch((err) => {
//     console.log(`Error while altering ${Inventory.tableName}`)
// })