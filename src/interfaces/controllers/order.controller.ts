import {Response } from "express";
import { OrderMySQLRepository } from "../../infrastructure/database/order.mysql.repository";
import { CreateOrderUseCase } from "../../application/order/create-order.usecase";
import { AuthenticatedRequest } from "../types/express";
import { TrackingRepository } from "../../infrastructure/cache/tracking.repository";

const orderRepository = new OrderMySQLRepository();
const createOrderUseCase = new CreateOrderUseCase(orderRepository);
const trackingRepository = new TrackingRepository();

export default class OrderController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { senderName, recipientName, senderAddress, recipientAddress, height, width, length, weight, productType } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (!req.user || req.user.role !== "user") {
        return res.status(403).json({ error: "Acceso denegado, solo usuarios pueden crear ordenes" });
      }

      const order = await createOrderUseCase.execute(
        userId, senderName, recipientName, senderAddress, recipientAddress, height, width, length, weight, productType
      );

      res.status(201).json({ message: "Orden creada", order });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getOrderByTrackingNumber(req: AuthenticatedRequest, res: Response) {
    const { trackingNumber } = req.params;
    const userRole = req.user?.role; 

    if (userRole !== "user") {
      return res.status(403).json({ message: "Solo los usuarios pueden ver sus órdenes." });
    }

    let order = await trackingRepository.getCachedOrder(trackingNumber);
    if (!order) {
      order = await orderRepository.findByTrackingNumber(trackingNumber);
      if (!order) return res.status(404).json({ message: "Orden no encontrada." });

      await trackingRepository.cacheOrder(order);
    }

    res.json(order);
  }
}