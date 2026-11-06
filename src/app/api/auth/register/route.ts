// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ApiResponse } from "@/types";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: "Data pendaftaran tidak valid",
        error: {
          code: "VALIDATION_ERROR",
          details: parsed.error.issues.map((i) => i.message).join(", "),
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { name, email, password, phone } = parsed.data;

    // Cek apakah email sudah terdaftar
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: "Email sudah terdaftar",
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          details: "Gunakan email lain atau silakan login",
        },
      };
      return NextResponse.json(response, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        phone,
        role: "citizen",
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    const response: ApiResponse<typeof newUser> = {
      success: true,
      data: newUser,
      message: "Registrasi pengguna berhasil",
      error: null,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/auth/register error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal mendaftarkan pengguna";

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Terjadi kesalahan saat registrasi",
      error: {
        code: "REGISTRATION_FAILED",
        details: errorMessage,
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
