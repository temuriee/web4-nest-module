## 🧩 მთლიანი აზრი

```ts
@Entity()
export class Post { ... }
```

👉 ეს ნიშნავს, რომ ეს კლასი იქნება PostgreSQL ცხრილი `"post"` (ან `"posts"`).
TypeORM წაიკითხავს ყველა `@Column()`-ს და შექმნის შესაბამის სვეტებს (columns).

---

## 🔹 1️⃣ `@PrimaryGeneratedColumn()`

```ts
id: number;
```

👉 Primary Key — უნიკალური იდენტიფიკატორი.
ბაზაში ავტომატურად იზრდება (auto-increment).

SQL ეკვივალენტი:

```sql
id SERIAL PRIMARY KEY
```

---

## 🔹 2️⃣ `@Column({ type: 'varchar', length: 512 }) title`

👉 პოსტის სათაური.

- ტიპი: `varchar(512)`
- აუცილებელია (`nullable: false`)

SQL:

```sql
title VARCHAR(512) NOT NULL
```

---

## 🔹 3️⃣ `@Column({ type: 'enum', enum: postType, default: postType.POST })`

👉 აქ ველისთვის გამოიყენება **Enum** ტიპი.

ეს ნიშნავს, რომ `postType` ველში შეიძლება შეინახოს მხოლოდ კონკრეტული მნიშვნელობები.

მაგალითად, `postType` enum შეიძლება იყოს:

```ts
export enum postType {
  POST = 'post',
  PAGE = 'page',
}
```

ანუ ეს სვეტი მიიღებს მხოლოდ `"post"` ან `"page"` მნიშვნელობას.

---

## 🔹 4️⃣ `slug`

👉 უნიკალური ტექსტური იდენტიფიკატორი პოსტისთვის.
მაგალითად, პოსტი `"My First Blog Post"` შეიძლება ჰქონდეს `slug = "my-first-blog-post"`

- უნიკალური (`unique: true`)
- სიგრძე მაქსიმუმ 256
- აუცილებელი ველი

SQL:

```sql
slug VARCHAR(256) UNIQUE NOT NULL
```

---

## 🔹 5️⃣ `status`

👉 კიდევ ერთი **enum** ველი.

მაგალითად, `postStatus` შეიძლება იყოს:

```ts
export enum postStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}
```

ამიტომ სვეტში შეინახება მხოლოდ ეს სამი მნიშვნელობიდან ერთ-ერთი.
Default არის `draft`.

---

## 🔹 6️⃣ `content` და `schema`

👉 ორივე არის **გრძელი ტექსტი** (`type: 'text'`) და optional (`nullable: true`).

ესენი ინახავენ:

- `content` — პოსტის მთავარი ტექსტი
- `schema` — შეიძლება იყოს SEO ან JSON-LD მონაცემები (rich snippets და ა.შ.)

---

## 🔹 7️⃣ `featuredImageUrl`

👉 optional string, სადაც ინახება პოსტის სურათის ბმული (URL).

```sql
featured_image_url VARCHAR(1024)
```

---

## 🔹 8️⃣ `publishOn`

👉 თარიღი და დრო, როდის უნდა გამოქვეყნდეს პოსტი.

- ტიპი: `timestamp` (PostgreSQL) ან `datetime` (MySQL)
- optional — შეიძლება ცარიელი იყოს (მაგ. ჯერ არ გამოქვეყნებულა).

---

## 🔹 9️⃣ `tags?: string[];`

👉 ამ ეტაპზე ეს არ არის ბაზაში შენახული სვეტი, რადგან **არ აქვს `@Column()` დეკორატორი**.
ეს მხოლოდ **TypeScript field** არის — მოგვიანებით დაემატება როგორც **relationship** ცალკე ცხრილთან (მაგ. `PostTag`).

---

## 🔹 🔟 `metaOptions?: CreatePostMetaOptionsDto[];`

👉 ასევე არ არის ბაზაში სვეტი.
ეს მხოლოდ მეხსიერებაში გამოიყენება (DTO მონაცემები).
მოგვიანებით ამაზე დაემატება **კავშირი (relationship)** სხვა Entity-სთან.

---

## ⚙️ მოკლედ რომ შევაჯამოთ:

| ველი               | ტიპი                 | აღწერა                                |
| ------------------ | -------------------- | ------------------------------------- |
| `id`               | number               | primary key                           |
| `title`            | varchar(512)         | პოსტის სათაური                        |
| `postType`         | enum                 | პოსტის ტიპი (`post` ან `page`)        |
| `slug`             | varchar(256), unique | უნიკალური იდენტიფიკატორი URL-ში       |
| `status`           | enum                 | სტატუსი (`draft`, `published`, ...)   |
| `content`          | text                 | პოსტის შიგთავსი                       |
| `schema`           | text                 | SEO ან JSON სტრუქტურა                 |
| `featuredImageUrl` | varchar(1024)        | სურათის ბმული                         |
| `publishOn`        | timestamp            | გამოქვეყნების თარიღი                  |
| `tags`             | string[]             | მომავალში დაკავშირებული ცხრილი იქნება |
| `metaOptions`      | object[]             | მომავალში დაკავშირებული ცხრილი იქნება |

---

## 🧠 საბოლოოდ:

👉 ეს კლასი TypeORM-ს ეუბნება:

> “შექმენი ცხრილი `post`, ასეთი სვეტებით და მახასიათებლებით.”

და როცა აპი გაეშვება `synchronize: true`-თ, TypeORM ავტომატურად შექმნის SQL ცხრილს დაახლოებით ასე:

```sql
CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  title VARCHAR(512) NOT NULL,
  postType VARCHAR(10) NOT NULL DEFAULT 'post',
  slug VARCHAR(256) UNIQUE NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'draft',
  content TEXT,
  schema TEXT,
  featuredImageUrl VARCHAR(1024),
  publishOn TIMESTAMP
);
```
