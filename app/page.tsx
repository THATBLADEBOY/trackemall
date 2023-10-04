import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const { data: sets, error: setsError } = await supabase
    .from("card_set")
    .select("id, name, release_date, card ( id, name, card_number, image_url )")
    .limit(5, { foreignTable: "card" })
    .order("release_date", { ascending: false });

  return (
    <>
      <div className="container space-y-8">
        <div className="flex flex-col w-full justify-center items-center py-24">
          <h2 className="text-8xl font-semibold tracking-tight">
            Know your cards
          </h2>
          <p className="text-xl text-zinc-100 font-light tracking-tight mt-6">
            Pokemon TCG card market data to help you make informed decisions.
          </p>
        </div>

        {sets &&
          sets.map((set) => (
            <Card>
              <CardHeader className="">
                <div className="flex">
                  <h3 className="text-2xl font-semibold col-span-5">
                    {set.name}
                  </h3>
                  <Link href={`/set/${set.id}`}>
                    <Button variant="link">
                      View all <ArrowRightIcon className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-5 gap-4">
                {set.card.map((card) => (
                  <Link href={`/card/${card.id}`}>
                    <div key={card.id} className="">
                      <img src={card.image_url} alt="" className="rounded-xl" />
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 -mt-4 rounded-b-xl p-4 flex justify-between">
                        <div>
                          <div className="tracking-tight pt-4 ">
                            {card.name}
                          </div>
                          <div className="tracking-tight text-zinc-500 dark:text-zinc-400 font-light">
                            {card.card_number}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
}
