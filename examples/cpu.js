/* eslint-disable global-require */
(() => {
  const alias = "cpu";
  const intervals = [];
  const si = require("systeminformation");
  const path = require("path");

  /** @type LoadWidget */
  const load = ({ element }) => {
    (async () => {
      // eslint-disable-next-line no-param-reassign
      element.innerHTML = `
      <link
        rel="stylesheet"
        href="file://${path.resolve(process.cwd(), "./examples/cpu.css")}"
      />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700;900&display=swap" rel="stylesheet"/>
      <div class="cpu-widget">
        <div class="title">CPU</div>
        <div class="progress">
          <div class="bar"></div>
        </div>
      </div>
    `;

      const usageNode = element.querySelector(".progress .bar");

      function refresh() {
        (async () => {
          try {
            // si.cpu().then(data => console.log('cpu', data));
            // si.cpuCurrentspeed().then(data => console.log('cpuCurrentspeed', data));
            // si.cpuTemperature().then(data => console.log('cpuTemperature', data));
            // si.currentLoad().then(data => console.log('currentLoad', data));
            const currentLoad = await si.currentLoad();

            usageNode.style.width = `${Math.round(currentLoad.currentLoad)}%`;
          } catch (e) {
            console.error(e);
          }
        })();
      }

      refresh();
      intervals.push(setInterval(refresh, 2000));
    })();
  };

  window.widgetRegistry.register(alias, load, () => {
    intervals.forEach((interval, index) => {
      clearInterval(interval);
      intervals.splice(index, 1);
    });
  });
})();
