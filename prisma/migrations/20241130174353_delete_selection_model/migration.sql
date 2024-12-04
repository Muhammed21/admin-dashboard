/*
  Warnings:

  - Changed the type of `payment` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fulfillment` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payment",
ADD COLUMN     "payment" TEXT NOT NULL,
DROP COLUMN "fulfillment",
ADD COLUMN     "fulfillment" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Fulfillment";

-- DropEnum
DROP TYPE "Payment";
