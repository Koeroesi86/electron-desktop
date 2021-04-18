(() => {
  const alias = "disk";
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
          href="file://${path.resolve(process.cwd(), "./examples/disk.css")}"
        />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700;900&display=swap" rel="stylesheet"/>
        <div class="disk-widget">
          <div>Disk</div>
          <div class="stats"></div>
        </div>
    `;

      const usageNode = element.querySelector(".stats");

      function refresh() {
        (async () => {
          try {
            // si.cpu().then(data => console.log('cpu', data));
            // si.cpuCurrentspeed().then(data => console.log('cpuCurrentspeed', data));
            // si.cpuTemperature().then(data => console.log('cpuTemperature', data));
            // si.currentLoad().then(data => console.log('currentLoad', data));
            const data = await si.fsSize();
            usageNode.innerHTML = data
              .map(
                (d) =>
                  `
                    <div class="disk">
                      <div class="name">${d.fs.replace(/:$/, "")}</div>
                      <div class="usage">${Math.round(d.use)}%</div>
                    </div>
                  `
              )
              .join("\n");
          } catch (e) {
            console.error(e);
          }
        })();
      }

      refresh();
      intervals.push(setInterval(refresh, 10000));
    })();
  };

  window.widgetRegistry.register(alias, load, () => {
    intervals.forEach((interval, index) => {
      clearInterval(interval);
      intervals.splice(index, 1);
    });
  });
})();
