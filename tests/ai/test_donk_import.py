from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DONK = ROOT / "ai" / "donk-tutor" / "main.py"


def test_donk_main_exists():
    assert DONK.is_file()
