const fs = require("fs");
const path = require("path");

enum Levels {
  Info = "\u001b[34m",
  Debug = "\u001b[32m",
  Trace = "\u001b[37m",
  Warn = "\u001b[33m",
  Error = "\u001b[31m",
  Fatal = "\u001b[41m",
}
export default class Logger {
  name: string;
  path: string;
  cacheSize: number;
  cache: string[];
  private _storeLog: (level: keyof typeof Levels, ...data: unknown[]) => void;
  constructor(name: string, dir: string = "./logs", cacheSize: number = 100) {
    this.name = name;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    this.path = path.join(
      dir,
      `${new Date().toISOString().replaceAll(":", "-").split(".")[0]}-${
        this.name
      }.log`
    );
    this.cacheSize = cacheSize;
    this.cache = [];
    this._log = this._log.bind(this);
    this._store = this._store.bind(this);
    this._storeLog = this._store(this._log);
  }

  private _store<
    T extends (...args: [keyof typeof Levels, ...unknown[]]) => any
  >(fn: T): (...args: Parameters<T>) => ReturnType<T> {
    return (...args: Parameters<T>): ReturnType<T> => {
      const [level, ...data] = args;
      const log = `[${level}] ${
        new Date().toISOString().replace("T", " ").split(".")[0]
      } ${this.name} ${JSON.stringify(data)}`;

      this.cache.push(log);
      if (this.cache.length >= this.cacheSize) {
        fs.appendFileSync(this.path, this.cache.map((l) => `${l}\n`).join(""));
        this.cache = [];
      }
      return fn(...([level, ...data] as const));
    };
  }

  private _log(level: keyof typeof Levels, ...data: unknown[]) {
    console.log(
      `${Levels[level]}\u001b[1m[${level}]\u001b[0m ${
        Levels[level]
      }${new Date().toLocaleTimeString()} ${this.name}\u001b[0m`,
      ...data
    );
  }
  public info(data: unknown) {
    this._log("Info", data);
  }
  public debug(data: unknown) {
    this._log("Debug", data);
  }
  public trace(data: unknown) {
    this._log("Trace", data);
  }
  public warn(data: unknown) {
    this._log("Warn", data);
  }
  public error(data: unknown) {
    this._storeLog("Error", data);
  }
  public fatal(data: unknown) {
    this._storeLog("Fatal", data);
  }
  close() {
    fs.appendFileSync(this.path, this.cache.map((l) => `${l}\n`).join(""));
  }
}
