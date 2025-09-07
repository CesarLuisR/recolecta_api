import { Usuario } from "../../../types/Usuario";
import { NotFoundError, UnauthorizedError } from "../../../utils/error";
import MagicLinkRepository, { MagicLinkI } from "../repositories/magicLinkRepository";

export const magicLinkService = async (user_id: number): Promise<MagicLinkI> => {
    const magicData: MagicLinkI | null = await MagicLinkRepository.create(user_id);

    if (!magicData)
        throw new NotFoundError();

    return magicData;
};

export const magicConsumeService = async (id: string): Promise<MagicLinkI> => {
    const isUsed = await MagicLinkRepository.isUsedLink(id);
    if (isUsed)
        throw new UnauthorizedError("USED");

    const data = await MagicLinkRepository.getNotExpired(id);
    if (!data)
        throw new UnauthorizedError("EXPIRED");

    await MagicLinkRepository.setUsed(id);
    return data;
}

export const consumeUsedMagicLink = async (id: string): Promise<MagicLinkI> => {
    const isUsedLink = await MagicLinkRepository.getUsedLink(id);
    if (!isUsedLink)
        throw new UnauthorizedError("Link no encontrado");

    const data = await MagicLinkRepository.getNotExpired(id);
    if (!data)
        throw new UnauthorizedError("EXPIRED");

    return data;
}