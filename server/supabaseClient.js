import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const baseOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
};

export const supabaseAnon = createClient(
  supabaseUrl,
  supabaseAnonKey,
  baseOptions,
);

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  baseOptions,
);

export const createUserClient = (accessToken = "") =>
  createClient(supabaseUrl, supabaseAnonKey, {
    ...baseOptions,
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

export const createAnonClient = () =>
  createClient(supabaseUrl, supabaseAnonKey, baseOptions);

export const supabaseConfigReady =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export const supabaseAdminReady = Boolean(supabaseServiceRoleKey);
