/* eslint-disable global-require */
(() => {
  const path = require("path");
  const si = require("systeminformation");
  const alias = "memory";
  const intervals = [];

  /** @type LoadWidget */
  const load = ({ element }) => {
    (async () => {
      // eslint-disable-next-line no-param-reassign
      element.innerHTML = `
      <link
        rel="stylesheet"
        href="file://${path.resolve(process.cwd(), "./examples/memory.css")}"
      />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700;900&display=swap" rel="stylesheet"/>
      <div class="memory-widget">
        <div class="title">RAM</div>
        <div class="progress">
          <div class="bar"></div>
        </div>
      </div>
    `;

      const usageBarNode = element.querySelector(".progress .bar");

      function refresh() {
        (async () => {
          try {
            // si.cpu().then(data => console.log('cpu', data));
            // si.cpuCurrentspeed().then(data => console.log('cpuCurrentspeed', data));
            // si.cpuTemperature().then(data => console.log('cpuTemperature', data));
            // si.currentLoad().then(data => console.log('currentLoad', data));
            const data = await si.mem();
            const used = (data.used / data.total) * 100;

            usageBarNode.style.width = `${Math.round(used)}%`;
          } catch (e) {
            console.error(e);
          }
        })();
      }

      refresh();
      intervals.push(setInterval(() => refresh(), 5000));
    })();
  };

  window.widgetRegistry.register(alias, load, () => {
    intervals.forEach((interval, index) => {
      clearInterval(interval);
      intervals.splice(index, 1);
    });
  });
})();
