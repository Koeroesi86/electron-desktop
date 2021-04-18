(() => {
  const alias = "cpu";
  const intervals = [];
  // eslint-disable-next-line global-require
  const si = require("systeminformation");
  // eslint-disable-next-line global-require
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
        <div>CPU</div>
        <div class="usage"></div>
      </div>
    `;

      const usageNode = element.querySelector(".usage");

      function refresh() {
        (async () => {
          try {
            // si.cpu().then(data => console.log('cpu', data));
            // si.cpuCurrentspeed().then(data => console.log('cpuCurrentspeed', data));
            // si.cpuTemperature().then(data => console.log('cpuTemperature', data));
            // si.currentLoad().then(data => console.log('currentLoad', data));
            const currentLoad = await si.currentLoad();

            usageNode.innerHTML = `${Math.round(currentLoad.currentLoad)}%`;
          } catch (e) {
            console.error(e);
          }
        })();
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
