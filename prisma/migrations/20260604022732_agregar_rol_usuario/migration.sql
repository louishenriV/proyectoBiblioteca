-- CreateEnum
CREATE TYPE "public"."Rol" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "public"."usuario" ADD COLUMN     "rol" "public"."Rol" NOT NULL DEFAULT 'user';
