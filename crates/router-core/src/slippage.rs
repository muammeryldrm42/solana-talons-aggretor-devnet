pub fn minimum_received(amount_out: u64, slippage_bps: u16) -> u64 {
    let retained_bps = 10_000u64.saturating_sub(slippage_bps as u64);
    amount_out.saturating_mul(retained_bps) / 10_000
}

#[cfg(test)]
mod tests {
    use super::minimum_received;

    #[test]
    fn calculates_minimum_received() {
        assert_eq!(minimum_received(1_000_000, 50), 995_000);
        assert_eq!(minimum_received(500_000, 100), 495_000);
    }
}
