import { v } from "convex/values";
import { internalAction } from "../../_generated/server";

export const registerEmail = internalAction({
  args: {
    email: v.string(),
    nome: v.string(),
    matricula: v.string(),
  },
  handler: async (_ctx, args) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LaBiblio <onboarding@wgprojects.site>",
        to: args.email,
        subject: "Cadastro realizado!",
        html: `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cadastro realizado</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#ffffff; border-radius:8px; overflow:hidden;">
            <tr>
              <td style="background-color:#1f2937; padding:24px 32px;">
                <span style="color:#ffffff; font-size:18px; font-weight:600;">LaBiblio</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px; color:#111827; font-size:20px;">Cadastro realizado!</h1>
                <p style="margin:0 0 8px; color:#374151; font-size:15px; line-height:1.5;">
                  Olá, <strong>${args.nome}</strong>!
                </p>
                <p style="margin:0 0 24px; color:#374151; font-size:15px; line-height:1.5;">
                  Seu cadastro foi concluído com sucesso. Sua matrícula é
                  <strong>${args.matricula}</strong>.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:6px; background-color:#2563eb;">
                      <a href="https://la-biblio.vercel.app/" style="display:inline-block; padding:12px 24px; color:#ffffff; font-size:15px; font-weight:600; text-decoration:none;">
                        Acessar plataforma
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0; color:#9ca3af; font-size:12px; line-height:1.5;">
                  Se você não reconhece este cadastro, ignore este e-mail.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
      }),
    });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        "Falha ao enviar e-mail via Resend:",
        res.status,
        errorBody,
      );
      throw new Error(`Resend API retornou ${res.status}`);
    }
  },
});
