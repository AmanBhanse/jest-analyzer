import fs from 'fs';

export const isDir = (dirPath) => {
  // returns : 1 = it is directory, 0 if it is not, -1 when path not exist
  try {
    const stats = fs.statSync(dirPath);
    if (stats.isDirectory() != true) {
      return 0;
    } else {
      return 1;
    }
  } catch (err) {
    return -1;
  }
};

export const isFile = (filePath) => {
  // returns : 1 = it is file, 0 if it is not, -1 when path not exist or invalid
  try {
    const stats = fs.statSync(filePath);
    if (stats.isFile() != true) {
      return 0;
    } else {
      return 1;
    }
  } catch (err) {
    return -1;
  }
};
