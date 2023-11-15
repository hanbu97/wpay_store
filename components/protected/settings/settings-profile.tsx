"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Profile } from "@/types/collection";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface SettingsProfileProps {
  user: Profile;
}

const SettingsProfile: FC<SettingsProfileProps> = ({ user }) => {
  const form = useForm();

  return (
    <>
      <Form {...form}>
        <form className="space-y-8">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
              <CardDescription>
                Current USDC received from sales
              </CardDescription>
            </CardHeader>
            <Separator className="mb-8" />
            <CardContent className="space-y-4">
              <div className="mx-auto flex max-w-3xl flex-col justify-center">
                <div className="col-span-full flex items-center gap-x-8 text-6xl font-bold">
                  133.58 USDC
                </div>
              </div>
              <FormField
                name="account"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"Input wallet address to withdraw to"}
                        {...field}
                        className="max-w-md text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <button
                  type="button"
                  onClick={() => {}}
                  className="rounded-md bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-gray-300 hover:bg-gray-100"
                >
                  Withdraw Balance
                </button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
};

export default SettingsProfile;
