import type { FastifyReply, FastifyRequest } from "fastify";

import { supabase } from "../infra/supabase.js";

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return reply.code(401).send({
      message: "Token de autenticação não informado.",
    });
  }

  const token = authorization.substring(7);

  const { data, error } = await supabase.auth.getUser(token);

  console.log("[AUTH] Resultado Supabase:", {
    message: error?.message,
    status: error?.status,
    code: error?.code,
    userId: data.user?.id,
  });

  if (error || !data.user) {
    return reply.code(401).send({
      message: "Token inválido ou expirado.",
    });
  }

  if (data.user.app_metadata?.role !== "admin") {
    return reply.code(403).send({
      message: "Você não possui permissão administrativa.",
    });
  }
}
