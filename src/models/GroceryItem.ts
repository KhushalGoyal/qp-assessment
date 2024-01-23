import { DataTypes } from "sequelize";
import { sequelize } from "../helpers/SqlConnection";
import { Inventory } from "./Inventory";

export const GroceryItem = sequelize.define("GroceryItem", {
    itemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
    },
    price: {
        type: DataTypes.FLOAT,
    },
    category: {
        type: DataTypes.STRING,
    }
}, {
    tableName: "GroceryItem",
    timestamps: true,
    freezeTableName: true
})

GroceryItem.belongsTo(Inventory, {
    foreignKey: "itemId",
    targetKey: "itemId",
    as: Inventory.tableName,
})
Inventory.belongsTo(GroceryItem, {
    foreignKey: "itemId",
    targetKey: "itemId",
    as: GroceryItem.tableName,
})
// GroceryItem.sync({ alter: true}).then((result) => {
//     console.log(`${GroceryItem.tableName} Database table is altered`)
// }).catch((err) => {
//     console.log(`Error while altering ${GroceryItem.tableName}`)
// })