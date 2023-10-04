-- create a table to store card sets
CREATE TABLE card_set (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  release_date date NOT NULL,
  image_url text,
  era text NOT NULL,
  total_cards integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a table to store cards
CREATE TABLE card (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    image_url text,
    card_set_id uuid REFERENCES card_set(id) NOT NULL,
    card_number text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a table to store card sales
CREATE TABLE card_sale (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id uuid REFERENCES card(id) NOT NULL,
    price_in_us_cents integer NOT NULL,
    sold_at timestamp with time zone NOT NULL,
    grade text NOT NULL,
    bid_count integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

