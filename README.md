# Lerna - LMS Course Platform

**Lerna** is a modern, fully-featured Learning Management System (LMS) built for creators, educators, and students. Designed with performance and scalability in mind, Lerna provides a seamless experience for course creation, management, and learning.

## 🚀 Tech Stack

* **Next.js 15** - App Router & Server Actions
* **Tailwind CSS & Shadcn UI** - Clean and customizable UI
* **Neon Postgres** - Scalable serverless PostgreSQL
* **Prisma ORM** - Type-safe database access
* **Vercel** - Fast global deployment

## 🔐 Authentication & Security

* **Better-Auth**

  * Email OTP
  * GitHub OAuth
* **Arcjet Security**

  * Protection from XSS, SQL injection, and other web attacks
* **Rate Limiting** - Protects from abuse and brute force

## 📚 Core Features

* 🎥 **Custom Video Player**
* 🧑‍💼 **Admin Dashboard**
* 👤 **Customer Dashboard**
* 🧮 **Drag & Drop Course Builder**
* ✅ **Lesson Completion Tracking**
* 📈 **Progress Tracking**
* 📝 **Custom Rich Text Editor**
* 📊 **Beautiful Analytics Dashboard**
* 💳 **Stripe Payment Integration**
* 📁 **File Uploads to S3** (Presigned URLs)
* ⭐ **Custom Dropzone for file upload**

## 📱 Additional Features

* ✅ Fully responsive design (Mobile & Desktop)
* ✅ Clean, modular, and maintainable codebase
* ✅ DAL (Data Access Layer) for cleaner logic
* ✅ Performance-optimized architecture

## 📦 Getting Started

```bash
# 1. Clone the repo
$ git clone https://github.com/YousiefSameh/lerna.git

# 2. Install dependencies
$ cd lerna
$ npm install

# 3. Set environment variables
$ cp .env.example .env
# Add credentials for DB, Auth, Stripe, S3, etc.

# 4. Run locally
$ npm run dev
```

## 📤 Deployment

Deployed and optimized for Vercel. Push to `main` and Vercel handles the rest.

## Contributing
We welcome contributions to improve **Lerna**! To contribute, follow these steps:

1. **Fork the Repository**:
  Click the "Fork" button on the top right corner of the repository page to create a copy of the repository in your GitHub account.

2. **Clone Your Fork**:
  Clone your forked repository to your local machine:
  ```bash
  git clone https://github.com/YousiefSameh/lerna.git
  cd lerna
  ```

3. **Create a Branch**:
  Create a new branch for your feature or bug fix:
  ```bash
  git checkout -b feature/your-feature-name
  ```

4. **Make Changes**:
  Implement your changes in the codebase. Ensure your code adheres to the project's coding standards.

5. **Test Your Changes**:
  Run the application and any relevant tests to verify your changes.

6. **Commit Your Changes**:
  Commit your changes with a descriptive commit message:
  ```bash
  git commit -m "Add feature: your-feature-name"
  ```

7. **Push to Your Fork**:
  Push your branch to your forked repository:
  ```bash
  git push origin feature/your-feature-name
  ```

8. **Open a Pull Request**:
  Go to the original repository and open a pull request. Provide a clear description of your changes and link any related issues.


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by me