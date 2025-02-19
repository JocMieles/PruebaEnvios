import { IOrderRepository } from "../../domain/repositories/order.repository";
import { Order } from "../../domain/entities/order.entity";
import { GoogleMapsService } from "../../infrastructure/external/google-maps.service";
import { randomUUID } from "crypto";
import { generateTrackingNumber } from "../../shared/utils";
import { redisClient } from "../../infrastructure/cache/redis.config";

export class CreateOrderUseCase {
    constructor(private orderRepository: IOrderRepository) { }

    async execute(
        userId: string,
        senderName: string,
        recipientName: string,
        senderAddress: string,
        recipientAddress: string,
        height: number,
        width: number,
        length: number,
        weight: number,
        productType: string
    ): Promise<Order> {

        if (senderName.trim().toLowerCase() === recipientName.trim().toLowerCase()) {
            throw new Error("El remitente y el destinatario no pueden ser la misma persona.");
        }
        if (senderAddress.trim().toLowerCase() === recipientAddress.trim().toLowerCase()) {
            throw new Error("La dirección de origen y destino no pueden ser iguales.");
        }
        const isOriginValid = await GoogleMapsService.validateAddress(senderAddress.toLocaleLowerCase());
        const isDestinationValid = await GoogleMapsService.validateAddress(recipientAddress.toLocaleLowerCase());

        if (!isOriginValid || !isDestinationValid) {
            throw new Error("Una o ambas direcciones son inválidas");
        }

        const trackingNumber = generateTrackingNumber();

        const newOrder = new Order(
            randomUUID(),
            userId,
            trackingNumber,
            senderName,
            recipientName,
            senderAddress,
            recipientAddress,
            height,
            width,
            length,
            weight,
            productType
        );

        const orderCreated = await this.orderRepository.create(newOrder);
        await redisClient.setEx(`order:${trackingNumber}`, 3600, JSON.stringify(newOrder));
        return orderCreated;
    }
}