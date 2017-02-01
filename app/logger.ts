/**
 * Created by snatvb on 01.02.17.
 */

import * as chalk from 'chalk';

export function error (err: string): void {
    console.log(chalk.red(err));
}

export function success (msg: string) {
    console.log(chalk.green(msg));
}