## 🧠 იდეა მარტივად:

როცა ვამბობ `{ cascade: true }`,
ეს ნიშნავს:

> “TypeORM, როცა მე ვქმნი ან ვცვლი ერთ ობიექტს (მაგ. User-ს),
> შენ ავტომატურად მიხედე მის შვილობილი ობიექტებსაც (მაგ. Profile-ს).”

ანუ **შენ აღარ გჭირდება ხელით Profile-ის შექმნა და მიბმა** —
შეგიძლია **User-ის შიგნითვე ჩაწერო Profile-ის ინფორმაცია**,
და TypeORM თვითონ მიხვდება რომ ახალი Profile-იც უნდა შექმნას და დაუკავშიროს User-ს.

---

## 📘 მაგალითად:

მოდით ვთქვათ გვაქვს ორი entity:

```ts
@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  profile: Profile;
}
```

---

## 💡 ახლა როცა შენ შექმნი ახალ User-ს:

```ts
const newUser = {
  name: 'Nika',
  profile: {
    bio: 'I love programming!',
  },
};

await userRepository.save(newUser);
```

👉 შენ არ მოგიწევს:

- ჯერ `profileRepository.save()` გამოძახება,
- მერე ამ profile-ს user-ზე მიბმა.

**TypeORM თვითონ აკეთებს ამას**, იმიტომ რომ `{ cascade: true }` აწერია.

---

## 🧩 რა ქმედებებს მოიცავს “cascade”

შეგიძლია მართო კონკრეტულად **რომელი ქმედება** იყოს ავტომატური:

```ts
@OneToOne(() => Profile, {
  cascade: ['insert', 'update', 'remove'],
})
```

| ქმედება    | რას ნიშნავს                                  |
| ---------- | -------------------------------------------- |
| `'insert'` | როცა User-ს ქმნი, ავტომატურად შექმნა Profile |
| `'update'` | როცა User-ს შეცვლი, შეცვალე Profile-ც        |
| `'remove'` | როცა User-ს წაშლი, წაშალე Profile-ც          |

თუ წერ `{ cascade: true }`,
ეს იგივეა რაც `{ cascade: ['insert', 'update', 'remove'] }`.

---

## 🚫 ახლა განსხვავება `{ cascade: true }` vs `{ onDelete: 'CASCADE' }`

- `{ cascade: true }`
  — მუშაობს **აპლიკაციის შიგნით**, TypeORM-ის მეშვეობით.
  ანუ როცა შენ `repository.save()` ან `repository.remove()` აკეთებ, TypeORM თვითონ მიხედავს დაკავშირებულ ცხრილებსაც.

- `{ onDelete: 'CASCADE' }`
  — ეს უკვე **ბაზის დონეზეა** (SQL-ში).
  როცა User წაიშლება პირდაპირ database-ში,
  **PostgreSQL თვითონ წაშლის** დაკავშირებულ Profile-საც,
  თუნდაც შენი აპლიკაცია ამაზე არაფერი იცოდეს.

📘 ხშირად ორივეს იყენებენ ერთად:

```ts
@OneToOne(() => Profile, {
  cascade: true,
  onDelete: 'CASCADE',
})
```

---

## 🎯 შეჯამება:

| შენ რას აკეთებ                          | ხდება ავტომატურად              |
| --------------------------------------- | ------------------------------ |
| ქმნი User-ს და შიგნით ჩაწერ Profile-ს   | ორივე შეიქმნება                |
| ამოწმებ User-ს და ცვლი შიგნით Profile-ს | Profile-ც შეიცვლება            |
| შლი User-ს                              | Profile-ც წაიშლება             |
| `{ onDelete: 'CASCADE' }`               | ბაზა თვითონაც წაშლის Profile-ს |
