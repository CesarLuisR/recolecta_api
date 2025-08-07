import AuthRepository from "../../../src/User/repository/authRepository";
import { NotFoundError } from "../../../src/utils/error";

jest.mock("../../../src/database", () => ({
  pool: {
    query: jest.fn()
  }
}));

import { pool } from "../../../src/database";

const mockQuery = pool.query as jest.Mock;

describe("AuthRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getMunicipiosBySlug", () => {
    it("retorna el id si existe", async () => {
      mockQuery.mockResolvedValue({
        rowCount: 1,
        rows: [{ id: 10 }],
      });

      const id = await AuthRepository.getMunicipiosBySlug("santiago");
      expect(pool.query).toHaveBeenCalled();
      expect(id).toBe(10);
    });

    it("lanza NotFoundError si no existe", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: []
      });

      await expect(AuthRepository.getMunicipiosBySlug("falso"))
        .rejects
        .toBeInstanceOf(NotFoundError);
    });
  });

  describe("createUser", () => {
    const data = {
      nombre: "Juan",
      apellido: "Perez",
      cedula: "00100000001",
      email: "juan@gmail.com",
    };

    it("crea usuario y devuelve su row", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{ id: 1, ...data, tipo_usuario: "cliente" }]
      });

      const user = await AuthRepository.createUser(data as any, "12");
      expect(pool.query).toHaveBeenCalled();
      expect(user).toMatchObject({ id: 1, email: "juan@gmail.com" });
    });

    it("lanza Error si rowCount = 0", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: []
      });

      await expect(AuthRepository.createUser(data as any, "12"))
        .rejects
        .toThrow(Error);
    });
  });

  describe("setUserStatus", () => {
    it("devuelve el usuario actualizado si existe", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{ id: 1, verified: true }]
      });

      const result = await AuthRepository.setUserStatus(1);
      expect(result.verified).toBe(true);
    });

    it("lanza NotFoundError si no existe", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: []
      });

      await expect(AuthRepository.setUserStatus(1))
        .rejects
        .toBeInstanceOf(NotFoundError);
    });
  });

  describe("getUserSession", () => {
    it("devuelve el session_id si existe", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{ session_id: "abc-123" }]
      });

      const id = await AuthRepository.getUserSession(5);
      expect(id).toBe("abc-123");
    });

    it("lanza NotFoundError si rowCount=0", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: []
      });

      await expect(AuthRepository.getUserSession(99))
        .rejects
        .toBeInstanceOf(NotFoundError);
    });
  });
});
