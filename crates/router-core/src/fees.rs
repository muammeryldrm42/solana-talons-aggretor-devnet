pub fn total_fee_bps(fees: &[u16]) -> u16 {
    fees.iter().copied().sum()
}

#[cfg(test)]
mod tests {
    use super::total_fee_bps;

    #[test]
    fn sums_fee_bps() {
        assert_eq!(total_fee_bps(&[18, 18]), 36);
        assert_eq!(total_fee_bps(&[25]), 25);
    }
}
