import fs from 'fs';
import path from 'path';

// Creates an empty directory asynchronously.
async function createEmptyDir(dir: string): Promise<string> {
    // Construct the full directory path
    let loc = path.join(path.dirname(__dirname), dir);

    // Create a Promise to handle directory creation
    let dirData = new Promise<string>((resolve, reject) => {
        fs.mkdir(loc, err => { err ? reject(err) : resolve(loc); });
    });

    return await dirData;
}

// Deletes a file asynchronously.
function deleteFile(name: string): void {
    fs.unlink(name, err => { if (err) { console.log('Unable to delete ' + name); } });
}

// Scans a directory asynchronously and returns a list of files.
async function scanDir(dir: string): Promise<string[]> {
    // Construct the full directory path
    let loc = path.join(path.dirname(__dirname), dir);

    // Create a Promise to handle directory scanning
    let fileData = new Promise<string[]>((resolve, reject) => {
        fs.readdir(loc, (err, files) => { err ? reject(err) : resolve(files); });
    });

    return await fileData;
}

// Converts a directory path from the 'dist' folder to the 'src' folder
function srcDir(dir: string): string {
    return 'src' + dir.split('dist')[1];
}

export { createEmptyDir, deleteFile, scanDir, srcDir };
