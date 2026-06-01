/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `libro` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."libro" DROP CONSTRAINT "libro_usuarioId_fkey";

-- AlterTable
ALTER TABLE "public"."libro" DROP COLUMN "usuarioId";

-- CreateTable
CREATE TABLE "public"."prestamo" (
    "id" TEXT NOT NULL,
    "fechaPrestamo" TIMESTAMP(3) NOT NULL,
    "fechaDevolucion" TIMESTAMP(3),
    "libroId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "prestamo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."prestamo" ADD CONSTRAINT "prestamo_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "public"."libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prestamo" ADD CONSTRAINT "prestamo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
