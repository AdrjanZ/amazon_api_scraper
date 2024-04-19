var http = require("http");
var https = require('https');
const tls = require('tls');
const express = require('express');
const app = express();
const cheerio = require('cheerio');

const conf = {
    proxy_username: 'proxylogin',
    proxy_password: 'proxypass',
    proxy_host: 'ip:port',
    proxy_port: 6060 // proxy port
};

const defaultCiphers = tls.DEFAULT_CIPHERS.split(':');
const shuffledCiphers = [
    defaultCiphers[0],
    defaultCiphers[2],  
    defaultCiphers[1],
    ...defaultCiphers.slice(3)
].join(':');


async function getURL(url, headers) {
    return new Promise((resolve, reject) => {
        const urlParsed = new URL(url);
        let htmlData = '';
        headers = headers || {};
        headers['Proxy-Authorization'] = 'Basic ' + Buffer.from(conf.proxy_username + ':' + conf.proxy_password).toString('base64');

        http.request({
            host: conf.proxy_host,
            port: conf.proxy_port,
            method: 'CONNECT',
            path: `${urlParsed.hostname}:443`,
            headers
        }).on('connect', (res, socket) => {
            delete headers['Proxy-Authorization'];  // Security measure

            if (res.statusCode === 200) {
                const agent = new https.Agent({ socket });

                var req = https.get({
                    host: urlParsed.hostname,
                    path: urlParsed.pathname,
                    agent,
                    headers: headers,
                    ciphers: shuffledCiphers  // custom ciphers
                }, (response) => {
                    const chunks = [];
                    response.on('data', (data) => {
                        htmlData += data.toString();
                    });
                    response.on('end', () => {
                        const $ = cheerio.load(htmlData);
                        const title = $('#productTitle').text().trim();
                        const sellerElement = $('.offer-display-feature-text-message');
                        let seller;

                        if (sellerElement.find('a').length > 0) {
                            seller = sellerElement.find('a').first().text().trim();
                        } else {
                            seller = sellerElement.first().text().trim();
                        }
                        const returnPolicyElement = $('.offer-display-feature-text[data-csa-c-type="widget"][data-csa-c-content-id="desktop-return-info"] span.offer-display-feature-text-message');
                        console.log(returnPolicyElement.length); // Sprawdź, czy znaleziono element
                        const availability = $('#availability').text().trim();

                        if (!title) {
                            reject('Could not get product title');
                        }

                        resolve({
                            title,
                            seller,
                            availability
                        });



                    });

                    response.on("error", (err) => {
                        reject(err);
                    });

                    response.setTimeout(15000, () => {
                        reject('Timeout');
                    });
                });

                req.on('error', (err) => {
                    reject(err.message);
                });
            } else {
                reject('Could not connect to proxy!');
            }

        }).on('error', (err) => {
            reject(err.message);
        }).end();
    });
}

// Express setup for GET endpoint
app.get('/proxyRequest', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send({ error: 'URL is required as a query parameter' });
    }

    try {
        const response = await getURL(url, {});
        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error processing request' });
    }
});

// Start the Express server
const PORT = 3000; // You can choose a different port if required
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});