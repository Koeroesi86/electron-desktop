((): void => {
  const scripts: { [k: string]: boolean }= {};

  const loadScript = async (src: string, node: HTMLElement = document.body) => {
    const script = document.createElement('script');
    // widget.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms';
    script.src = src;
    await new Promise<void>((resolve, reject) => {

      script.addEventListener('load', () => {
        node.removeChild(script);
        resolve();
      });

      node.appendChild(script);
    });
  };

  window.scriptRegistry = {
    add: async (src) => {
      if (!scripts[src]) {
        await loadScript(src);
      }
    }
  }
})();