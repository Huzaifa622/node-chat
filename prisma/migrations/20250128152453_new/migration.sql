/*
  Warnings:

  - The `isOnline` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Online" AS ENUM ('true', 'false');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isOnline",
ADD COLUMN     "isOnline" "Online" NOT NULL DEFAULT 'false';
