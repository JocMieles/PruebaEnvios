export class Order {
    constructor(
        public id: string,
        public userId: string,
        public trackingNumber: string,
        public senderName: string,
        public recipientName: string,
        public senderAddress: string,
        public recipientAddress: string,
        public height: number,
        public width: number,
        public length: number,
        public weight: number,
        public productType: string,
        public status: "EN ESPERA" | "ASIGNADO" | "EN RUTA" | "ENTREGADO" = "EN ESPERA",
        public createdAt: Date = new Date()
    ) { }
}