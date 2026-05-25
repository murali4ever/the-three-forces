/** Privacy-friendly analytics via GoatCounter — tracks chapter views (hash routes). */
const Analytics = {
  /** Set your GoatCounter site code (subdomain) from https://www.goatcounter.com/ */
  site: 'three-forces',

  init() {
    if (!this.site || this._started) return;
    this._started = true;
    window.goatcounter = { no_onload: true };
    const script = document.createElement('script');
    script.dataset.goatcounter = `https://${this.site}.goatcounter.com/count`;
    script.async = true;
    script.src = 'https://gc.zgo.at/count.js';
    document.head.appendChild(script);
  },

  /** Virtual path for dashboard — e.g. /chapter/electricity-1 */
  chapterPath(chapterId) {
    const id = chapterId || 'home';
    return `/chapter/${id}`;
  },

  trackPage(chapterId) {
    if (!this.site) return;
    this.init();
    const path = this.chapterPath(chapterId);
    const title = document.title;
    const send = () => {
      if (window.goatcounter && typeof window.goatcounter.count === 'function') {
        window.goatcounter.count({ path, title, event: true });
      }
    };
    send();
    window.setTimeout(send, 300);
  },
};
