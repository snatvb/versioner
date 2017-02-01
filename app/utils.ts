import {Version} from "./index";
/**
 * Created by snatvb on 01.02.17.
 */

export interface Command {
    name: string,
    value: string
}

export function getCommand (command: string): Command {
    const indexCmd = process.argv.indexOf(command);
    if (indexCmd === -1) {
        return null;
    }
    const cmd = process.argv[indexCmd];
    return {
        name: cmd,
        value: process.argv[indexCmd + 1]
    };
}

export function sameVersion(version: string, version2: Version) : boolean {
    const vers = `${version2.major}.${version2.core}.${version2.minor}`;
    return vers === version;
}

export function generateStringVersion(version: Version) : string {
    return `${version.platform}${version.major}.${version.core}.${version.minor}-${version.build}`.trim();
}
export function generateStringVersionClear(version: Version) : string {
    return `${version.major}.${version.core}.${version.minor}`.trim();
}
export function generateStringVersionRC(version: Version) : string {
    return `${version.platform}${version.major}.${version.core}.${version.minor}-rc${version.build}`.trim();
}