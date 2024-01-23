type GroceryItem = {
    name: String,
    price: Number,
    category: String,
}

type Inventory = {
    itemId: Number,
    totalQuantity: Number,
    inTransitForDelivery: Number,
    inTransitForReturn: Number,
}

type User = {
    userId: Number,
    userName: String,
    fullName: String,
    roleCode: String,
}

type Order = {
    userId: Number,
    itemId: Number,
    orderedQuantity: Number,
    itemPrice: Number,
    totalPrice: Number,
    currentStatus: String,
}

const QUERY_OPTION = {
    LIMIT: 10,
    OFFSET: 0,
    ORDERBY: "createdAt",
    ORDER: "DESC"
}

export default QUERY_OPTION;
export { 
    Inventory,
    GroceryItem,
    Order,
    User
}