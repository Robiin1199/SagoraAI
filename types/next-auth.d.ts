import type { MembershipRole } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      organizationId?: string;
      organizationName?: string;
      membershipRole?: MembershipRole;
    };
  }

  interface User {
    membershipRole?: MembershipRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    organizationId?: string;
    membershipRole?: MembershipRole;
    organizationName?: string;
  }
}
