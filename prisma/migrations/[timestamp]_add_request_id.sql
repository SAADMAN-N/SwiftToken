-- First make the column nullable
ALTER TABLE "Generation" ADD COLUMN "requestId" TEXT;

-- Create the unique index
CREATE UNIQUE INDEX "Generation_requestId_key" ON "Generation"("requestId");

-- Update existing rows with a UUID
UPDATE "Generation" 
SET "requestId" = hex(randomblob(16)) 
WHERE "requestId" IS NULL;

-- Now make the column required
ALTER TABLE "Generation" ALTER COLUMN "requestId" SET NOT NULL;