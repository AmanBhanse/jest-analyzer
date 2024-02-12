import fs from 'fs';

export const isDir = (dirPath) => {
  // returns : 1 = it is directory, 0 if it is not, -1 when path not exist
  try {
    const stats = fs.statSync(test_dir);
    if (stats.isDirectory() != true) {
      return 0;
    } else {
      return 1;
    }
  } catch (err) {
    return -1;
  }
};
