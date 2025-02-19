/**
 * Genera un número de guía único basado en la fecha y un código aleatorio.
 * @returns {string} Número de guía único
 */
export function generateTrackingNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2); // Últimos 2 dígitos del año
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Mes con 2 dígitos
  const day = String(date.getDate()).padStart(2, "0"); // Día con 2 dígitos
  const hour = String(date.getHours()).padStart(2, "0"); // Hora
  const minute = String(date.getMinutes()).padStart(2, "0"); // Minuto
  const second = String(date.getSeconds()).padStart(2, "0"); // Segundo

  // Código aleatorio: 3 letras + 4 números
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array.from({ length: 3 })
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join("");
  const randomNumbers = String(Math.floor(1000 + Math.random() * 9000)); // 4 dígitos aleatorios

  // Ensamblar el número de guía
  return `ENV-${year}${month}${day}${hour}${minute}${second}-${randomLetters}${randomNumbers}`;
}