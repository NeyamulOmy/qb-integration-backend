// Encapsulates QBO OAuth/token logic and base URL selection
const axios = require("axios");
const qs = require("querystring");
const { prisma } = require("../db/prisma");
const { env } = require("../config/env");

const TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
const AUTH_URL = "https://appcenter.intuit.com/connect/oauth2";

function basicAuth() {
  return "Basic " + Buffer.from(`${env.QBO_CLIENT_ID}:${env.QBO_CLIENT_SECRET}`).toString("base64");
}

function getAuthStartUrl(state = "xyz") {
  const scopes = ["com.intuit.quickbooks.accounting"].join(" ");
  const u = new URL(AUTH_URL);
  u.searchParams.set("client_id", env.QBO_CLIENT_ID);
  u.searchParams.set("scope", scopes);
  u.searchParams.set("redirect_uri", env.QBO_REDIRECT_URL);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("state", state);
  return u.toString();
}

async function exchangeCodeForToken(code) {
  const body = qs.stringify({ grant_type: "authorization_code", code, redirect_uri: env.QBO_REDIRECT_URL });
  const { data } = await axios.post(TOKEN_URL, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: basicAuth() },
  });
  return data; // { access_token, refresh_token, expires_in, ... }
}

async function refreshAccessToken(refreshToken) {
  const body = qs.stringify({ grant_type: "refresh_token", refresh_token: refreshToken });
  const { data } = await axios.post(TOKEN_URL, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: basicAuth() },
  });
  return data;
}

function apiBase(realmId) {
  const host = env.QBO_ENV === "production"
    ? "https://quickbooks.api.intuit.com"
    : "https://sandbox-quickbooks.api.intuit.com";
  return `${host}/v3/company/${realmId}`;
}

/** Returns OAuth row with a valid access token (refreshes if needed). */
async function getValidToken() {
  const row = await prisma.oAuthState.findFirst();
  if (!row) return null;

  // still valid? (30s buffer)
  if (new Date(row.tokenExpiresAt) > new Date(Date.now() + 30_000)) return row;

  // refresh
  const data = await refreshAccessToken(row.refreshToken);
  const expiresAt = new Date(Date.now() + (data.expires_in - 60) * 1000);
  return prisma.oAuthState.update({
    where: { id: row.id },
    data: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? row.refreshToken,
      tokenExpiresAt: expiresAt,
    },
  });
}

module.exports = {
  getAuthStartUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  apiBase,
  getValidToken,
};
