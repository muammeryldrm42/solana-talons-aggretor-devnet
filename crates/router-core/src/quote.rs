use crate::route::{Leg, Protocol, RouteKind};

#[derive(Debug, Clone)]
pub struct Quote {
    pub protocol: Protocol,
    pub route_kind: RouteKind,
    pub estimated_out: u64,
    pub impact_bps: u16,
    pub legs: Vec<Leg>,
}

pub fn best_quote(quotes: &[Quote]) -> Option<&Quote> {
    quotes.iter().max_by_key(|quote| quote.estimated_out)
}

#[cfg(test)]
mod tests {
    use super::{best_quote, Quote};
    use crate::route::{Leg, Protocol, RouteKind};

    #[test]
    fn selects_highest_output_quote() {
        let ray = Quote {
            protocol: Protocol::Raydium,
            route_kind: RouteKind::Direct,
            estimated_out: 100,
            impact_bps: 25,
            legs: vec![Leg {
                label: "SOL/USDC".to_owned(),
                fee_bps: 25,
                estimated_price: 150.0,
            }],
        };
        let orca = Quote {
            protocol: Protocol::Orca,
            route_kind: RouteKind::Direct,
            estimated_out: 120,
            impact_bps: 18,
            legs: vec![Leg {
                label: "SOL/USDC".to_owned(),
                fee_bps: 18,
                estimated_price: 150.0,
            }],
        };

        let best = best_quote(&[ray, orca]).expect("best quote should exist");
        assert_eq!(best.estimated_out, 120);
    }
}
