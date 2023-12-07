import chalk from 'chalk';
import fs from 'fs';
import fsAsync from 'fs/promises';
import path from 'path';

if (process.env.ENABLE_LOGS) {
  fs.mkdirSync(path.join(__dirname, '/../../logs'), { recursive: true });
}

const logDir = fs.existsSync(path.join(__dirname, '/../../logs')) ? path.join(__dirname, '/../../logs') : undefined;
console.log(logDir ? `Logging to ${logDir}` : 'Logging disabled');

export class Logger {
  reqIP?: { ip?: string | string[]; url: string };
  constructor(reqData?: { ip?: string | string[]; url: string }) {
    this.reqIP = reqData;
  }

  async Log(message: any) {
    console.log({
      info: await Format({
        reqData: this.reqIP,
        message,
        status: chalk.yellowBright('LOG'),
      }),
      msg: message,
    });
  }

  async Info(message: any) {
    if (process.env.NODE_ENV !== 'development') return; // Only log in development
    console.log(
      await Format({
        reqData: this.reqIP,
        message,
        status: chalk.blue('INFO'),
      })
    );
  }

  async Warn(message: any) {
    console.log(
      await Format({
        reqData: this.reqIP,
        message,
        status: chalk.yellow('WARN'),
      })
    );
  }

  async Error(message: any) {
    console.log(
      await Format({
        reqData: this.reqIP,
        message,
        status: chalk.red('ERROR'),
      })
    );
  }

  async Success(message: any) {
    console.log(
      await Format({
        reqData: this.reqIP,
        message,
        status: chalk.green('SUCCESS'),
      })
    );
  }
}

interface ChalkFormat {
  message: unknown;
  status: string;
  reqData?: { ip?: string | string[]; url: string };
}

const Format = async (info: ChalkFormat): Promise<string> => {
  const date = new Date();
  if (info.reqData) {
    info.reqData.ip = Array.isArray(info.reqData.ip) ? info.reqData.ip[0]?.split(',')[0] : info.reqData.ip;
  }

  if (typeof info.message == 'object') info.message = JSON.stringify(info.message);
  const line = `[${date.toLocaleString()}]${info.reqData?.ip ? chalk.blue(' -IP: ') + info.reqData.ip + '- ' : ''} ${
    info.status
  } ${info.message} ${info.reqData?.url ? 'on url: ' + info.reqData?.url : ''}`;

  if (!logDir) return line;
  const logLine = `[${date.toLocaleString()}]${info.reqData?.ip ? ' -IP: ' + info.reqData.ip + '- ' : ''} ${
    info.message
  } ${info.reqData?.url ? 'on url: ' + info.reqData?.url : ''}`;

  const logdate = `${date.getFullYear()}-${date.getMonth() + 1}`;
  if (!fs.existsSync(`${logDir}/${logdate}`)) {
    await fsAsync.mkdir(`${logDir}/${logdate}`);
  }

  await fsAsync.appendFile(`${logDir}/${logdate}/${date.getDate()}.log`, logLine + '\n', { encoding: 'utf8' });

  return line;
};

export default Logger;
