/*
  Warnings:

  - A unique constraint covering the columns `[isbn]` on the table `libro` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."libro" ADD COLUMN     "edicion" TEXT,
ADD COLUMN     "editorial" TEXT,
ADD COLUMN     "isbn" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "libro_isbn_key" ON "public"."libro"("isbn");
