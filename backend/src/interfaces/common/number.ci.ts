import { z } from 'zod';

const numberZod = z.number().min(1).positive().or(z.string().pipe(z.coerce.number()));
export default numberZod;
