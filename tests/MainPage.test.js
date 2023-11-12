const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Options } = require('selenium-webdriver/chrome');

describe('Stock Trading Page Tests', () => {
    let driver;

    beforeAll(async () => {
        const options = new Options().headless(); // Use headless mode for automated tests
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Buy and Sell Stocks on Stock Trading Page', async () => {
        // Navigate to your stock trading page
        await driver.get('http://localhost:5173/main');

        // Login if necessary
        // Example:
        // await driver.findElement(By.id('username')).sendKeys('your-username', Key.RETURN);
        // await driver.findElement(By.id('password')).sendKeys('your-password', Key.RETURN);

        // Find the quantity input field and enter the desired quantity
        const quantityInput = await driver.findElement(By.id('quantity'));
        await driver.wait(until.elementIsVisible(quantityInput), 10000);
        await quantityInput.sendKeys('10', Key.RETURN);

        // Find the buy button and click it
        await driver.findElement(By.className('buy-button')).click();

        // Wait for the transaction to be processed (adjust time as needed)
        await driver.sleep(5000);

        // Check if the balance has been updated correctly
        const balanceAfterBuy = await driver.findElement(By.id('balance-element')).getText();
        expect(balanceAfterBuy).toEqual('Expected Balance After Buying 10 Stocks');

        // Check if the stock information has been updated correctly
        const stockInfoAfterBuy = await driver.findElement(By.className('stock-info')).getText();
        expect(stockInfoAfterBuy).toEqual('Expected Stock Info After Buying 10 Stocks');

        // Find the sell button and click it
        await driver.findElement(By.className('sell-button')).click();

        // Wait for the transaction to be processed (adjust time as needed)
        await driver.sleep(5000);

        // Check if the balance has been updated correctly after selling
        const balanceAfterSell = await driver.findElement(By.id('balance-element')).getText();
        expect(balanceAfterSell).toEqual('Expected Balance After Selling 10 Stocks');

        // Check if the stock information has been updated correctly after selling
        const stockInfoAfterSell = await driver.findElement(By.className('stock-info')).getText();
        expect(stockInfoAfterSell).toEqual('Expected Stock Info After Selling 10 Stocks');
    }, 30000); // Timeout for the test in milliseconds
});
