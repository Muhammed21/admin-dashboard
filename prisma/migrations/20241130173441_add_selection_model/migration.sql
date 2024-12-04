/*
  Warnings:

  - Changed the type of `payment` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fulfillment` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Fulfillment" AS ENUM ('Fulfilled', 'NotFulfilled');

-- CreateEnum
CREATE TYPE "Payment" AS ENUM ('Captured', 'NotCaptured');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payment",
ADD COLUMN     "payment" "Payment" NOT NULL,
DROP COLUMN "fulfillment",
ADD COLUMN     "fulfillment" "Fulfillment" NOT NULL;
