-- CreateTable
CREATE TABLE "public"."libro" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "anioPublicacion" INTEGER NOT NULL,
    "prestado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "libro_pkey" PRIMARY KEY ("id")
);
