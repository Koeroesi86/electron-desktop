(() => {
  const alias = "clock";
  const intervals = [];
  // eslint-disable-next-line global-require
  const path = require("path");

  /** @type LoadWidget */
  const load = ({ element, onStateChange, initialState }) => {
    (async () => {
      // eslint-disable-next-line no-param-reassign
      element.innerHTML = `
        <link
          rel="stylesheet"
          href="file://${path.resolve(process.cwd(), "./examples/clock.css")}"
        />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700;900&display=swap" rel="stylesheet"/>
        <div class="clock-widget">
          <div class="text">
            <div class="hour"></div>
            <div class="minute"></div>
          </div>
          <div class="progress">
            <div class="bar"></div>
          </div>
        </div>
      `;

      const clockNode = element.querySelector(".clock-widget");
      const hourNode = clockNode.querySelector(".hour");
      const minuteNode = clockNode.querySelector(".minute");
      const barNode = clockNode.querySelector(".progress .bar");

      function formatNumber(n) {
        return n < 10 ? `0${n}` : n;
      }

      function setTime(node, value) {
        const parsed = formatNumber(value);
        if (node.innerHTML !== parsed) {
          // eslint-disable-next-line no-param-reassign
          node.innerHTML = parsed;
        }
      }

      function refresh() {
        const date = new Date();

        setTime(hourNode, date.getHours());
        setTime(minuteNode, date.getMinutes());
        barNode.style.height = `${(date.getSeconds() / 60) * 100}%`;
      }

      refresh();
      intervals.push(setInterval(refresh, 500));
    })();
  };

  window.widgetRegistry.register(alias, load, () => {
    intervals.forEach((interval, index) => {
      clearInterval(interval);
      intervals.splice(index, 1);
    });
  });
})();
