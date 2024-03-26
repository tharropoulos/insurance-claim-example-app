import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

const createClaimSchema = z.object({
    policy_number: z.string(),
    date_of_accident: z.date(),
    accident_type: z.string(),
    description: z.string(),
    damage_details: z.string(),
    injuries_reported: z.boolean().default(false),
    images: z
        .array(z.instanceof(File))
        .refine(
            (files) =>
                files.every(
                    (file) =>
                        file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type),
                ),
            {
                message: "Only .jpeg, .jpg, .png files of 2MB or less are accepted",
            },
        ),
});

const createClaimDTO = createClaimSchema.extend({
    images: z.record(z.instanceof(File)),
});

const getClaimDTO = createClaimSchema.extend({
    id: z.number(),
    user_id: z.number(),
    author: z.number(),
    images: z.array(z.number()),
    date_of_accident: z.string(),
});

export { createClaimSchema, createClaimDTO, getClaimDTO };
