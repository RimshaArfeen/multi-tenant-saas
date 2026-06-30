
// // app/actions/auth.ts
// "use server";

// import { prisma } from "../lib/prisma";
// import bcrypt from "bcryptjs";
// import { z } from "zod";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// const signUpSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
// });

// const signInSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(1, "Password is required"),
// });

// export async function signUpAction(formData: FormData) {
//   try {
//     const validatedFields = signUpSchema.parse({
//       email: formData.get("email"),
//       password: formData.get("password"),
//       organizationName: formData.get("organizationName"),
//     });

//     const { email, password, organizationName } = validatedFields;

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return { error: "User already exists. Please sign in." };
//     }

//     const existingCompany = await prisma.company.findUnique({
//       where: { name: organizationName },
//     });

//     if (existingCompany) {
//       return { error: "Organization name is already taken. Please choose another." };
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await prisma.$transaction(async (tx) => {
//       const company = await tx.company.create({
//         data: {
//           name: organizationName,
//           settings: {
//             create: {
//               invoicePrefix: "INV-",
//               invoiceNumber: 1000,
//               paymentTerms: 30,
//               timezone: "UTC",
//               dateFormat: "MM/DD/YYYY",
//             },
//           },
//         },
//       });

//       await tx.user.create({
//         data: {
//           email,
//           password: hashedPassword,
//           name: email.split("@")[0],
//           role: "OWNER",
//           companyId: company.id,
//         },
//       });
//     });

//     return { success: true };
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return { error: error.issues[0].message };
//     }
//     console.error("Signup error:", error);
//     return { error: "An unexpected error occurred." };
//   }
// }

// export async function signInAction(formData: FormData) {
//   try {
//     const validatedFields = signInSchema.parse({
//       email: formData.get("email"),
//       password: formData.get("password"),
//     });

//     const { email, password } = validatedFields;

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user || !user.password) {
//       return { error: "Invalid credentials" };
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return { error: "Invalid credentials" };
//     }

//     return { success: true };
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return { error: error.issues[0].message };
//     }
//     console.error("Signin error:", error);
//     return { error: "An unexpected error occurred." };
//   }
// }

// export async function signOutAction() {
//   const cookieStore = await cookies();
//   const session = cookieStore.get("next-auth.session-token") || cookieStore.get("__Secure-next-auth.session-token");
//   if (session) {
//     cookieStore.delete(session.name);
//   }
//   redirect("/auth?mode=signin");
// }

// -------------------------------------------------------------
// app/actions/auth.ts
"use server";

import { hash } from "bcryptjs";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function signUpAction(formData: FormData) {
  try {
    const validatedFields = signUpSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      organizationName: formData.get("organizationName"),
    });

    const { email, password, organizationName } = validatedFields;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists. Please sign in." };
    }

    // Check if company name exists
    const existingCompany = await prisma.company.findFirst({
      where: {
        name: {
          equals: organizationName,
          mode: 'insensitive',
        },
      },
    });

    if (existingCompany) {
      return { error: "Organization name is already taken. Please choose another." };
    }

    const hashedPassword = await hash(password, 10);

    // Create user and company in a transaction
    await prisma.$transaction(async (tx) => {
      // Create company
      const company = await tx.company.create({
        data: {
          name: organizationName,
          settings: {
            create: {
              invoicePrefix: "INV-",
              invoiceNumber: 1000,
              paymentTerms: 30,
              timezone: "UTC",
              dateFormat: "MM/DD/YYYY",
            },
          },
        },
      });

      // Create user with company
      await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email.split("@")[0],
          role: "OWNER",
          companyId: company.id,
        },
      });
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Signup error:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function signInAction(formData: FormData) {
  try {
    const validatedFields = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const { email } = validatedFields;

    // Check if user exists and has company
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      return { error: "Invalid credentials" };
    }

    // Check if user has a company
    if (!user.companyId) {
      return { 
        error: "Account needs company setup",
        needsSetup: true 
      };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Signin error:", error);
    return { error: "An unexpected error occurred." };
  }
}