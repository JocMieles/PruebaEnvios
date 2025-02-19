import axios from "axios";
import { config } from "../../config/environment";

export class GoogleMapsService {
  /**
   * Valida si una dirección sigue el formato correcto y si existe en Google Maps.
   * @param address Dirección a validar
   * @returns {Promise<boolean>} True si la dirección es válida, False si es incorrecta
   */

  static normalizeAddress(address: string): string {
    return address
      .toLowerCase()
      // Normalización de tipos de vía con espacio después del punto
      .replace(/\b(calle|cll|cl\.)\b/g, "cl. ") // Calle
      .replace(/\b(carrera|cra\.|cra|cr\.)\b/g, "cra. ") // Carrera
      .replace(/\b(diagonal|diag|dg\.)\b/g, "dg. ") // Diagonal
      .replace(/\b(transversal|trans\.|tr\.)\b/g, "tv. ") // Transversal
      .replace(/\b(avenida|av\.|avda)\b/g, "av. ") // Avenida
      .replace(/\b(autopista|aut\.)\b/g, "aut. ") // Autopista
      .replace(/\b(paseo|pso\.)\b/g, "pso. ") // Paseo
      .replace(/\b(circunvalar|circ\.)\b/g, "circ. ") // Circunvalar
      .replace(/\b(troncal|tr\.)\b/g, "tr. ") // Troncal
      .replace(/\b(vía|via|v\.)\b/g, "via ") // Vía
      .replace(/\b(carretera|ctra\.)\b/g, "ctra. ") // Carretera
      .replace(/\b(anillo vial|anillo)\b/g, "anillo ") // Anillo Vial

      // Nomenclatura adicional
      .replace(/\b(norte|nte)\b/g, "nte. ") // Norte
      .replace(/\b(sur)\b/g, "sur. ") // Sur
      .replace(/\b(este)\b/g, "este. ") // Este
      .replace(/\b(oeste)\b/g, "oeste. ") // Oeste
      .replace(/\b(bis)\b/g, "bis ") // Bis (cuando aplica en direcciones)

      // Edificios y apartamentos
      .replace(/\b(interior|int\.)\b/g, "int. ") // Interior
      .replace(/\b(bloque|bloq\.)\b/g, "bloq. ") // Bloque
      .replace(/\b(manzana|mz\.)\b/g, "mz. ") // Manzana
      .replace(/\b(torre|tr\.|t\.)\b/g, "tr. ") // Torre
      .replace(/\b(apartamento|apto\.|apto|apt)\b/g, "apto. ") // Apartamento
      .replace(/\b(oficina|of\.)\b/g, "of. ") // Oficina
      .replace(/\b(local|loc\.)\b/g, "loc. ") // Local
      .replace(/\b(piso|ps\.)\b/g, "piso ") // Piso
      .replace(/\b(lateral|lat\.)\b/g, "lat. ") // Lateral

      // Espacios innecesarios
      .replace(/\s+/g, " ") // Reemplaza múltiples espacios por un solo espacio
      .replace(/\s?#\s?/g, " #") // Asegura un espacio antes del numeral (#)
      .replace(/\.{2,}/g, ".") // 🔹 Reemplaza múltiples puntos por un solo punto
      .trim(); // Elimina espacios en blanco al inicio y al final
}
  
  static async validateAddress(address: string): Promise<boolean> {
    try {
      // Expresión regular para validar el formato de la dirección
      const normalizedInputAddress = this.normalizeAddress(address);
      const addressPattern = new RegExp(
        "^(calle|cll\\.|cra\\.|cr\\.|carrera|diagonal|diag\\.|dg\\.|transversal|trans\\.|tv\\.|avenida|av\\.|avda|autopista|aut\\.|paseo|pso\\.|circunvalar|circ\\.|troncal|tr\\.|vía|via|v\\.|carretera|ctra\\.|anillo vial|anillo)" +
        "^(?:\\calle|cll\\.|cra\\.|cr\\.|carrera|diagonal|diag\\.|dg\\.|transversal|trans\\.|tv\\.|avenida|av\\.|avda|autopista|aut\\.|paseo|pso\\.|circunvalar|circ\\.|troncal|tr\\.|vía|via|v\\.|carretera|ctra\\.|anillo vial|anillo)?"+
        "(?:\\s[a-záéíóú]+(?:\\s[a-záéíóú]+)*)?" + // Permite nombres largos como "Circunvalar"
        "\\s?#?\\d+[a-zA-Z]?\\s?-\\s?\\d+" +        // Nomenclatura obligatoria (#74-103)
        "\\s?(sur|norte|este|oeste)?" +             // Dirección opcional (Sur, Norte, Este, Oeste)
        ",\\s?[A-ZÁÉÍÓÚ][a-záéíóú]+(?:\\s[A-ZÁÉÍÓÚ][a-záéíóú]+)*(?:,\\s?[A-ZÁÉÍÓÚ][a-záéíóú]+)?$", // Ciudad + país opcional
        "i"
      );

    //   if (!addressPattern.test(normalizedInputAddress)) {
    //     console.error("❌ Dirección inválida: No cumple con el formato esperado.");
    //     return false;
    //   }

      // Llamar a la API de Google Maps para validar la dirección
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address,
            key: config.GOOGLE_MAPS_API_KEY,
          },
        }
      );

      // Si la API no devuelve resultados, la dirección es inválida
      if (response.data.status !== "OK") {
        console.error("❌ Dirección no encontrada en Google Maps.");
        return false;
      }

      // Extraer dirección devuelta por Google Maps
      const formattedAddress = response.data.results[0].formatted_address;
      const normalizedGoogleAddress = this.normalizeAddress(formattedAddress);

      console.log("📌 Dirección normalizada ingresada:", normalizedInputAddress);
      console.log("📌 Dirección normalizada Google Maps:", normalizedGoogleAddress);

      // Comparar la dirección ingresada con la devuelta
      if (!this.compareAddresses(normalizedInputAddress, normalizedGoogleAddress)) {
        console.error("❌ Dirección no coincide con la encontrada en Google Maps.");
        return false;
      }

      console.log("✅ Dirección válida:", formattedAddress);
      return true;
    } catch (error) {
      console.error("⚠️ Error validando la dirección en Google Maps:", error);
      return false;
    }
  }
  static compareAddresses(input: string, google: string): boolean {
    // 🔹 Reemplazar comas por espacios y eliminar espacios extra
    const cleanInput = input.replace(/,/g, "").trim();
    const cleanGoogle = google.replace(/,/g, "").trim();
  
    // 🔹 Dividir por uno o más espacios
    const inputParts = cleanInput.split(/\s+/);
    const googleParts = cleanGoogle.split(/\s+/);
  
    console.log("📌 Partes procesadas de Input:", inputParts);
    console.log("📌 Partes procesadas de Google:", googleParts);
  
    return inputParts.every((part) => googleParts.includes(part));
  }
}