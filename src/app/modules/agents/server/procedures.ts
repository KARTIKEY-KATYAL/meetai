import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schemas";
import {string, z} from "zod"
import { eq } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    // Change getMany to use 'ProtectedProcedure'
    getOne: protectedProcedure.input(z.object({id : string()})).query(async ({input}) => {
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, input.id))
        // throw new TRPCError({"code" : "BAD_REQUEST"})

        return existingAgent;
    }),
    getMany: protectedProcedure.query(async () => {
        const data = await db
            .select()
            .from(agents)

        // throw new TRPCError({"code" : "BAD_REQUEST"})

        return data;
    }),
    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id
                })
                .returning()

        })
})