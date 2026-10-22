-- Home warranty leads: the property the plan would cover (mirrors Vehicle for auto leads).
-- Lead.line now defaults to "vsc" (auto warranty); "home" is the home warranty line.
ALTER TABLE "Lead" ALTER COLUMN "line" SET DEFAULT 'vsc';

CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "homeType" TEXT NOT NULL,
    "squareFeet" INTEGER NOT NULL,
    "yearBuilt" INTEGER NOT NULL,
    "ownership" TEXT NOT NULL,
    "existingWarranty" TEXT NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Property_leadId_idx" ON "Property"("leadId");

ALTER TABLE "Property" ADD CONSTRAINT "Property_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
