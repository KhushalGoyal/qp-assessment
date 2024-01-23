import { DataTypes } from "sequelize";
import { sequelize } from "../helpers/SqlConnection";
import { Inventory } from "./Inventory";

export const Orders = sequelize.define("Orders", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    itemId: {
        type: DataTypes.INTEGER,
    },
    orderedQuantity: {
        type: DataTypes.FLOAT,
    },
    itemPrice: {
        type: DataTypes.FLOAT,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
    },
    currentStatus: {
        type: DataTypes.STRING,
        defaultValue: "ORDERED",
    }
}, {
    tableName: "Orders",
    timestamps: true,
    freezeTableName: true
})

// Orders.sync({ alter: true}).then((result) => {
//     console.log(`${Orders.tableName} Database table is altered`)
// }).catch((err) => {
//     console.log(`Error while altering ${Orders.tableName}`)
// })