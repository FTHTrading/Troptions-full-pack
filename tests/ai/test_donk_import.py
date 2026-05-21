from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DONK = ROOT / "ai" / "donk-tutor" / "main.py"


def test_donk_main_exists():
    assert DONK.is_file()


def test_donk_system_prompt_exists():
    prompt = ROOT / "ai" / "donk-tutor" / "system_prompt.py"
    assert prompt.is_file()
    text = prompt.read_text(encoding="utf-8")
    assert "DAO" in text or "governance" in text.lower()
