const { prisma } = require("../db/prisma");
const { getAuthStartUrl, exchangeCodeForToken } = require("../services/qbo.service");
const { HttpError, http } = require("../utils/http");

// GET /auth/qbo/start
async function authStart(_req, res) {
  return res.redirect(getAuthStartUrl("xyz")); // TODO: add CSRF-safe state
}

async function authCallback(req, res) {
  const { code, realmId } = req.query;
  if (!code || !realmId) throw new HttpError(http.BAD_REQUEST, "Missing code/realmId");

  const token = await exchangeCodeForToken(code);
  const expiresAt = new Date(Date.now() + (token.expires_in - 60) * 1000);

  const existing = await prisma.oAuthState.findFirst();
  if (existing) {
    await prisma.oAuthState.update({
      where: { id: existing.id },
      data: {
        realmId,
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        tokenExpiresAt: expiresAt,
      },
    });
  } else {
    await prisma.oAuthState.create({
      data: {
        realmId,
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        tokenExpiresAt: expiresAt,
      },
    });
  }
  return res.send("QuickBooks connected. You can close this tab.");
}

// GET /auth/qbo/state
async function qboState(_req, res) {
  const row = await prisma.oAuthState.findFirst();
  if (!row) return res.json({ connected: false, reason: "no_tokens" });
  const msLeft = new Date(row.tokenExpiresAt) - Date.now();
  return res.json({ connected: msLeft > 0, realmId: row.realmId, accessTokenExpiresAt: row.tokenExpiresAt });
}

module.exports = { authStart, authCallback, qboState };
