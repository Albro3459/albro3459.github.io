import argparse
from pathlib import Path
import shutil
import subprocess
import sys
import venv


parser = argparse.ArgumentParser(description="Install the local resume checker")
parser.add_argument("--with-docling", action="store_true", help="Install the optional Docling vendor")
args = parser.parse_args()


# NetworkX 3.7 requires Python 3.12+ and excludes 3.14.1
if sys.version_info < (3, 12) or sys.version_info[:3] == (3, 14, 1):
    candidates = [
        shutil.which(f"python3.{minor}") for minor in range(14, 11, -1)
    ] + ["/opt/homebrew/bin/python3", "/usr/local/bin/python3"]
    for candidate in candidates:
        if not candidate or not Path(candidate).is_file():
            continue
        supported = subprocess.run(
            [
                candidate, "-c",
                "import sys; sys.exit(sys.version_info < (3, 12) or sys.version_info[:3] == (3, 14, 1))",
            ],
            check=False,
        )
        if supported.returncode == 0:
            subprocess.run([candidate, str(Path(__file__).resolve()), *sys.argv[1:]], check=True)
            sys.exit(0)
    raise SystemExit(
        "Install Python 3.12 or newer (except 3.14.1), then run npm run resume:setup again."
    )

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
python = environment / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")
if not python.is_file():
    venv.EnvBuilder(with_pip=True).create(environment)

subprocess.run(["npm", "install", "--ignore-scripts"], cwd=root, check=True)
subprocess.run(
    [str(python), "-m", "pip", "install", "-r", str(root / "requirements.txt")],
    check=True,
)
if args.with_docling:
    docling_environment = root / ".venv-docling"
    docling_python = docling_environment / (
        "Scripts/python.exe" if sys.platform == "win32" else "bin/python"
    )
    if not docling_python.is_file():
        venv.EnvBuilder(with_pip=True).create(docling_environment)
    subprocess.run(
        [str(docling_python), "-m", "pip", "install", "-r", str(root / "requirements-docling.txt")],
        check=True,
    )
print("Resume checker installed. Run npm run resume:check from the project root.")
if args.with_docling:
    print("Docling installed separately. Run npm run resume:check -- --vendors openresume docling.")
