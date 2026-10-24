// The online Studio this plugin works with, in one place for its scripts: its API, which the scripts call, and the
// Studio itself, where a preview opens. TF_STUDIO_API and TF_STUDIO_ADMIN name another. The MCP server's address in
// .mcp.json repeats the API's, as JSON can't import it.

/** The online Studio, which every setting falls back to. */
export const ONLINE = {
  api: 'https://website-studio-api.vercel.app',
  admin: 'https://website-studio-admin.vercel.app',
};
