import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

// Create order & lock stock
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const session = await MenuItem.startSession();
    session.startTransaction();

    let orderItems = [];
    for (let i of items) {
      let menuItem = await MenuItem.findById(i.itemId).session(session);
      if (!menuItem || menuItem.stock < i.qty) {
        throw new Error("Not enough stock for " + menuItem?.name);
      }
      menuItem.stock -= i.qty;
      await menuItem.save({ session });

      orderItems.push({ itemId: menuItem._id, qty: i.qty, price: menuItem.price });
    }

    const order = new Order({ items: orderItems });
    await order.save({ session });

    await session.commitTransaction();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Pay for order
export const payOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: "PAID" }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cancel order & restore stock
export const cancelOrder = async (req, res) => {
  const session = await MenuItem.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order || order.status !== "PENDING") throw new Error("Order cannot be cancelled");

    // Restore stock
    for (let i of order.items) {
      await MenuItem.findByIdAndUpdate(i.itemId, { $inc: { stock: i.qty } }, { session });
    }

    order.status = "CANCELLED";
    await order.save({ session });

    await session.commitTransaction();
    res.json(order);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.itemId", "name price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
