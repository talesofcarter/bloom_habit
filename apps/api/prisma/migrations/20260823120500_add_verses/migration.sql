-- CreateTable
CREATE TABLE "verses" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ampText" TEXT NOT NULL,
    "ampRef" TEXT NOT NULL,
    "nivText" TEXT NOT NULL,
    "nivRef" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verses_date_key" ON "verses"("date");