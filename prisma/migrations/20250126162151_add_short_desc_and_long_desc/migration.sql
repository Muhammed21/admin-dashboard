-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "longDesc" TEXT NOT NULL DEFAULT 'longDesc',
ADD COLUMN     "shortDesc" TEXT NOT NULL DEFAULT 'shortDesc';
