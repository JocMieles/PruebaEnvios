export class Transporter {
    constructor(
        public id: string,
        public name: string,
        public availableSpace: number, // En cm³
        public originCity: string,
        public destinationCity: string,
        public currentCity: string,
    ) { }
}
