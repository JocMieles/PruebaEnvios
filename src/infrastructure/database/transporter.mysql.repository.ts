import { Transporter } from "../../domain/entities/transporter.entity";
import { ITransporterRepository } from "../../domain/repositories/transporter.repository";
import pool from "./mysql.config";

export class TransporterMySQLRepository implements ITransporterRepository {
    async findAvailableTransporters(city: string, destination: string, requiredSpace: number): Promise<Transporter[]> {
        const [rows]: any = await pool.query(
            "SELECT * FROM transporters WHERE currentCity = ? AND destinationCity = ? AND availableSpace >= ?",
            [city, destination, requiredSpace]
        );
        return rows.map((transporter: any) => new Transporter(transporter.id, transporter.name, transporter.availableSpace, transporter.originCity, transporter.destinationCity, transporter.currentCity));
    }

    async assignOrder(transporterId: string, orderId: string): Promise<void> {
        await pool.query("UPDATE orders SET status = 'ASIGNADO', transporter_id = ? WHERE id = ?", [transporterId, orderId]);
    }

    async updateAvailableSpace(transporterId: string, newSpace: number): Promise<void> {
        await pool.query("UPDATE transporters SET availableSpace = ? WHERE id = ?", [newSpace, transporterId]);
    }
}