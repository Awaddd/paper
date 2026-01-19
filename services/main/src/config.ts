import dotenv from "dotenv";
import Replicate from "replicate";
import z from "zod";

dotenv.config({ path: "../../.env" });

const EnvSchema = z.object({
	REPLICATE_API_TOKEN: z.string(),
});

export const env = EnvSchema.parse(process.env);

export const replicate = new Replicate({
	auth: env.REPLICATE_API_TOKEN,
});
