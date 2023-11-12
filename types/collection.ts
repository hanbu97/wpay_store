// import { Database } from "./supabase";

import { Database } from "./supabase.ts";

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Sellor = Database["public"]["Tables"]["sellors"]["Row"];
export type Post = Database["public"]["Tables"]["products"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type BookMark = Database["public"]["Tables"]["bookmarks"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Draft = Database["public"]["Tables"]["drafts"]["Row"];

export interface DraftWithCategory extends Omit<Draft, "categories"> {
  categories: Category;
}

export interface DraftWithCategoryWithProfile
  extends Omit<DraftWithCategory, "profiles"> {
  profiles: Profile;
}

export interface PostWithCategory extends Omit<Post, "categories"> {
  categories: Category;
}

export interface PostWithCategoryWithProfile
  extends Omit<PostWithCategory, "profiles"> {
  profiles: Profile;
}

export interface CategoryWithPost extends Omit<Category, "posts"> {
  posts: Post;
}

export interface BookMarkWithPost extends Omit<BookMark, "posts"> {
  posts: Post;
}

export interface CommentWithProfile extends Omit<Comment, "profiles"> {
  profiles: Profile;
}
