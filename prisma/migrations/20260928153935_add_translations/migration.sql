-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sourceHash" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "translations_entity_locale_idx" ON "translations"("entity", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "translations_entity_entityId_field_locale_key" ON "translations"("entity", "entityId", "field", "locale");
