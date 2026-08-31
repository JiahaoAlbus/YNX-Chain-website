import { economicEvidence } from "../../src/lib/economicsEvidence.js";

export default function handler(_request, response) {
  response.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.status(200).json(economicEvidence);
}
