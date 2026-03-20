# 🧱 ჯერ გავიგოთ: რა არის class?

```ts
class Dog {
  name: string;

  bark() {
    console.log('woof');
  }
}
```

👉 ეს არის უბრალოდ **გეგმა (Blueprint)**
როგორც LEGO-ს ინსტრუქცია.

❗ აქ ჯერ ძაღლი არ არსებობს — უბრალოდ წერია, როგორი უნდა იყოს.

---

# 🐶 რა არის instance (ინსტანსი)?

```ts
const myDog = new Dog();
```

👉 ეს უკვე **რეალური ობიექტია**

ანუ:

- class = „გეგმა“
- instance = „ამ გეგმით აშენებული რეალური რაღაც“

📌 მაგალითი:

- class = „მანქანის დიზაინი“
- instance = „რეალური მანქანა“

---

# 📦 ახლა ცვლადი (variable)

```ts
const x = 5;
```

👉 ეს არის უბრალოდ მნიშვნელობა

ან:

```ts
const name = 'Gio';
```

👉 აქ:

- არ არის ლოგიკა
- არ აქვს ფუნქციები
- უბრალოდ მონაცემია

---

# 🔥 მთავარი განსხვავება

|                 | ცვლადი      | instance                      |
| --------------- | ----------- | ----------------------------- |
| რა არის         | მნიშვნელობა | ობიექტი (class-იდან შექმნილი) |
| აქვს ფუნქციები? | ❌          | ✅                            |
| აქვს სტრუქტურა? | ❌          | ✅                            |
| შექმნა          | პირდაპირ    | `new`-ით                      |

---

# 🤯 ახლა NestJS Injection

აი აქ ხდება მაგია ✨

```ts
@Injectable()
export class UserService {
  getUsers() {
    return [];
  }
}
```

და მერე:

```ts
@Controller()
export class UserController {
  constructor(private userService: UserService) {}
}
```

---

## 🤝 რა ხდება აქ რეალურად?

👉 NestJS აკეთებს ამას შენს მაგივრად:

```ts
const userServiceInstance = new UserService();
```

და მერე გაძლევს:

```ts
this.userService = userServiceInstance;
```

---

# 🧠 ანუ Injection = ავტომატური instance შექმნა

👉 შენ არ წერ `new`
👉 NestJS თვითონ ქმნის instance-ს და გაძლევს

---

# 🧩 ძალიან მარტივი მაგალითი

იფიქრე ასე:

- class = „ყავის აპარატის მოდელი“
- instance = „რეალური აპარატი“
- injection = „ვიღაცამ უკვე ჩაგიდგა აპარატი სახლში“

👉 შენ აღარ გჭირდება ყიდვა (`new`)

---

# ⚡ საბოლოო შეჯამება

- **ცვლადი** → უბრალოდ მნიშვნელობა (5, "hello")
- **class** → გეგმა
- **instance** → ამ გეგმით შექმნილი რეალური ობიექტი
- **injection (NestJS)** → framework თვითონ გიქმნის instance-ს
