import { IOrderRepository } from "../../domain/repositories/order.repository";
import { ITransporterRepository } from "../../domain/repositories/transporter.repository";

export class AssignOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private transporterRepository: ITransporterRepository
  ) {}

  async execute(trackingNumber: string, transporterId: string): Promise<void> {
    const order = await this.orderRepository.findByTrackingNumber(trackingNumber);
    if (!order) throw new Error("Orden no encontrada");

    // Buscar transportadores disponibles en la ciudad de origen con destino correcto y espacio suficiente
    const transporters = await this.transporterRepository.findAvailableTransporters(
      order.senderAddress, 
      order.recipientAddress, 
      order.height * order.width * order.length
    );

    // Validar si el transportador existe y tiene espacio suficiente
    const transporter = transporters.find(t => t.id === transporterId);
    if (!transporter) {
      throw new Error("El transportador no está disponible o no tiene espacio suficiente.");
    }

    // Asignar la orden al transportador
    await this.orderRepository.updateStatus(order.id, "ASIGNADO");
    await this.transporterRepository.assignOrder(transporterId, order.id);

    // Restar espacio utilizado en el transportador
    const newAvailableSpace = transporter.availableSpace - (order.height * order.width * order.length);
    await this.transporterRepository.findAvailableTransporters(
      order.senderAddress, 
      order.recipientAddress, 
      order.height * order.width * order.length
    );
  }
}