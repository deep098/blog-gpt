"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log("🔑 Attempting login with:", data.email);

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("❌ Login failed:", error);
    redirect("/error");
  }

  console.log("✅ Login successful! Redirecting...");
//   revalidatePath("/", "layout");
  
  // Instead of redirect, use a different approach
  redirect("/success");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: `${firstName + " " + lastName}`,
        email: formData.get("email") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

//   revalidatePath("/", "layout");
  redirect("/signupconfirm");
}