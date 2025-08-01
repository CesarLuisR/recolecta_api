export default function verificarTelefono(numero: string): boolean {
    numero = numero.replace(/[- ]/g, "");

    const regex = /^\+?\d{10,11}$/;
    return regex.test(numero);
}