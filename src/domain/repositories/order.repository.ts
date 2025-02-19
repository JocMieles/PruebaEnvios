import { Order } from "../entities/order.entity";

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findByTrackingNumber(trackingNumber: string): Promise<Order | null>; // Buscar por número de guía
  updateStatus(orderId: string, status: "EN ESPERA" | "ASIGNADO" | "EN RUTA" | "ENTREGADO"): Promise<void>;
}