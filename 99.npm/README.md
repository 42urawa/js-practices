# global-warming-ckecker

`global-warming-checker` is a CLI tool that allows users to select a location, base year, comparison year, and month through a series of questions and displays temperature data as a line graph. This tool scrapes data from the Japan Meteorological Agency and visualizes the data for comparison.

## Features

- **Interactive Questions**: Uses the Enquirer library to ask users for the location, base year, comparison year, and month.
- **Web Scraping**: Scrapes the Japan Meteorological Agency's website for average and maximum temperatures based on user input.
- **Data Visualization**: Uses the Chart.js library to display the scraped data as a line graph.

![image](https://github.com/kitarou888/js-practices/assets/85793702/350d1ef4-5200-4a42-9027-340f6a58b59b)

- **Server Activation**: Starts a local server using the Express library, allowing users to view the results in their browser.

## Installation

Run the following command in any directory.

```bash
npm init -y
```

```bash
npm install global-warming-checker
```

## Usage

1. Run the program:

```bash
node node_modules/global-warming-checker/src/main.js
```

Alternatively, you can add the following to `package.json` to make it executable with `npm start`.

```json
{
  "scripts": {
    "start": "node node_modules/global-warming-checker/src/main.js"
  }
}
```

2. Answer the questions prompted by the Enquirer library.

<img width="937" alt="image" src="https://github.com/kitarou888/js-practices/assets/85793702/43d063ce-5fe5-4915-9663-23d3d337fe0d">

<img width="934" alt="image" src="https://github.com/kitarou888/js-practices/assets/85793702/c907bfc1-f774-4b5e-abbc-b72e75dba574">

3. After all questions are answered:

- The program will scrape the Japan Meteorological Agency's website for the specified location, year, and month to obtain the average and maximum temperatures.

4. The program will create an HTML element with a line graph displaying the data using the Chart.js library.

5. Start the local server using the Express library:

## Required Libraries

- Enquirer
- Puppeteer
- Express
- Open

## Contributing

Contributions are welcome! Please report bugs or suggest features through the Issues page.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

If you have any questions or feedback, please contact us.
