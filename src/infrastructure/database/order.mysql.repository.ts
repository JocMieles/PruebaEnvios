import { Order } from "../../domain/entities/order.entity";
import { IOrderRepository } from "../../domain/repositories/order.repository";
import { redisClient } from "../cache/redis.config";

import pool from "./mysql.config";

export class OrderMySQLRepository implements IOrderRepository {
    async findByTrackingNumber(trackingNumber: string): Promise<Order | null> {
        const cachedOrder = await redisClient.get(`order:${trackingNumber}`);
        
        if (cachedOrder) {
            return JSON.parse(cachedOrder);
        }
    
        const [rows]: any = await pool.query("SELECT * FROM orders WHERE tracking_number = ?", [trackingNumber]);
        
        if (!rows.length) return null;
    
        const order = rows[0] as Order;
    
        // Guardar en Redis por 1 hora
        await redisClient.setEx(`order:${trackingNumber}`, 3600, JSON.stringify(order));
    
        return order;
    }

    async updateStatus(orderId: string, status: "EN ESPERA" | "ASIGNADO" | "EN RUTA" | "ENTREGADO"): Promise<void> {
        await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    }
    async create(order: Order): Promise<Order> {
        const connection = await pool.getConnection();

        try {
            await connection.execute(
                `INSERT INTO orders (id, user_id, tracking_number, sender_name, recipient_name, sender_address, 
            recipient_address, height, width, length, weight, product_type, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    order.id,
                    order.userId,
                    order.trackingNumber,
                    order.senderName,
                    order.recipientName,
                    order.senderAddress,
                    order.recipientAddress,
                    order.height,
                    order.width,
                    order.length,
                    order.weight,
                    order.productType,
                    order.status,
                ]
            );
            return order;
        } finally {
            connection.release();
        }
    }
}