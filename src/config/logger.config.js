const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

const { combine, timestamp, printf, errors, json } = winston.format;

// Niveles personalizados de logging.
const niveles = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "green",
    http: "cyan",
    debug: "blue",
  },
};

winston.addColors(niveles.colors);

// Formato legible para consola.
const formatoConsola = combine(
  errors({ stack: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}] ${stack || message}`;
  })
);

// Directorio de persistencia.
const directorioLogs = path.join(__dirname, "../../logs");

// Configuración centralizada.
const logger = winston.createLogger({
  levels: niveles.levels,

  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  transports: [
    // Salida por consola.
    new winston.transports.Console({
      format: formatoConsola,
    }),

    // Archivo general con rotación diaria.
    new DailyRotateFile({
      filename: path.join(directorioLogs, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: combine(timestamp(), json()),
    }),

    // Archivo exclusivo para errores y fallas críticas.
    new DailyRotateFile({
      filename: path.join(directorioLogs, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      level: "error",
      format: combine(timestamp(), json()),
    }),
  ],
});

module.exports = logger;
