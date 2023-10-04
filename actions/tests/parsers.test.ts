import { describe, expect, test } from "vitest";
import {
  parsePSAGradeFromTitle,
  parsePrice,
  parseSoldDate,
  verifyListingTitleMatchesCard,
} from "../parsers";

describe("parsePSAGradeFromTitle", () => {
  test("returns the PSA grade from the title", () => {
    const title = "PSA 10 Charizard";
    const grade = parsePSAGradeFromTitle(title);
    expect(grade).toBe("10");
  });
  test("returns ungraded if no PSA grade is found", () => {
    const title = "Charizard";
    const grade = parsePSAGradeFromTitle(title);
    expect(grade).toBe("ungraded");
  });
});

describe("parsePrice", () => {
  test("returns the price as a number", () => {
    const price = "$100.00";
    const parsedPrice = parsePrice(price);
    expect(parsedPrice).toBe(100);
  });
  test("returns discard if the price cannot be parsed", () => {
    const price = "discard";
    const parsedPrice = parsePrice(price);
    expect(parsedPrice).toBe("discard");
  });
});

describe("parseSoldDate", () => {
  test("returns the date as a Date object", () => {
    const today = new Date();
    const soldDate = `Sold ${today.toLocaleString("default", {
      month: "long",
    })} ${today.getDate()}, ${today.getFullYear()}`;
    const parsedSoldDate = parseSoldDate(soldDate);
    expect(parsedSoldDate).toBeInstanceOf(Date);
  });
  test("returns end if the date is not today", () => {
    const soldDate = "Sold May 2, 2021";
    const parsedSoldDate = parseSoldDate(soldDate);
    expect(parsedSoldDate).toBe("end");
  });
});

describe("verifyListingTitleMatchesCard", () => {
  test("returns true if the title contains the card name", () => {
    const title = "Charizard";
    const card = { name: "Charizard", number: "001" };
    const verified = verifyListingTitleMatchesCard(title, card);
    expect(verified).toBe(true);
  });
  test("returns true if the title contains the card number", () => {
    const title = "001";
    const card = { name: "Charizard", number: "001" };
    const verified = verifyListingTitleMatchesCard(title, card);
    expect(verified).toBe(true);
  });
  test("returns false if the title does not contain the card name or number", () => {
    const title = "Blastoise";
    const card = { name: "Charizard", number: "001" };
    const verified = verifyListingTitleMatchesCard(title, card);
    expect(verified).toBe(false);
  });
  test("returns false if the title contains a different card number", () => {
    const title = "002";
    const card = { name: "Charizard", number: "001" };
    const verified = verifyListingTitleMatchesCard(title, card);
    expect(verified).toBe(false);
  });
});
