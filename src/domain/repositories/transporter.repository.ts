import { Transporter } from "../entities/transporter.entity";

export interface ITransporterRepository {
  findAvailableTransporters(city: string, destination: string, requiredSpace: number): Promise<Transporter[]>;
  assignOrder(transporterId: string, orderId: string): Promise<void>;
}