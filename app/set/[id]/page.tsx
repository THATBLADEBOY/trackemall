import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SetDetails() {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from("card")
    .select("*")
    .order("card_number");

  return (
    <>
      <div className="container space-y-8">
        <Card className="w-full mt-8">
          <CardContent>
            <h2 className="text-2xl font-semibold">Obsidian Flames</h2>
          </CardContent>
        </Card>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="name" placeholder="Search by name, number, or type" />
          <Button type="submit">Search</Button>
        </div>
        {error && <div className="text-red-500">{error.message}</div>}
        {data && (
          <div className="grid grid-cols-5 gap-4">
            {data.map((card) => (
              <Link href={`/card/${card.id}`}>
                <div key={card.id} className="">
                  <img src={card.image_url} alt="" className="rounded-xl" />
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 -mt-4 rounded-b-xl p-4 flex justify-between">
                    <div>
                      <div className="tracking-tight pt-4 ">{card.name}</div>
                      <div className="tracking-tight text-zinc-500 dark:text-zinc-400 font-light">
                        {card.card_number}
                      </div>
                    </div>
                    <p className="font-semibold text-xl text-green-500 dark:text-green-400 pt-4">
                      $50
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
