import process from "node:process";

const required = [
  "VITE_YNX_API_BASE_URL",
  "VITE_YNX_EVM_RPC_URL",
  "VITE_YNX_EXPLORER_URL",
  "VITE_YNX_FAUCET_URL",
  "VITE_YNX_DOCS_URL"
];

const publicUrlKeys = new Set([
  "VITE_YNX_API_BASE_URL",
  "VITE_YNX_EVM_RPC_URL",
  "VITE_YNX_EXPLORER_URL",
  "VITE_YNX_FAUCET_URL"
]);

let failed = false;
for (const key of required) {
  const value = process.env[key] || "";
  const lowered = value.toLowerCase();
  if (!value) {
    console.error(`Missing required env: ${key}`);
    failed = true;
  }
  if (lowered.includes("placeholder") || lowered.includes("changeme") || lowered.includes("your_key_here") || lowered.includes("example.com")) {
    console.error(`Unsafe env value: ${key}`);
    failed = true;
  }
  if (publicUrlKeys.has(key) && value) {
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "https:") throw new Error("not https");
    } catch {
      console.error(`Expected an HTTPS URL: ${key}`);
      failed = true;
    }
  }
  if (key === "VITE_YNX_DOCS_URL" && value && !value.startsWith("/")) {
    console.error("VITE_YNX_DOCS_URL must be an in-site path");
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("website deployment env check passed");
