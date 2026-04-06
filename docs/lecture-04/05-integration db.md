## 🔹 მთლიანი აზრი

`@Module()` დეკორატორი განსაზღვრავს **NestJS მოდულს** —
ეს არის ერთი „ბლოკი“, სადაც შეგიძლია მოაქციო დაკავშირებული controllers, services და სხვა მოდულები.

`AppModule` არის **root (მთავარი) მოდული**, საიდანაც იწყება მთელი აპი.

---

## 🔸 1️⃣ `imports: [ ... ]`

👉 აქ წერენ სხვა მოდულებს, რომლებიც გინდა ამ მოდულში გამოიყენო.

ამ მაგალითში ჩასმულია:

```ts
UsersModule,
PostsModule,
AuthModule,
TypeOrmModule.forRoot({...})
```

ანუ:

- AppModule-ს შეუძლია გამოიყენოს Users, Posts და Auth მოდულების ყველაფერი.
- ასევე იქმნება TypeORM-ის Database Connection.

---

## 🔸 2️⃣ `TypeOrmModule.forRoot({...})`

👉 ეს ხსნის **კავშირის ბაზასთან (PostgreSQL)**
აქ შენ წერ ყველა პარამეტრს, რაც სჭირდება TypeORM-ს რომ დაუკავშირდეს მონაცემთა ბაზას.

მაშინ ვნახოთ თითო ველი:

| Key                         | რას აკეთებს                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| **type: 'postgres'**        | განსაზღვრავს რომ ვიყენებთ PostgreSQL-ს                                        |
| **host: 'localhost'**       | ბაზა გაშვებულია ამ კომპიუტერზე                                                |
| **port: 5432**              | PostgreSQL-ის ნაგულისხმევი პორტი                                              |
| **username: 'postgres'**    | ბაზის მომხმარებელი                                                            |
| **password: 'postgres'**    | მისი პაროლი                                                                   |
| **database: 'nestjs-blog'** | ბაზის სახელი                                                                  |
| **entities: [User]**        | რომელი entity (კლასები) უნდა დაუკავშირდეს ამ ბაზას                            |
| **synchronize: true**       | ავტომატურად ქმნის ცხრილებს entity-ებიდან (გაფრთხილება: production-ში გამორთე) |

🔹 ანუ TypeORM ამ მონაცემებით უკავშირდება PostgreSQL-ს და ქმნის/კითხულობს ცხრილებს User entity-ის მიხედვით.

---

## 🔸 3️⃣ `controllers: [AppController]`

👉 აქ წერ controllers, რომლებიც ამ მოდულს ეკუთვნის.
Controller არის ფაილი, სადაც endpoints (routes) არის აღწერილი (`@Get()`, `@Post()` და სხვ.)

---

## 🔸 4️⃣ `providers: [AppService]`

👉 აქ წერ **services**, ანუ ლოგიკის კლასებს (მაგ: მონაცემთა დამუშავება, CRUD ოპერაციები).
Provider-ები ინექცირდება controllers-ში dependency injection-ით.

---

## 🔸 5️⃣ `export class AppModule {}`

👉 უბრალოდ ცარიელი კლასია, რომელსაც NestJS კითხულობს როგორც მოდულს.
ყველა ზემოთ აღწერილი რამ (@Module({...})) მიეკუთვნება მას.

---

## 🧠 მოკლედ ერთი წინადადებით:

> `AppModule` აერთიანებს ყველა სხვა მოდულს (Users, Posts, Auth) და ქმნის PostgreSQL კავშირს TypeORM-ის მეშვეობით. Controllers და Services აქედან იწყებენ მუშაობას, როცა აპი გაეშვება.
