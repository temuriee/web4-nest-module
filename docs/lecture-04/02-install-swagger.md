### 🔧 1️⃣ `const config = new DocumentBuilder()`

👉 ქმნის **Swagger კონფიგურაციის ობიექტს**, ანუ „დოკუმენტის ბილდერს“.
ეს builder-სავითაა — ეტაპობრივად აყალიბებ აღწერას (title, version, etc.), მერე `.build()` ქმნის საბოლოო ობიექტს.

---

### 📘 2️⃣ `.setTitle('NestJS Masterclass - Blog app API')`

👉 **სათაური**, რომელიც გამოჩნდება Swagger UI-ის თავში.
მაგალითად: _“NestJS Masterclass - Blog app API”_
ეს უბრალოდ ინფორმაციული ტექსტია დოკუმენტაციისთვის.

---

### 📝 3️⃣ `.setDescription('Use the base API URL as http://localhost:3000')`

👉 აღწერა, ანუ მცირე ტექსტი, რომელიც ეუბნება მომხმარებელს API-ის შესახებ.
აქ შეგიძლია მიუთითო როგორ იძახოს endpoints ან რა მიზანი აქვს API-ს.

---

### ⚖️ 4️⃣ `.setTermsOfService('http://localhost:3000/terms-of-service')`

👉 აქ შეგიძლია ჩასვა ბმული შენი სერვისის **Terms of Service** გვერდზე.
თუ არ გაქვს, შეგიძლია გამოტოვო — optional ველია.

---

### 📜 5️⃣ `.setLicense('MIT License', 'https://github.com/...')`

👉 მიუთითებს **ლიცენზიის სახელსა და ბმულს**, რომელიც აჩვენებს რა პირობებით შეგიძლია გამოიყენო ეს API.
მაგალითად „MIT License“, „Apache 2.0“ და ა.შ.

---

### 🌐 6️⃣ `.addServer('http://localhost:3000/')`

👉 ამატებს **სერვერის ბმულს**, ანუ რომელი base URL-დან მუშაობს API.
ეს Swagger UI-ში გამოჩნდება როგორც „Server“ dropdown.
შეგიძლია ერთზე მეტი სერვერიც დაამატო (მაგ. dev / staging / prod).

---

### 🧮 7️⃣ `.setVersion('1.0')`

👉 მიუთითებს API-ის ვერსიას — „v1“, „v2“ და ა.შ.
დოკუმენტაციაში გამოგადგება როცა მომავალში ცვლილებებს გააკეთებ.

---

### 🧱 8️⃣ `.build()`

👉 აგროვებს ზემოთ დაწერილ ყველაფერს და ქმნის საბოლოო `OpenAPI Document` ობიექტს, რომელიც შემდეგ გამოიყენება swagger-ის შესაქმნელად.

---

### 🧩 9️⃣ `const document = SwaggerModule.createDocument(app, config)`

👉 ქმნის რეალურ swagger დოკუმენტს შენი **NestJS აპის როუტებიდან და დეკორატორებიდან** (`@ApiTags`, `@ApiProperty`, და სხვ.)
ანუ აქედან იბადება JSON აღწერა, რომელსაც swagger-ui წაიკითხავს.

---

### 🖥️ 🔟 `SwaggerModule.setup('api', app, document)`

👉 ამით აყენებ **Swagger UI-ს route-ს**.

- `'api'` — ნიშნავს რომ დოკუმენტაცია იქნება მისამართზე 👉 `http://localhost:3000/api`
- `app` — შენი NestJS აპის instance
- `document` — ზემოთ შექმნილი swagger JSON

---

### 🚀 🔚 `await app.listen(3000);`

👉 ეს უბრალოდ უშვებს სერვერს (NestJS აპს) პორტზე 3000.
როცა გაეშვება, შეგიძლია swagger UI გახსნა აქ:

> 🔗 `http://localhost:3000/api`
