use state::State;

#[test]
fn treasury_credit_debit_atomic() {
    let mut state = State::new();
    state.credit_treasury("polygon", "KENNY", 10_000).unwrap();
    assert_eq!(state.get_treasury_balance("polygon", "KENNY"), 10_000);
    state.debit_treasury("polygon", "KENNY", 3_000).unwrap();
    assert_eq!(state.get_treasury_balance("polygon", "KENNY"), 7_000);
    assert!(state.debit_treasury("polygon", "KENNY", 8_000).is_err());
}
