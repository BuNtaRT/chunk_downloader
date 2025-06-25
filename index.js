const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        cleanDir(curPath);
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    }
  } else {
    fs.mkdirSync(dir);
  }
}

function getArgValue(name) {
  const index = process.argv.indexOf(name);
  if (index !== -1 && process.argv.length > index + 1) {
    return process.argv[index + 1];
  }
  return null;
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https")
      ? require("https")
      : require("http");
    protocol
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          return reject(
            new Error(`Failed to get '${url}', status ${res.statusCode}`)
          );
        }
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          console.log(`Saved ${filepath}`);
          resolve();
        });
        fileStream.on("error", reject);
      })
      .on("error", reject);
  });
}

(async () => {
  const targetUrl = getArgValue("--url") || "https://market.csgo.com/ru/";

  if (
    !targetUrl ||
    !(targetUrl.includes("https://") || targetUrl.includes("http://"))
  )
    throw new Error(
      `link not valid \n--link "${targetUrl}"\nuse --url for pass link`
    );

  console.log(`Loading page: ${targetUrl}`);

  const jsDir = path.resolve(__dirname, "js");
  cleanDir(jsDir);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const jsUrls = new Set();

  page.on("request", (request) => {
    const url = request.url();
    if (url.endsWith(".js") || url.includes("/chunk")) {
      jsUrls.add(url);
    }
  });

  await page.goto(targetUrl, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 3000));

  const downloadPromises = [];
  for (const url of jsUrls) {
    const filename = path.basename(url.split("?")[0]);
    const filepath = path.join(jsDir, filename);
    downloadPromises.push(downloadFile(url, filepath));
  }
  await Promise.all(downloadPromises);

  await browser.close();
})();
