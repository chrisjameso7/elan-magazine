import { readFileSync, writeFileSync } from "node:fs";
if (process.platform === "win32") {
  const path = "node_modules/@opennextjs/aws/dist/build/copyTracedFiles.js";
  const source = readFileSync(path, "utf8");
  const original = "symlinkSync(symlink, to);";
  const replacement = `// Windows directory junctions do not require symlink privileges.
                if (process.platform === "win32") {
                    const target = path.resolve(path.dirname(from), symlink);
                    if (statSync(target).isDirectory()) symlinkSync(target, to, "junction");
                    else copyFileSync(target, to);
                } else { symlinkSync(symlink, to); }`;
  if (!source.includes("Windows directory junctions")) {
    if (source.split(original).length !== 2)
      throw Error(
        "Review updated OpenNext file-copy implementation before patching.",
      );
    writeFileSync(path, source.replace(original, replacement));
  }
}
