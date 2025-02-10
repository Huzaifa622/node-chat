-- AlterEnum
ALTER TYPE "Online" ADD VALUE 'typing';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isOnline" SET DEFAULT 'offline',
ALTER COLUMN "isOnline" SET DATA TYPE TEXT;
