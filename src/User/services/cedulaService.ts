// CONTEXT: Por ahora lo dejamos como servicio pq en un futuro esto deberia usar una API del gobierno.

export const validateCedulaService = (cedula: string) => {
    // Eliminar espacios y guiones
    cedula = cedula.replace(/[- ]/g, "");

    // Verificar longitud
    if (cedula.length !== 11) {
        return false;
    }

    // Verificar que solo contenga dígitos
    if (!/^\d+$/.test(cedula)) {
        return false;
    }

    // Obtener dígitos
    const digitos = cedula.split("").map(Number);
    const digitoVerificador = digitos.pop(); // Último dígito es el verificador

    // Calcular dígito verificador esperado
    let suma = 0;
    for (let i = 0; i < 10; i++) {
        let peso = (i % 2 === 0) ? 1 : 2;
        let producto = digitos[i] * peso;
        suma += (producto > 9) ? (producto - 9) : producto;
    }
    const digitoEsperado = (10 - (suma % 10)) % 10;

    // Validar dígito verificador
    return digitoVerificador === digitoEsperado;
}
