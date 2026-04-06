## 🎯 ეს სტრიქონი:

```ts
relations: {
  metaOptions: true,
},
```

👉 **ზუსტად იმას ნიშნავს**, რასაც შენ ამბობ —
**TypeORM** შიგნით აკეთებს რაღაც მსგავსს ამ SQL-ს:

```sql
SELECT *
FROM posts
LEFT JOIN meta_options ON posts.metaOptionsId = meta_options.id;
```

ანუ:

- როცა შენ ეძებ `posts`,
- TypeORM ეუბნება ბაზას:
  „მომეცი ყველა პოსტი და თან ამ პოსტების metaOptions ცხრილიდანაც შემომიტანე დაკავშირებული ინფორმაცია.“

---

## 💡 ანუ მარტივად რომ ვთქვათ:

როცა წერ:

```ts
await postsRepository.find({
  relations: { metaOptions: true },
});
```

ეს ნიშნავს:

> “მომიტანე ყველა პოსტი თავისი metaOptions-ით ერთად”

და ამიტომაც შედეგში მიიღებ მაგალითად ასეთ ობიექტს:

```js
[
  {
    id: 1,
    title: 'Hello World',
    metaOptions: {
      id: 5,
      keywords: 'nestjs, typescript',
      description: 'post about nestjs',
    },
  },
];
```

---

## 📘 ანალოგია რეალური ცხოვრებიდან

წარმოიდგინე, შენ ეძებ ყველა “პოსტს” და გინდა რომ TypeORM-მა:

> „პოსტის გვერდით მოიტანოს მისი დამატებითი ინფორმაცია (metaOptions),
> და ეს ყველაფერი ერთ ობიექტად დაგიბრუნოს.“

ესაა ზუსტად ის, რასაც `relations: { metaOptions: true }` აკეთებს.
SQL-ის ენაზე ეს არის **LEFT JOIN**.

---

## 🚀 და User-თანაც იგივე შეგიძლია:

თუ შენი `User` entity ასეა:

```ts
@OneToOne(() => Profile, { cascade: true })
@JoinColumn()
profile: Profile;
```

მაშინ შეგიძლია ასე გამოიძახო:

```ts
const user = await usersRepository.findOne({
  where: { id: userId },
  relations: { profile: true },
});
```

👉 და მიიღებ:

```js
{
  id: 1,
  name: "Nika",
  profile: {
    id: 7,
    bio: "I love programming!"
  }
}
```

---

## 🧩 მოკლედ:

| შენ რას წერ                        | რეალურად რა ხდება                            |
| ---------------------------------- | -------------------------------------------- |
| `relations: { metaOptions: true }` | TypeORM აკეთებს LEFT JOIN-ს                  |
| შედეგი                             | აბრუნებს ორივე ცხრილის მონაცემს ერთ ობიექტში |
| შეგიძლია რამდენიც გინდა ჩასვა      | nested joins-საც იჭერს 😎                    |
