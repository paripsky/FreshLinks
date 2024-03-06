[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub deployments](https://img.shields.io/github/deployments/paripsky/freshlinks/Production?label=Production%20build)
![Static Badge](https://img.shields.io/badge/Fresh-yellow?logo=deno&label=Deno)

# <img src="static/logo.png" alt="drawing" width="24"/> FreshLinks

FreshLinks is a short link generator with analytics, built using Fresh and Deno.

## 🍋 What is FreshLinks?

FreshLinks allows you to easily generate short links for URLs along with
analytics to track their usage. It's built on Fresh, a web framework for Deno,
providing a modern and efficient development experience.

## 🛠️ How to Run in Development

To run FreshLinks in development mode, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/paripsky/FreshLinks.git
   ```

2. Navigate to the project directory:
   ```bash
   cd FreshLinks
   ```

3. Create a `.env` file in the root directory and set the following environment
   variables:
   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. Start the development server:
   ```bash
   deno task start
   ```

## 🚧 How to Build

To build FreshLinks, simply run:

```bash
deno task build
```

## 🔑 GitHub OAuth Setup

To enable GitHub authentication, you need to set up a GitHub OAuth App. Follow
the instructions
[here](https://docs.github.com/en/developers/apps/creating-an-oauth-app).

## 🌟 Resources

- [Fresh](https://fresh.deno.dev/)
- [Deno Deploy](https://deno.com/deploy)
- [Deno KV](https://deno.com/kv)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md)
file for details.
