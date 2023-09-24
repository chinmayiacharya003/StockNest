document.addEventListener("DOMContentLoaded", function () {
    const buyButtons = document.querySelectorAll(".buy");
    const sellButtons = document.querySelectorAll(".sell");
    const outputElement = document.querySelector(".output");

    const portfolio = new Map(); // Store bought stocks and their quantities

    buyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const stockName = button.parentNode.parentNode.querySelector("td:first-child").textContent;
            updatePortfolio(stockName, "BUY");
        });
    });

    sellButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const stockName = button.parentNode.parentNode.querySelector("td:first-child").textContent;
            updatePortfolio(stockName, "SELL");
        });
    });

    function updatePortfolio(stockName, action) {
        if (action === "BUY") {
            if (portfolio.has(stockName)) {
                portfolio.set(stockName, portfolio.get(stockName) + 1);
            } else {
                portfolio.set(stockName, 1);
            }
        } else if (action === "SELL") {
            if (portfolio.has(stockName) && portfolio.get(stockName) > 0) {
                portfolio.set(stockName, portfolio.get(stockName) - 1);
            }
        }

        displayPortfolio();
    }

    function displayPortfolio() {
        const portfolioArray = Array.from(portfolio.entries());
        let outputHTML = "<h3>Portfolio</h3>";

        if (portfolioArray.length === 0) {
            outputHTML += "Your portfolio is empty.";
        } else {
            portfolioArray.forEach(([stockName, quantity]) => {
                outputHTML += `<p>${stockName}: ${quantity} shares</p>`;
            });
        }

        outputElement.innerHTML = outputHTML;
    }
});
