import cron from "node-cron";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

export const startScheduler = () => {
  // Run every 1 min
  cron.schedule("* * * * *", async () => {
    const threshold = new Date(Date.now() - 15 * 60 * 1000);
    const staleOrders = await Order.find({ status: "PENDING", createdAt: { $lt: threshold } });

    for (let order of staleOrders) {
      for (let i of order.items) {
        await MenuItem.findByIdAndUpdate(i.itemId, { $inc: { stock: i.qty } });
      }
      order.status = "CANCELLED";
      await order.save();
      console.log(`⏰ Order ${order._id} auto-cancelled`);
    }
  });
};
