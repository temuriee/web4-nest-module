## 🧩 მთლიანი აზრი:

```ts
@Entity()
export class User { ... }
```

👉 ეს ნიშნავს, რომ ეს კლასი არის **Entity** — ანუ **PostgreSQL ცხრილის მოდელი**.
TypeORM ამ ინფორმაციას გამოიყენებს, რომ ბაზაში შექმნას ცხრილი `"user"` (ან `"users"`).

---

## 🔹 ახლა ავხსნათ თითოეული ნაწილი:

---

### 🏷️ `@Entity()`

👉 აღნიშნავს, რომ ეს კლასი უნდა გახდეს მონაცემთა ბაზის ცხრილი.
ანუ TypeORM-ი მას აღიქვამს როგორც table-ის აღწერას.

თუ გინდა კონკრეტული სახელი ცხრილს:

```ts
@Entity('users')
```

მაშინ ბაზაში შეიქმნება ცხრილი სახელით `users`.

---

### 🔑 `@PrimaryGeneratedColumn()`

👉 ქმნის ცხრილის პირველ (primary key) სვეტს —
სვეტის სახელი იქნება `id`, და მნიშვნელობა ავტომატურად გაიზრდება (auto-increment).

SQL-ში ამას მოერგება ეს:

```sql
id SERIAL PRIMARY KEY
```

---

### 🧍‍♂️ `@Column(...)`

👉 ქმნის ჩვეულებრივ სვეტს (field-ს) ბაზაში.
შიგნით შეგიძლია მიუთითო ტიპი, სიგრძე, nullable, უნიკალურობა და სხვ.

---

#### ▶️ `firstName` სვეტი:

```ts
@Column({
  type: 'varchar',
  length: 96,
  nullable: false,
})
firstName: string;
```

- `type: 'varchar'` → ტექსტური ტიპი
- `length: 96` → მაქსიმუმ 96 სიმბოლო
- `nullable: false` → აუცილებელი ველია (არ შეიძლება იყოს `NULL`)

---

#### ▶️ `lastName` სვეტი:

```ts
nullable: true;
```

👉 ნიშნავს რომ შეიძლება იყოს ცარიელი (`NULL`).

---

#### ▶️ `email` სვეტი:

```ts
unique: true;
```

👉 ნიშნავს, რომ ბაზაში ორი მომხმარებელი ვერ ექნება ერთი და იგივე `email`.

SQL ეკვივალენტი:

```sql
email VARCHAR(96) UNIQUE NOT NULL
```

---

#### ▶️ `password` სვეტი:

👉 ჩვეულებრივი ტექსტური სვეტი, აუცილებელი (`nullable: false`).

---

## ⚙️ როცა აპი გაეშვება:

NestJS → TypeORM → წაიკითხავს ყველა `@Entity()` კლასს
და `synchronize: true` პარამეტრის გამო
**ავტომატურად შექმნის** ასეთ ცხრილს PostgreSQL-ში:

```sql
CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(96) NOT NULL,
  lastName VARCHAR(96),
  email VARCHAR(96) UNIQUE NOT NULL,
  password VARCHAR(96) NOT NULL
);
```

---

## 🧠 მოკლედ:

| დეკორატორი                  | რას აკეთებს                                 |
| --------------------------- | ------------------------------------------- |
| `@Entity()`                 | ამბობს TypeORM-ს რომ ეს კლასი არის ცხრილი   |
| `@PrimaryGeneratedColumn()` | ქმნის auto-increment primary key-ს          |
| `@Column()`                 | ქმნის ჩვეულებრივ სვეტს (field-ს)            |
| `nullable`                  | შეიძლება თუ არა ცარიელი იყოს                |
| `unique`                    | იმავე მნიშვნელობა არ შეიძლება სხვას ჰქონდეს |
