
# Usage Instructions

### Install dependencies
Run:
```bash
npm install
````

---

### Download all JS files from a URL

Run:

```bash
node index.js --src https://site.com
```

Replace the URL with the desired website to download all JS chunks.

---

### Manually delete unnecessary files

Clean up the `js` folder by removing unwanted files as needed.

---

### Format JS files with Prettier

Run:

```bash
npx prettier --write "js/**/*.{js,json,ts,css,md}"
```

This formats all JavaScript and related files inside the `js` directory.

---

### Combine all chunks into one JS file

Run:

```bash
node combiner.js
```

The combined output will be saved as `result.js`.

