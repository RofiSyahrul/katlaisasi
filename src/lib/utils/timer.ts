import { ONE_SECOND_IN_MS } from '$lib/constants/time';

const DEFAULT_TIMEOUT_INTERVAL = 10 * ONE_SECOND_IN_MS;

export default class Timer {
  protected timer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    protected callback: () => void | Promise<void>,
    protected timeoutInterval = DEFAULT_TIMEOUT_INTERVAL
  ) {}

  public destroy() {
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  public init() {
    if (this.timer == null) {
      this.timer = setTimeout(async () => {
        this.destroy();
        await this.callback();
      }, this.timeoutInterval);
    }
  }

  public reset() {
    this.destroy();
    this.init();
  }
}
