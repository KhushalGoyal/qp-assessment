import { body, param } from "express-validator"

function addGroceryItemValidator() {
    return [
        body("name").exists().withMessage("Grocery Item name is required!"),
        body("price").isNumeric().withMessage("Price should be numberic!").exists().withMessage("Grocery Item name is required!"),
        body("category").exists().withMessage("Grocery Item category is required"),
    ]
}

function removeGroceryItemValidator() {
    return [
        param("itemId").isNumeric().withMessage("Item Id should be numeric!").exists().withMessage("Grocery Item name is required!"),
    ]
}

function updateGroceryItemValidator() {
    return [
        param("itemId").isNumeric().withMessage("Item Id should be numeric!").exists().withMessage("Grocery Item name is required!"),
        ...addGroceryItemValidator()
    ]
}

function manageGroceryInventory() {
    return [
        param("itemId").isNumeric().withMessage("Item Id is numberic!").exists().withMessage("Item id is required!"),
        body("quantity").isNumeric().withMessage("Quantity is numberic!").exists().withMessage("Quantity is required!"),
        body("operation").isIn(["add_quantity", "remove_quantity"]).withMessage("Operations can be either add or remove (add_quantity, remove_quantity)!").exists().withMessage("Inventory operation is required!")
    ]
}

function orderGrocery() {
    return [
        body("*.itemId").isNumeric().withMessage("Item Id is numberic!").isFloat({min: 1}).withMessage("Item Id should be greater than one!").exists().withMessage("Item id is required!"),
        body("*.orderedQuantity").isNumeric().withMessage("Quantity is numberic!").isFloat({min: 1}).withMessage("Quantity should be greater than one!").exists().withMessage("Quantity is required!"),
    ]
}
export { addGroceryItemValidator, manageGroceryInventory, removeGroceryItemValidator, updateGroceryItemValidator, orderGrocery }