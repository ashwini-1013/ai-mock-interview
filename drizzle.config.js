/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url:"postgresql://ai-mock-interview_owner:tkqHEN7V2aTs@ep-tight-hall-a5qffyy2.us-east-2.aws.neon.tech/ai-mock-interview?sslmode=require",
  }
};

