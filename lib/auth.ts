import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function ensureOrganizationForUser(userId: string, fallbackName?: string) {
  const existingMembership = await prisma.membership.findFirst({
    where: { userId },
    include: { organization: true }
  });

  if (existingMembership) {
    return existingMembership.organization;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const baseName = fallbackName ?? user?.name ?? "Organisation";
  const baseSlug = slugify(baseName) || slugify(user?.email?.split("@")[0] ?? randomUUID());

  let slug = baseSlug;
  let counter = 1;
  // ensure unique slug
  while (true) {
    const existing = await prisma.organization.findUnique({ where: { slug } });
    if (!existing) {
      break;
    }
    slug = `${baseSlug}-${counter++}`;
  }

  const organization = await prisma.organization.create({
    data: {
      name: baseName,
      slug,
      memberships: {
        create: {
          userId,
          role: "OWNER"
        }
      }
    }
  });

  return organization;
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  console.warn("Google OAuth non configuré. Renseignez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET.");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: googleClientId ?? "stub-google-client-id",
      clientSecret: googleClientSecret ?? "stub-google-client-secret"
    })
  ],
  session: {
    strategy: "database"
  },
  events: {
    async createUser({ user }) {
      await ensureOrganizationForUser(user.id, user.name ?? user.email ?? undefined);
    },
    async linkAccount({ user }) {
      await ensureOrganizationForUser(user.id, user.name ?? user.email ?? undefined);
    }
  },
  callbacks: {
    async session({ session, user }) {
      const membership = await prisma.membership.findFirst({
        where: { userId: user.id },
        include: { organization: true }
      });

      if (session.user) {
        session.user.id = user.id;
        if (membership) {
          session.user.organizationId = membership.organizationId;
          session.user.membershipRole = membership.role;
          session.user.organizationName = membership.organization.name;
        }
      }
      return session;
    },
    async signIn({ user }) {
      await ensureOrganizationForUser(user.id, user.name ?? user.email ?? undefined);
      return true;
    }
  }
};

export const auth = () => getServerSession(authOptions);
