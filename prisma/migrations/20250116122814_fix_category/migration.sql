/*
  Warnings:

  - You are about to drop the `_ItemCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ItemCategories" DROP CONSTRAINT "_ItemCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemCategories" DROP CONSTRAINT "_ItemCategories_B_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "categoryId" INTEGER;

-- DropTable
DROP TABLE "_ItemCategories";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
