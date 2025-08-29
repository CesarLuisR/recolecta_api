import { Usuario } from "../../../types/User";
import { NotFoundError, UnauthorizedError } from "../../../utils/error";
import MagicLinkRepository, { MagicLinkI } from "../repositories/magicLinkRepository";
import * as clienteRepository from "../../Usuarios/repositories/clienteRepository";

export const magicLinkService = async (user_id: number): Promise<MagicLinkI> => {
    const magicData: MagicLinkI | null = await MagicLinkRepository.create(user_id);

    if (!magicData)
            throw new NotFoundError();

    return magicData;
};

export const magicConsumeService = async (id: string): Promise<Usuario> => {
    const isUsed = await MagicLinkRepository.isUsedLink(id);
    if (isUsed)
        throw new UnauthorizedError("USED");

    const data = await MagicLinkRepository.getNotExpired(id);
    if (!data)
        throw new UnauthorizedError("EXPIRED");

    await MagicLinkRepository.setUsed(id);

    const user = await clienteRepository.setClienteVerificacion(data.user_id);
    if (!user) throw new NotFoundError();

    return user;
}

export const consumeUsedMagicLink = async (id: string): Promise<Usuario> => {
    const isUsedLink = await MagicLinkRepository.getUsedLink(id);
    if (!isUsedLink)
        throw new UnauthorizedError("Link no encontrado");

    const data = await MagicLinkRepository.getNotExpired(id);
    if (!data)
        throw new UnauthorizedError("EXPIRED");

    const user = await clienteRepository.setClienteVerificacion(data.user_id);
    if (!user) throw new NotFoundError();

    return user;
}