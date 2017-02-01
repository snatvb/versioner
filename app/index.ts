/**
 * Created by snatvb on 01.02.17.
 */
import * as shell from 'shelljs';
import * as path from 'path';
import * as fs from 'fs';
import * as rl from 'readline-sync';
import * as chalk from 'chalk';
// import * as prompt from 'prompt';
import {error} from "./logger";
import {
    getCommand, Command, sameVersion, generateStringVersion, generateStringVersionRC,
    generateStringVersionClear, aboutCmd
} from "./utils";

export interface Version {
    major: number,
    core: number,
    minor: number,
    platform: string,
    build: number,
}


export default class App {
    private PACKAGE_FILE: string = 'package.json';
    private VERSION_FILE: string = 'version.json';
    private packageJson: any;
    public basedir: string;
    private version: Version;
    private appName: string = "versioner";
    private appNameTitle: string = "Versioner";
    private dirname: string;

    constructor (dirname: string) {
        this.dirname = dirname;
        if (this.about()) {
            return;
        }
        this.basedir = shell.pwd().stdout;
        this.packageJson = this.loadJson(this.PACKAGE_FILE);
        if (this.packageJson === null) {
            return;
        }
        // this.version = this.getVersion();
        this.loadOrCreateVersion();
        this.startListenCommands();
    }


    private loadJson (file: string, showError: boolean = true): Version {
        let result;
        try {
            result = fs.readFileSync(path.join(this.basedir, file)).toString();
        } catch (err) {
            if (!showError) {
                return null;
            }
            error(`Error read file ${file}:`);
            console.log(err);
            return null;
        }
        try {
            result = JSON.parse(result);
        } catch (err) {
            if (!showError) {
                return null;
            }
            error(`Error parse file ${file}:`);
            console.log(err);
            return null;
        }
        return result;
    }

    private loadOrCreateVersion () {
        let version: Version = this.loadJson(this.VERSION_FILE, false);
        if (version === null) {
            // console.log(this.version);
            version = this.getVersion();
            this.saveVersion(version);
        }

        this.version = version;
    }

    private getVersion (): null | Version {
        let result: Version;
        try {
            const version = this.packageJson.version.split('.');

            const platform: string = this.questionPlatform();

            result = {
                major: parseInt(version[0], 10),
                core: parseInt(version[1], 10),
                minor: parseInt(version[2], 10),
                platform: platform,
                build: 0
            };
        } catch (err) {
            error(`Error parse version from ${this.PACKAGE_FILE}`);
            console.log(err);
            return null;
        }
        return result;
    }

    private questionPlatform (): string {
        const result = rl.question(chalk.yellow('Write your platform: '));

        if (result.length < 1) {
            error(`Platform is empty, it's wrong! Go more!`);
            return this.questionPlatform();
        }

        return result;
    }

    private startListenCommands (): void {
        this.upgrade();
        this.git();
    }

    private git () {
        const git: Command = getCommand('git');
        const rc: Command = getCommand('--rc');
        const push: Command = getCommand('--push');
        if (git === null) {
            return;
        }
        this.versionUpgrade();

        this.gitExec(git, rc !== null, push !== null);
    }


    private versionUpgrade () {
        if (sameVersion(this.packageJson.version, this.version)) {
            this.version.build++;
            this.saveVersion(this.version);
        } else {
            const version = this.getVersion();
            this.saveVersion(version);
        }
    }

    private saveVersion (version: Version): void {
        fs.writeFileSync(path.join(this.basedir, this.VERSION_FILE), JSON.stringify(version, null, "\t"));
        fs.writeFileSync(path.join(this.basedir, this.PACKAGE_FILE), JSON.stringify(this.packageJson, null, "\t"));
    }

    private gitExec (git: Command, rc: boolean, push: boolean): void {
        if (typeof git.value !== "string") {
            return error(`Git command don't have commit: ${this.appName} git "COMMIT_COMMENT"`);
        }
        const strVersion = rc ?
            generateStringVersionRC(this.version) : generateStringVersion(this.version);
        shell.exec('git add --all');
        shell.exec(`git commit -m "${git.value}"`);
        shell.exec(`git tag -a "${strVersion}" -m ${git.value}`);
        if (push) {
            shell.exec(`git push origin ${git.value}`);
        }
    }

    private upgrade () {
        const major: Command = getCommand('--major');
        const core: Command = getCommand('--core');
        const minor: Command = getCommand('--minor');

        if (major !== null) {
            this.version.major++;
            this.version.build = 0;
        }
        if (core !== null) {
            this.version.core++;
            this.version.build = 0;
        }
        if (minor !== null) {
            this.version.minor++;
            this.version.build = 0;
        }

        this.packageJson.version = generateStringVersionClear(this.version);
        console.log('Your version: ' + chalk.green(generateStringVersion(this.version)));

        this.saveVersion(this.version);
    }

    private help (): boolean {
        const cmd = getCommand('--help');
        if (cmd === null) {
            return false;
        }
        console.log("Welcome to the", chalk.magenta(this.appNameTitle));
        console.log("Commands:");
        console.log(aboutCmd(this.appNameTitle, 'git', '[COMMENT]', 'Use this command where you will be pushing'));
        console.log(aboutCmd(this.appNameTitle, '--major', null, 'Upgrade major version'));
        console.log(aboutCmd(this.appNameTitle, '--core', null, 'Upgrade core version'));
        console.log(aboutCmd(this.appNameTitle, '--minor', null, 'Upgrade minor version'));
        return true;
    }

    private about (): boolean {
        let result = false;
        if (this.help()) {
            result = true;
        }
        if (this.v()) {
            result = true;
        }

        return result;
    }

    private v (): boolean {
        const cmd = getCommand('-v');
        const cmdAlias = getCommand('--version');
        if (cmd === null && cmdAlias === null) {
            return false;
        }
        let json;
        try {
            json = fs.readFileSync(path.join(this.dirname, this.PACKAGE_FILE)).toString();
            json = JSON.parse(json);
        } catch (err) {
            error(`Sorry, I can't found my version file :(`);
        }
        console.log(chalk.green(`My version is:`), json.version);
        return true;
    }
}