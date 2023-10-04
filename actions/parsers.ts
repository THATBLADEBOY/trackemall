import { SoldListing } from "./types";

/**
 * Parses the grading company from the title of a listing.
 * If no grading company is found, returns null.
 */
export const parseGradingCompanyFromTitle = (title: string) => {
  const regex = /PSA|BGS|SGC|CGC/i;
  const match = title.match(regex);
  if (match) {
    return match[0];
  }
  return null;
};

export const parseGradeFromTitle = (title: string) => {
  const regex = /PSA|BGS|SGC|CGC\s+(\d+)/i;
  const match = title.match(regex);
  if (match) {
    return match[1];
  }
  return null;
};

/**
 * Parses the PSA grade from the title of a listing.
 * If no PSA grade is found, returns "ungraded".
 **/
export const parsePSAGradeFromTitle = (title: string): string => {
  const regex = /PSA\s+(\d+)/i;
  const match = title.match(regex);
  if (match) {
    return match[1];
  }
  return "ungraded";
};

/**
 * Attempts to parse a price from the string we get from eBay into
 * a number. If the price cannot be parsed, returns "end".
 **/
export const parsePrice = (price: string): number | "end" => {
  const regex = /(\d+\.\d+)/;
  const match = price.match(regex);
  if (match) {
    return parseFloat(match[1]);
  }
  return "end";
};

/**
 * Parses the sold date from the string we get from eBay into a Date object.
 * If the date is not today, returns "end".
 **/
export const parseSoldDate = (soldDate: string): Date | "end" => {
  const today = new Date();
  const regex = /Sold\s+(\w+\s+\d+,\s+\d+)/;
  const match = soldDate.match(regex);
  if (match) {
    const date = new Date(match[1]);
    if (date.getDate() === today.getDate()) {
      return date;
    }
    return "end";
  }
  return "end";
};

/**
 * Verifies that the title contains at least the card name OR number.
 * If the name is found, performs a secondary check to ensure there
 * isn't a different card number representing a different card.
 **/
export const verifyListingTitleMatchesCard = (
  title: string,
  card: { name: string; number: string }
) => {
  const { name, number } = card;
  const nameRegex = new RegExp(name, "i");
  const numberRegex = new RegExp(number, "i");
  const nameMatch = title.match(nameRegex);
  const numberMatch = title.match(numberRegex);

  if (numberMatch) {
    return true;
  }

  if (nameMatch) {
    const numberRegex = /\d+/;
    const numberMatch = title.match(numberRegex);
    if (numberMatch) {
      return false;
    }
    return true;
  }

  return false;
};

export const parseSoldListings = (
  soldListings: SoldListing[],
  card: { name: string; number: string }
) => {
  const parsedSoldListings = [];
  for (const listing of soldListings) {
    const { title, price, soldDate, link, numberOfBids } = listing;

    if (!verifyListingTitleMatchesCard(title, card)) break;

    const parsedSoldDate = parseSoldDate(soldDate);
    if (parsedSoldDate === "end") continue;

    const parsedPrice = parsePrice(price);
    if (parsedPrice === "end") continue;

    const gradingCompany = parseGradingCompanyFromTitle(title);
    const grade = parseGradeFromTitle(title);

    parsedSoldListings.push({
      title,
      link,
      numberOfBids,
      price: parsedPrice,
      soldDate: parsedSoldDate,
      gradingCompany,
      grade,
    });
  }
  return parsedSoldListings;
};
