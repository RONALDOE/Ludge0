import { z } from "zod";

const zodObjectId = z.string().refine(() => true, {
  message: "Invalid ObjectId",
});

export default zodObjectId;
