-- AlterTable
ALTER TABLE "public"."libro" ADD COLUMN     "usuarioId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."libro" ADD CONSTRAINT "libro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
