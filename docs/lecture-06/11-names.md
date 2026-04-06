## 🎯 კითხვა:

> როცა Many-to-Many კავშირს ვქმნით `@JoinTable()`-ით —
> შუა ცხრილი როგორ და რა სახელით იქმნება ავტომატურად?

---

## 💡 მოკლე პასუხი:

TypeORM **ავტომატურად ქმნის შუა ცხრილს**,
და სახელს აყალიბებს **ორივე entity-ს სახელების მიხედვით**,
პლუს `_` (ქვედა ტირეს) შუაში.

---

## 📘 მაგალითი

ვთქვათ გვაქვს ასეთი კავშირი:

```ts
@ManyToMany(() => Subject)
@JoinTable()
subjects: Subject[];
```

### Entities:

- `Student`
- `Subject`

👉 TypeORM შექმნის შუა ცხრილს სახელით:

```
student_subjects_subject
```

ჰო, ცოტა უცნაურად გამოიყურება 😅 მაგრამ აი როგორ ფიქრობს TypeORM:

> <source entity name>*<property name>*<target entity name>

---

## 🧩 ანუ ჩვენს მაგალითში:

- source entity → `student`
- property name → `subjects`
- target entity → `subject`

შედეგი:

```
student_subjects_subject
```

---

## 💬 მაგრამ შენ შეგიძლია **სახელი აკონტროლო**!

`@JoinTable()` შეგიძლია მიუწერო პარამეტრებით 👇

```ts
@ManyToMany(() => Subject, (subject) => subject.students)
@JoinTable({
  name: "students_subjects", // 👈 შენი საკუთარი ცხრილის სახელი
  joinColumn: {
    name: "student_id", // სვეტი რომელიც Student-ზე მიუთითებს
    referencedColumnName: "id",
  },
  inverseJoinColumn: {
    name: "subject_id", // სვეტი რომელიც Subject-ზე მიუთითებს
    referencedColumnName: "id",
  },
})
subjects: Subject[];
```

---

## 📦 ამით მიიღებ ბაზაში ასეთ ცხრილს:

### `students_subjects`

| student_id | subject_id |
| ---------- | ---------- |
| 1          | 1          |
| 1          | 2          |
| 2          | 2          |

💡 ანუ **სახელი, სვეტები და სტილი სრულიად შენ შეგიძლია დააკონტროლო.**

---

## 🧠 მოკლე შეჯამება:

| რა                  | როგორ იქმნება ავტომატურად      | შეგიძლია შეცვალო?      |
| ------------------- | ------------------------------ | ---------------------- |
| შუა ცხრილის სახელი  | `<source>_<property>_<target>` | ✅ `name` პარამეტრით   |
| პირველი foreign key | `<sourceEntity>_id`            | ✅ `joinColumn`        |
| მეორე foreign key   | `<propertyName>_id`            | ✅ `inverseJoinColumn` |

---

## 🎨 რეალური მაგალითი პატარა ტვიკისთვის:

თუ შენს entity-ს ერქმევა `User` და `Role`:

```ts
@ManyToMany(() => Role)
@JoinTable()
roles: Role[];
```

TypeORM შექმნის ცხრილს სახელით:

```
user_roles_role
```

მაგრამ შენ შეგიძლია გაუმჯობესო 👇

```ts
@JoinTable({
  name: "user_roles",
  joinColumn: { name: "user_id" },
  inverseJoinColumn: { name: "role_id" },
})
```
