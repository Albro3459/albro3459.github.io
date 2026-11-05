from pathlib import Path
import shutil
import subprocess
import sys
import venv


if sys.version_info < (3, 11):
    candidates = [
        shutil.which(f"python3.{minor}") for minor in range(14, 10, -1)
    ] + ["/opt/homebrew/bin/python3", "/usr/local/bin/python3"]
    for candidate in candidates:
        if not candidate or not Path(candidate).is_file():
            continue
        supported = subprocess.run(
            [candidate, "-c", "import sys; sys.exit(sys.version_info < (3, 11))"],
            check=False,
        )
        if supported.returncode == 0:
            subprocess.run([candidate, str(Path(__file__).resolve())], check=True)
            sys.exit(0)
    raise SystemExit("Install Python 3.11 or newer, then run npm run resume:setup again.")

root = Path(__file__).resolve().parent
project = root.parent.parent
subprocess.run(
    [
        "git", "-C", str(project), "submodule", "update", "--init", "--",
        "resume/ats-audit/vendor/open-resume",
    ],
    check=True,
)
environment = root / ".venv"
venv.EnvBuilder(with_pip=True).create(environment)
python = environment / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")

subprocess.run(["npm", "install", "--ignore-scripts"], cwd=root, check=True)
subprocess.run(
    [str(python), "-m", "pip", "install", "-r", str(root / "requirements.txt")],
    check=True,
)
print("Resume checker installed. Run npm run resume:check from the project root.")
