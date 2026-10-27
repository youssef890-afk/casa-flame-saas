create table if not exists public.menu_categories (
  id text primary key,
  name text not null,
  name_ar text not null default '',
  name_fr text not null default '',
  icon text not null default '',
  image text not null default '',
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_products (
  id text primary key,
  name text not null,
  name_ar text not null default '',
  name_fr text not null default '',
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  image text not null default '',
  category_id text not null references public.menu_categories (id) on delete restrict,
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  popular boolean not null default false,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  customer_name text not null check (length(trim(customer_name)) between 1 and 120),
  phone text not null check (length(trim(phone)) between 1 and 40),
  delivery_address text,
  order_type text not null check (order_type in ('delivery', 'pickup')),
  payment_method text not null check (payment_method = 'cash'),
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null check (delivery_fee >= 0),
  total numeric(10, 2) not null check (total = subtotal + delivery_fee),
  status text not null default 'pending'
    check (status in ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (order_type <> 'delivery' or length(trim(coalesce(delivery_address, ''))) > 0)
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  name text not null check (length(trim(name)) between 1 and 120),
  phone text not null check (length(trim(phone)) between 1 and 40),
  guests integer not null check (guests between 1 and 20),
  reservation_date date not null,
  reservation_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'seated', 'completed', 'cancelled')),
  table_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menu_categories enable row level security;
alter table public.menu_products enable row level security;
alter table public.orders enable row level security;
alter table public.reservations enable row level security;

revoke all on public.menu_categories, public.menu_products from anon, authenticated;
grant select on public.menu_categories, public.menu_products to anon, authenticated;
grant insert, update, delete on public.menu_categories, public.menu_products to authenticated;

drop policy if exists "Visible categories are public" on public.menu_categories;
create policy "Visible categories are public"
  on public.menu_categories
  for select
  to anon, authenticated
  using (is_visible);

drop policy if exists "Admins manage categories" on public.menu_categories;
create policy "Admins manage categories"
  on public.menu_categories
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Available products in visible categories are public" on public.menu_products;
create policy "Available products in visible categories are public"
  on public.menu_products
  for select
  to anon, authenticated
  using (
    available
    and exists (
      select 1
      from public.menu_categories
      where menu_categories.id = menu_products.category_id
        and menu_categories.is_visible
    )
  );

drop policy if exists "Admins manage products" on public.menu_products;
create policy "Admins manage products"
  on public.menu_products
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

revoke all on public.orders, public.reservations from anon, authenticated;
grant select, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.reservations to authenticated;

drop policy if exists "Customers read their own orders" on public.orders;
create policy "Customers read their own orders"
  on public.orders
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders"
  on public.orders
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Customers create their own pending reservations" on public.reservations;
create policy "Customers create their own pending reservations"
  on public.reservations
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and status = 'pending'
  );

drop policy if exists "Customers read their own reservations" on public.reservations;
create policy "Customers read their own reservations"
  on public.reservations
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Admins manage reservations" on public.reservations;
create policy "Admins manage reservations"
  on public.reservations
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.create_customer_order(
  p_customer_name text,
  p_phone text,
  p_delivery_address text,
  p_order_type text,
  p_payment_method text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_item_count integer;
  v_matched_count integer;
  v_subtotal numeric(10, 2);
  v_delivery_fee numeric(10, 2);
  v_item_snapshot jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication is required to place an order';
  end if;

  if p_customer_name is null or length(trim(p_customer_name)) not between 1 and 120
    or p_phone is null or length(trim(p_phone)) not between 1 and 40 then
    raise exception 'Customer name and phone are required';
  end if;

  if p_order_type not in ('delivery', 'pickup')
    or p_payment_method <> 'cash' then
    raise exception 'Invalid order or payment method';
  end if;

  if p_order_type = 'delivery'
    and (p_delivery_address is null or length(trim(p_delivery_address)) = 0) then
    raise exception 'A delivery address is required';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) not between 1 and 50 then
    raise exception 'The order must contain between 1 and 50 items';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as entry(value)
    where jsonb_typeof(entry.value) <> 'object'
      or jsonb_typeof(entry.value -> 'id') <> 'string'
      or jsonb_typeof(entry.value -> 'quantity') <> 'number'
      or coalesce(entry.value ->> 'quantity', '') !~ '^[1-9][0-9]{0,1}$'
  ) then
    raise exception 'Each order item must have a product id and quantity from 1 to 99';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as entry(value)
    group by entry.value ->> 'id'
    having count(*) > 1
  ) then
    raise exception 'Duplicate products must be combined into one order item';
  end if;

  select
    count(*)::integer,
    coalesce(sum(product.price * (entry.value ->> 'quantity')::integer), 0)::numeric(10, 2),
    coalesce(
      jsonb_agg(jsonb_build_object(
        'id', product.id,
        'name', product.name,
        'quantity', (entry.value ->> 'quantity')::integer,
        'unit_price', product.price
      )),
      '[]'::jsonb
    )
  into v_matched_count, v_subtotal, v_item_snapshot
  from jsonb_array_elements(p_items) as entry(value)
  join public.menu_products as product
    on product.id = entry.value ->> 'id'
   and product.available;

  v_item_count := jsonb_array_length(p_items);
  if v_matched_count <> v_item_count then
    raise exception 'One or more products are unavailable';
  end if;

  v_delivery_fee := case when p_order_type = 'delivery' then 15 else 0 end;

  insert into public.orders (
    user_id,
    customer_name,
    phone,
    delivery_address,
    order_type,
    payment_method,
    items,
    subtotal,
    delivery_fee,
    total
  )
  values (
    v_user_id,
    trim(p_customer_name),
    trim(p_phone),
    nullif(trim(coalesce(p_delivery_address, '')), ''),
    p_order_type,
    p_payment_method,
    v_item_snapshot,
    v_subtotal,
    v_delivery_fee,
    v_subtotal + v_delivery_fee
  )
  returning id into v_order_id;

  return v_order_id;
end;
$$;

revoke all on function public.create_customer_order(text, text, text, text, text, jsonb) from public, anon;
grant execute on function public.create_customer_order(text, text, text, text, text, jsonb) to authenticated;

notify pgrst, 'reload schema';
