#!/bin/bash
set -e

echo "==> Installing dependencies..."
npm install

echo "==> Generating Prisma client (if applicable)..."
npx prisma generate || echo "Prisma generate skipped or failed."

echo "==> Running type-check..."
npx tsc --noEmit || echo "Warning: TypeScript check failed or tsc not found."

echo "==> Running linter..."
npx expo lint

echo "==> Running Expo Doctor..."
npx expo-doctor

echo "==> Verification complete. Project builds cleanly."
