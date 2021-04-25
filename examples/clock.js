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
            <div class="indicator background">
              <svg viewBox="0 0 200 200">
                <path />
              </svg>
            </div>
            <div class="indicator seconds">
              <svg viewBox="0 0 200 200"">
                <path />
              </svg>
            </div>
          </div>
        </div>
      `;

      const clockNode = element.querySelector(".clock-widget");
      const hourNode = clockNode.querySelector(".hour");
      const minuteNode = clockNode.querySelector(".minute");
      const progressNode = clockNode.querySelector(".progress");
      const backgroundNode = clockNode.querySelector(".progress .indicator.background svg");
      const newIndicatorSvg = clockNode.querySelector(".progress .indicator.seconds svg");
      const newIndicatorNode = clockNode.querySelector(".progress .indicator.seconds svg path");

      function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

        return {
          x: centerX + radius * Math.cos(angleInRadians),
          y: centerY + radius * Math.sin(angleInRadians),
        };
      }

      function describeArc(x, y, radius, startAngle, endAngle) {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
      }

      backgroundNode.querySelector("path").setAttribute("d", describeArc(0, 100, 90, 0, 180));

      function fixSizes() {
        if (backgroundNode.style.width !== progressNode.clientWidth) {
          backgroundNode.style.width = progressNode.clientWidth;
          backgroundNode.style.height = progressNode.clientWidth;
        }
        if (newIndicatorSvg.style.width !== progressNode.clientWidth) {
          newIndicatorSvg.style.width = progressNode.clientWidth;
          newIndicatorSvg.style.height = progressNode.clientWidth;
        }
      }

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
        fixSizes();
        newIndicatorNode.setAttribute("d", describeArc(0, 100, 90, 0, (date.getSeconds() / 60) * 180));
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
