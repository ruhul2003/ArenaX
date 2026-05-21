import { auth } from "@/lib/auth"; // Double check this matches your actual auth file path
import { toNextJsHandler } from "better-auth/next-js";

// Option A: If using the default built-in object mapping
export const { GET, POST } = toNextJsHandler(auth);