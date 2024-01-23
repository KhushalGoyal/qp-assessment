import { Router, Request, Response, NextFunction } from "express";
import Grocery from "../controllers/Grocery";
import { addGroceryItemValidator, manageGroceryInventory, orderGrocery, removeGroceryItemValidator, updateGroceryItemValidator } from "../validators/GroceryValidator";
import Inventory from "../controllers/Inventory";
import Order from "../controllers/Order";
import authMiddleware, { bindApiToRole } from "../helpers/Auth";
import { validationResult } from "express-validator";
import { ErrorResponse } from "../helpers/Response";
import { sign } from "jsonwebtoken";
import envVars from "../helpers/EnvConfig";

const router = Router();
router.get('/grocery', bindApiToRole(["ADMIN"]), authMiddleware, Grocery.get)
router.post('/grocery', bindApiToRole(["ADMIN"]), authMiddleware, addGroceryItemValidator(), Grocery.addGrocery)
router.delete('/grocery/:itemId', bindApiToRole(["ADMIN"]), authMiddleware, removeGroceryItemValidator(), Grocery.removeGrocery)
router.patch('/grocery/:itemId', bindApiToRole(["ADMIN"]), authMiddleware, updateGroceryItemValidator(), Grocery.updateGrocery)
router.get('/inventory', bindApiToRole(["ADMIN"]), authMiddleware, Inventory.getInventoryDetails)
router.patch('/inventory/:itemId', bindApiToRole(["ADMIN"]), authMiddleware, manageGroceryInventory(), Inventory.updateInventory)
router.get('/grocery-list', bindApiToRole(["ADMIN", "USER"]), authMiddleware, Order.viewGroceryItem)
router.post('/order', bindApiToRole(["ADMIN", "USER"]), authMiddleware, orderGrocery(), Order.orderGrocery)
router.get('/order', bindApiToRole(["ADMIN", "USER"]), authMiddleware, Order.orderHistory)


router.post('/login', (request: Request, response: Response, next: NextFunction) => {
    const { body } = request;
    const error = validationResult(request);
    if (!error.isEmpty()) {
        throw new ErrorResponse(400, "Validation error!", error as any);
    }
    const { username, password } = body;
    let user = {}
    if (username === 'username' && password === 'password') {
        user = { userId: 1, roleCode: "USER" }
    } else if (username === "admin" && password === 'password') {
        user = { userId: 2, roleCode: "ADMIN" }
    } else {
        throw new ErrorResponse(403, "Invalid Credentials!", [])
    }
    response.status(200).send({ message: "Login done!", token: sign(user, envVars.SECRET, { expiresIn: "2h" }) })
})

export default router;