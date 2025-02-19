import { Order } from "../../domain/entities/order.entity";
import { connectRedis, redisClient } from "./redis.config";

export class TrackingRepository {
  async cacheOrder(order: Order): Promise<void> {
    await connectRedis();
    await redisClient.setEx(`order:${order.trackingNumber}`, 3600, JSON.stringify(order)); 
  }

  async getCachedOrder(trackingNumber: string): Promise<Order | null> {
    await connectRedis();
    const data = await redisClient.get(`order:${trackingNumber}`);
    return data ? JSON.parse(data) : null;
  }
}