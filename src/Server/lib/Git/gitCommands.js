"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
class GitRequest {
    constructor() {
        this.spawnChild = (cmd, args) => {
            let child = cp.spawn(cmd, args, {
                shell: true,
                cwd: this.message.cmd.pwd
            });
            child.on('error', (err) => {
                console.log(err);
            });
            child.on('close', (code, signal) => {
            });
            child.stderr.on('data', (e) => {
                console.log(e);
            });
            return child;
        };
        this.handler = (message, connection) => {
            this.message = message;
            this.connection = connection;
            if (!message.gitreq) {
                connection.sendUTF(JSON.stringify({ type: 'error', data: 'gitreq is required to manage Git Requests' }));
            }
            else {
                let req = this.message.gitreq;
                req === 'getIsWorkingTree' ? this.getIsWorkingTree() :
                    req === 'getBranches' ? this.getBranches() :
                        req === 'getWorkingBranch' ? this.getWorkingBranch() :
                            req === 'getRemoteBranches' ? this.getRemoteBranches() :
                                req === 'getStatus' ? this.getStatus() :
                                    req === 'getPull' ? this.getPull() : null;
            }
        };
        this.getIsWorkingTree = () => {
            if (!this.message.gitreq) {
                this.connection.sendUTF(JSON.stringify({ type: 'error', data: 'gitreq is required to manage Git Requests' }));
            }
            else {
                let cmd = 'git rev-parse';
                let args = ['--is-inside-work-tree'];
                let child = this.spawnChild(cmd, args);
                child.stdout.on('data', (m) => {
                    this.connection.sendUTF(JSON.stringify({
                        type: 'git',
                        payload: { [this.message.id]: { isWorkingTree: true } }
                    }));
                });
            }
        };
        this.getBranches = () => {
            let cmd = 'git branch';
            let args = ['--color', '-v'];
            let child = this.spawnChild(cmd, args);
            child.stdout.on('data', (m) => {
                let str = m.toString().replace(/\r?\n/g, '|').split('|');
                this.connection.sendUTF(JSON.stringify({ type: 'git', payload: { [this.message.id]: { branches: str } } }));
            });
        };
        this.getWorkingBranch = () => {
            let cmd = 'git rev-parse ';
            let args = ['--abbrev-ref HEAD'];
            let child = this.spawnChild(cmd, args);
            child.stdout.on('data', (m) => {
                this.connection.sendUTF(JSON.stringify({
                    type: 'git',
                    payload: { [this.message.id]: { workingBranch: m.toString() } }
                }));
            });
        };
        this.getRemoteBranches = () => {
            let cmd = 'git branch';
            let args = ['-r', '-v', '--color'];
            let child = this.spawnChild(cmd, args);
            child.stdout.on('data', (m) => {
                let str = m.toString().replace(/\r?\n/g, '|').split('|');
                this.connection.sendUTF(JSON.stringify({ type: 'git', payload: { [this.message.id]: { remoteBranches: str } } }));
            });
        };
        this.getStatus = () => {
            let cmd = 'git status';
            let args = ['--porcelain', '-s'];
            let child = this.spawnChild(cmd, args);
            child.stdout.on('data', (m) => {
                let str = m.toString().replace(/\r?\n/g, '|').split('|');
                this.connection.sendUTF(JSON.stringify({ type: 'git', payload: { [this.message.id]: { status: str } } }));
            });
        };
        this.getPull = () => {
            let cmd = 'git pull origin master';
            let args = [];
            let child = this.spawnChild(cmd, args);
            child.stdout.on('data', (m) => {
                let str = m.toString().replace(/\r?\n/g, '|').split('|');
                this.connection.sendUTF(JSON.stringify({ type: 'git', payload: { [this.message.id]: { status: str } } }));
            });
        };
    }
}
exports.Git = new GitRequest();
//# sourceMappingURL=gitCommands.js.map