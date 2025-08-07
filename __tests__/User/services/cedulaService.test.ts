import { validateCedulaService } from '../../../src/User/services/cedulaService';

describe('validateCedulaService', () => {
  it('debería retornar true para una cédula válida', () => {
    // Ejemplo de cédula válida (puedes cambiar por alguna válida real)
    const validCedula = '40210858771';
    expect(validateCedulaService(validCedula)).toBe(true);
  });

  it('debería retornar true para cédula con espacios y guiones', () => {
    const cedula = '402-1085877-1';
    expect(validateCedulaService(cedula)).toBe(true);
  });

  it('debería retornar false si la longitud es distinta de 11', () => {
    expect(validateCedulaService('123456789')).toBe(false);
    expect(validateCedulaService('123456789012')).toBe(false);
  });

  it('debería retornar false si contiene caracteres no numéricos', () => {
    expect(validateCedulaService('1234567a890')).toBe(false);
    expect(validateCedulaService('1234-567*890')).toBe(false);
  });

  it('debería retornar false si el dígito verificador es incorrecto', () => {
    // Cambiamos el último dígito para invalidar
    const invalidCedula = '00113918257'; // último dígito cambiado
    expect(validateCedulaService(invalidCedula)).toBe(false);
  });
});
