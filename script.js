// ===== Wallet Balance Fetcher =====
// Fetch SOL balance from Solana wallet
async function fetchWalletBalance() {
  const walletAddress = "3AcZHYbPJTj66ttjh9xg1SDPad6dFt4e5TbDtF2Pwm2f";
  const rpcUrl = "https://api.mainnet-beta.solana.com";

  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [walletAddress],
      }),
    });

    const data = await response.json();
    if (data.result) {
      const balanceLamports = data.result.value;
      const balanceSOL = balanceLamports / 1e9; // Convert lamports to SOL

      // Fetch SOL price in USD
      const priceResponse = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const priceData = await priceResponse.json();
      const solPrice = priceData.solana.usd;
      const balanceUSD = balanceSOL * solPrice;

      // Format the ticker content
      const tickerContent = `lubeonchain.sol • ${balanceSOL.toFixed(2)} SOL • $${balanceUSD.toFixed(2)} USD • Wallet: 3AcZHYbPJTj66ttjh9xg1SDPad6dFt4e5TbDtF2Pwm2f`;

      // Update both tickers with duplicated content for seamless loop
      const topTicker = document.getElementById("topTicker");
      const bottomTicker = document.getElementById("bottomTicker");

      if (topTicker) {
        topTicker.innerHTML = `<span class="ticker-green">${tickerContent}</span><span class="ticker-green">${tickerContent}</span>`;
      }
      if (bottomTicker) {
        bottomTicker.innerHTML = `<span class="ticker-green">${tickerContent}</span><span class="ticker-green">${tickerContent}</span>`;
      }
    }
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    // Fallback content if fetch fails - create multiple alternating colored items
    const tickerContent =
      "lubeonchain.sol • Wallet data unavailable • Check back soon";
    const topTicker = document.getElementById("topTicker");
    const bottomTicker = document.getElementById("bottomTicker");

    let tickerHTML = "";
    for (let i = 0; i < 2; i++) {
      const colorClass = i % 2 === 0 ? "ticker-green" : "ticker-red";
      tickerHTML += `<span class="${colorClass}">${tickerContent}</span>`;
    }
    // Duplicate for seamless loop
    tickerHTML += tickerHTML;

    if (topTicker) {
      topTicker.innerHTML = tickerHTML;
    }
    if (bottomTicker) {
      bottomTicker.innerHTML = tickerHTML;
    }
  }
}

// ===== Loading Screen =====
// Handle 5-second loading screen on page load
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loadingScreen");
  const mainContent = document.getElementById("mainContent");
  const progressBar = document.getElementById("progressBar");
  const loadingPercentage = document.getElementById("loadingPercentage");

  const duration = 5000; // 5 seconds in milliseconds
  const startTime = Date.now();

  const animateProgress = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min((elapsed / duration) * 100, 100);

    progressBar.style.width = progress + "%";
    loadingPercentage.textContent = Math.floor(progress) + "%";

    if (progress < 100) {
      requestAnimationFrame(animateProgress);
    } else {
      // Loading complete
      loadingScreen.style.display = "none";
      mainContent.style.display = "flex";
      // Fetch wallet balance after loading screen finishes
      fetchWalletBalance();
    }
  };

  animateProgress();
});

// Set current year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Smooth scroll for in-page nav links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId && targetId.startsWith("#")) {
      e.preventDefault();
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});
