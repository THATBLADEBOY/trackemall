import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";
import { parseSoldListings } from "./parsers";

const SET_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
const SET_NAME = "Obsidian Flames";
const SET_COUNT = 197;

// const SET_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12";
// const SET_NAME = "151";
// const SET_COUNT = 165;

// load env vars
require("dotenv").config();

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!!,
  process.env.PUBLIC_SUPABASE_ANON_KEY!!
);

const insertCardSale = async (cardSale: any) => {
  const { data, error } = await supabase.from("card_sale").insert([cardSale]);
  if (error) {
    throw error;
  }
  return data;
};

const getSetCardsBySetId = async (setId: string) => {
  const { data, error } = await supabase
    .from("card")
    .select("*")
    .eq("card_set_id", setId);

  if (error) {
    throw error;
  }
  return data;
};

async function scrapeEbaySoldListings(
  searchQuery: string,
  card: { name: string; number: string }
) {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();
  // Encode the search query
  const encodedSearchQuery = encodeURI(searchQuery);

  // Go to the eBay sold listings page for the search query
  await page.goto(
    `https://www.ebay.com/sch/i.html?_nkw=${encodedSearchQuery}&_sacat=0&LH_Complete=1&LH_Sold=1`
  );

  // Wait for the sold listings to load
  await page.waitForSelector(".s-item");

  // Extract data from sold listings
  const soldListings = await page.$$eval(".s-item", (items) => {
    const soldItems: any[] = [];
    console.log("found items", items?.length);
    items.forEach((item) => {
      const title = item.querySelector(".s-item__title")?.textContent;
      const price = item.querySelector(".s-item__price")?.textContent;
      const soldDate = item.querySelector(".s-item__title--tag")?.textContent;
      const numberOfBids = item.querySelector(".s-item__bids")?.textContent;
      const link = item.querySelector(".s-item__link")?.getAttribute("href");

      if (title && price && soldDate) {
        soldItems.push({ title, price, soldDate, numberOfBids, link });
      }
    });
    return soldItems;
  });

  const parsedSoldListings = parseSoldListings(soldListings, card);

  console.log("parsedSoldListings", parsedSoldListings);

  await browser.close();
  return parsedSoldListings;
}

const createSearchQuery = (card: { name: string; number: string }) => {
  const { name, number } = card;
  return `${number}/${SET_COUNT} ${name} ${SET_NAME}`;
};

(async () => {
  try {
    // get all of the cards in the set
    const setCards = await getSetCardsBySetId(SET_ID);

    for (const card of setCards) {
      let triesLeft = 3;
      while (triesLeft > 0) {
        const searchQuery = createSearchQuery(card);
        try {
          const soldListings = await scrapeEbaySoldListings(searchQuery, card);
          console.log(`${card.name} ${card.card_number}/197`, soldListings);

          if (soldListings.length > 0) {
            // loop through each sold listing and insert into db
            for (const soldListing of soldListings) {
              const { price, soldDate, grade } = soldListing;
              const cardSale = {
                card_id: card.id,
                price_in_us_cents: price * 100,
                sold_at: soldDate,
                grade,
              };
              await insertCardSale(cardSale);
            }
          }

          break;
        } catch (error) {
          console.error("Error:", error);
          console.log(`Retrying ${card.name}...`);
          console.log(`Tries left: ${triesLeft}`);
          triesLeft--;
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
})();
