use state::persistence::StateStore;
use state::State;
use tempfile::tempdir;

#[test]
fn state_survives_restart_mock() {
    let dir = tempdir().unwrap();
    let path = dir.path().join("rocksdb");

    let mut state = State::new();
    state.current_height = 42;
    state.credit_treasury("xrpl", "TROPTIONS", 99_000).unwrap();

    {
        let store = StateStore::open(&path).unwrap();
        store.save(&state).unwrap();
        store.flush().unwrap();
    }

    {
        let store = StateStore::open(&path).unwrap();
        let loaded = store.load().unwrap();
        assert_eq!(loaded.current_height, 42);
        assert_eq!(loaded.get_treasury_balance("xrpl", "TROPTIONS"), 99_000);
    }
}
