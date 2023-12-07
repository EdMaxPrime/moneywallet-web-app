# MoneyWallet web app

## About

This is a web interface for the Android mobile app MoneyWallet.

## Development

Do this once:
1. Clone this repository
2. Install [pocketbase](https://pocketbase.io) to provide the backend and database. Place the executable in this repository's folder
3. Run this shell command in this repository's folder: `./pocketbase migrate`
4. Install [Node Package Manager (npm)](npmjs.org)
5. Install the javascript packages with this shell command in the **frontend** folder: `npm i`

Every time you want to develop, run this shell command once in this repository's folder:
```bash
./pocketbase serve
```

And run this shell command in the **frontend** folder everytime you change the javascript code (and then refresh your browser):
```bash
npm run dev
```