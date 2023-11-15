"use server";

import { postUpdateSchema } from "@/lib/validation/post";
import { Profile } from "@/types/collection";
// import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as z from "zod";

export async function UpdatePost(context: z.infer<typeof postUpdateSchema>) {
  const cookieStore = cookies(); 
  const supabase = createClient(cookieStore);
  try {
    const post = postUpdateSchema.parse(context);

    // get current sellor
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user.id;
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .match({ id: userId })
      .single<Profile>();


    const { data, error } = await supabase
      .from("drafts")
      .update({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category_id: post.categoryId,
        description: post.description,
        image: post.image,
        price: post.price,
        content: post.content,
        pay_address: profileData?.address
      })
      .match({ id: post.id })
      .select()
      .single();

    if (error) {
      console.log(error);
      return null;
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
