# Proxy-based Web Scraper

This Node.js project leverages a proxy to perform web scraping tasks securely and efficiently. The application uses Express to set up a simple web server that handles HTTP GET requests to scrape specific data from web pages through a proxy server.

## Features

- Proxy authentication support
- Secure HTTPS requests using custom cipher suites
- Data extraction using the Cheerio library for parsing HTML
- Basic error handling and response timeout management

## Prerequisites

Before you start, ensure you have Node.js installed on your machine. You can download and install Node.js from [nodejs.org](https://nodejs.org).

This project also requires the following Node modules:

- express
- http
- https
- tls
- cheerio

## Installation

To get started with this project, clone the repository and install its dependencies:

```bash
git clone https://github.com/AdrjanZ/amazon_api_scraper
cd proxy-web-scraper
npm install
```

## Configuration

Update the `conf` object in the script with your proxy details:

```javascript
const conf = {
  proxy_username: 'proxylogin',
  proxy_password: 'proxypass',
  proxy_host: 'ip:port',
  proxy_port: 6060 // Proxy port
};
```

## Usage

To start the server, run:

```bash
node index.js
```

Once the server is running, you can make GET requests to the `/proxyRequest` endpoint with a `url` query parameter:

```bash
curl http://localhost:3000/proxyRequest?url=https://example.com
```

The server will respond with JSON data extracted from the specified URL.

## Customizing Cipher Suites

The project uses a custom arrangement of cipher suites to enhance security. You can modify the cipher suites by editing the `shuffledCiphers` array in the script.

## Contributing

Contributions are welcome! Please feel free to submit pull requests, create issues for bugs and feature requests, or improve documentation.
