import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { ROLE_CONFIG } from "../src/auth/auth.contract.js";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "../src/auth/demo-accounts.js";
import { hashPassword } from "../src/auth/password.js";

const localDatabaseUrl =
  "postgresql://sensor_mes:sensor_mes_local@localhost:5432/sensor_mes?schema=public";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? localDatabaseUrl,
});
const prisma = new PrismaClient({ adapter });

try {
  const passwordHashes = new Map(
    await Promise.all(
      DEMO_ACCOUNTS.map(async (account) => [
        account.id,
        await hashPassword(DEMO_PASSWORD),
      ] as const),
    ),
  );

  await prisma.$transaction(async (transaction) => {
    for (const [code, configuration] of Object.entries(ROLE_CONFIG)) {
      await transaction.role.upsert({
        where: { code: code as keyof typeof ROLE_CONFIG },
        create: { code: code as keyof typeof ROLE_CONFIG, label: configuration.label },
        update: { label: configuration.label },
      });
    }

    for (const account of DEMO_ACCOUNTS) {
      const passwordHash = passwordHashes.get(account.id);
      if (passwordHash === undefined) {
        throw new Error(`데모 계정 password hash가 없습니다: ${account.id}`);
      }
      const user = await transaction.user.upsert({
        where: { email: account.email },
        create: {
          id: account.id,
          email: account.email,
          displayName: account.displayName,
          passwordHash,
          isActive: true,
          isDemo: true,
        },
        update: {
          displayName: account.displayName,
          passwordHash,
          isActive: true,
          isDemo: true,
        },
      });

      await transaction.userRole.deleteMany({
        where: { userId: user.id, roleCode: { not: account.role } },
      });
      await transaction.userRole.upsert({
        where: {
          userId_roleCode: { userId: user.id, roleCode: account.role },
        },
        create: { userId: user.id, roleCode: account.role },
        update: {},
      });
    }
  });

  console.log(`가상 데모 계정 ${DEMO_ACCOUNTS.length}개 seed 완료`);
} finally {
  await prisma.$disconnect();
}
