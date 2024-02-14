/* eslint-disable no-console */
import { execSync } from "child_process";
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { dirname } from "path";
import { argv, execPath } from "process";

const [main, output] = argv.slice(2);

console.log(`
Creating single executable application:
main: ${main}
output: ${output} 
`);


const seaConfig = JSON.stringify({
  main,
  output: "/tmp/app.blob",
  disableExperimentalSEAWarning: true,
}, null, 2);

const outputDir = dirname(output);
const blobPath = "/tmp/app.blob";
const seaConfigPath = "./sea-config.json";

const sentinelFuse = "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2";
try {
  mkdirSync(outputDir, {recursive: true});
  copyFileSync(
    execPath, 
    output
  );
  writeFileSync(
    seaConfigPath, 
    seaConfig
  );
  execSync(`node --experimental-sea-config ${seaConfig}`);
  
  execSync(`npx postject ${output} NODE_SEA_BLOB ${blobPath} --sentinel-fuse ${sentinelFuse}`);
} 
finally {
  rmSync(seaConfigPath, {force: true});
  rmSync(blobPath, {force: true});
  rmSync(outputDir, {force: true});
}
