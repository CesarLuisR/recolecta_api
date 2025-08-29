import { pool } from "../../../src/database";
import AuthRepository from "../../../src/User/repository/authRepository";
import * as authQueries from "../../../src/User/repository/authModel";
import { SignUpData } from "../../../src/types/auth";
import { User } from "../../../src/types/user";

jest.mock("../../../src/database", () => ({
  pool: { query: jest.fn() }
}));

describe("AuthRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getMunicipiosBySlug", () => {
    it("devuelve null si no encuentra municipio", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

      const result = await AuthRepository.getMunicipiosBySlug("no-existe");
      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(authQueries.getMunicipioBySlug, ["no-existe"]);
    });

    it("devuelve el id si encuentra municipio", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 15 }]
      });

      const result = await AuthRepository.getMunicipiosBySlug("santiago");
      expect(result).toBe(15);
    });
  });

  describe("createUser", () => {
    const mockData: SignUpData = {
      nombre: "Juan",
      apellido: "Pérez",
      cedula: "001-1234567-8",
      email: "test@example.com",
      password: "securePass123",
      municipio_id: 1
    };


    it("devuelve null si no se crea", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

      const result = await AuthRepository.createUser(mockData, "10");
      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        authQueries.createUser,
        ["Juan", "Pérez", "001-1234567-8", "test@example.com", "cliente", "10"]
      );
    });

    it("devuelve el usuario creado", async () => {
      const user: User = {
          id: 1,
          nombre: "Juan",
          apellido: "Pérez",
          email: "test@example.com",
          cedula: "001-1234567-8",
          tipo_usuario: "cliente",
          municipio_id: 10,
          password_hash: "",
          creado_en: new Date(),
          verified: false
      };
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [user]
      });

      const result = await AuthRepository.createUser(mockData, "10");
      expect(result).toEqual(user);
    });
  });

  describe("setUserStatus", () => {
    it("devuelve null si no actualiza", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

      const result = await AuthRepository.setUserStatus(1);
      expect(result).toBeNull();
    });

    it("devuelve usuario actualizado", async () => {
      const updatedUser: User = {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        email: "test@example.com",
        cedula: "001-1234567-8",
        tipo_usuario: "cliente",
        municipio_id: 10,
        verified: true,
        password_hash: "",
        creado_en: new Date()
      };

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [updatedUser]
      });

      const result = await AuthRepository.setUserStatus(1);
      expect(result).toEqual(updatedUser);
    });
  });

  describe("getUserSession", () => {
    it("devuelve null si no hay sesión", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

      const result = await AuthRepository.getUserSession(1);
      expect(result).toBeNull();
    });

    it("devuelve session_id si existe", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ session_id: "abc-123" }]
      });

      const result = await AuthRepository.getUserSession(1);
      expect(result).toBe("abc-123");
    });
  });
});
