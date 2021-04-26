/* eslint-disable global-require */
(() => {
  const alias = "system";
  const intervals = [];
  const si = require("systeminformation");
  const path = require("path");

  /** @type LoadWidget */
  const load = ({ element }) => {
    // eslint-disable-next-line no-param-reassign
    element.innerHTML = `
      <link
        rel="stylesheet"
        href="file://${path.resolve(process.cwd(), "./examples/system.css")}"
      />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700;900&display=swap" rel="stylesheet"/>
      <div class="system-widget">
        <div class="cpu">
          <div class="title">CPU</div>
          <div class="progress">
            <div class="bar"></div>
          </div>
        </div>
        <div class="memory">
          <div class="title">RAM</div>
          <div class="progress">
            <div class="bar"></div>
          </div>
        </div>
        <div class="disks">
          <div class="title">Disk</div>
          <div class="stats"></div>
        </div>
      </div>
    `;

    const cpuUsageBar = element.querySelector(".cpu .progress .bar");
    const memoryUsageBar = element.querySelector(".memory .progress .bar");
    const disksStats = element.querySelector(".disks .stats");

    const refresStats = (data) => {
      // console.log("data", data);
      cpuUsageBar.style.width = `${Math.round(data.currentLoad.currentLoad)}%`;
      memoryUsageBar.style.width = `${Math.round((data.mem.used / data.mem.total) * 100)}%`;
      data.fsSize.forEach((d) => {
        const diskStat = disksStats.querySelector(`div[data-mount="${d.mount}"]`);
        if (!diskStat) {
          const diskNode = document.createElement("div");
          diskNode.className = "disk";
          diskNode.setAttribute("data-mount", d.mount);
          diskNode.innerHTML = `
            <div class="name">${d.mount.replace(/:$/, "")}</div>
            <div class="progress">
              <div class="bar" style="width: ${Math.round(d.use)}%"></div>
            </div>
          `;
          disksStats.append(diskNode);
        } else {
          diskStat.querySelector(".bar").style.width = `${Math.round(d.use)}%`;
        }
      });

      disksStats.querySelectorAll("div[data-mount]").forEach((node) => {
        if (!data.fsSize.find((d) => d.mount === node.getAttribute("data-mount"))) {
          node.remove();
        }
      });
    };

    const valueObject = {
      currentLoad: "currentLoad",
      // cpuTemperature: "*", // TODO
      mem: "used, total",
      fsSize: "mount, use",
      // battery: "hasBattery, percent",
    };

    // si.getDynamicData("*", "*", console.log);
    si.get(valueObject).then(refresStats);
    intervals.push(si.observe(valueObject, 2000, refresStats));
  };

  window.widgetRegistry.register(alias, load, () => {
    intervals.forEach((interval, index) => {
      clearInterval(interval);
      intervals.splice(index, 1);
    });
  });
})();
