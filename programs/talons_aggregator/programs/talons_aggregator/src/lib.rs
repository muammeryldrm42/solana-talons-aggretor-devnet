use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWxTWqkZ7FEfcYkgP7K6W2BeZ7FE");

const MAX_ALLOWED_PROGRAMS: usize = 8;
const CONFIG_SPACE: usize = 8 + 32 + 2 + 1 + 4 + (32 * MAX_ALLOWED_PROGRAMS);

#[program]
pub mod talons_aggregator {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>, max_slippage_bps: u16) -> Result<()> {
        require!(max_slippage_bps <= 1_000, AggregatorError::SlippageTooHigh);

        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.max_slippage_bps = max_slippage_bps;
        config.paused = false;
        config.allowed_programs = Vec::new();

        Ok(())
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        max_slippage_bps: u16,
        paused: bool,
    ) -> Result<()> {
        require!(max_slippage_bps <= 1_000, AggregatorError::SlippageTooHigh);

        let config = &mut ctx.accounts.config;
        config.max_slippage_bps = max_slippage_bps;
        config.paused = paused;

        Ok(())
    }

    pub fn set_allowed_program(
        ctx: Context<UpdateConfig>,
        program_id: Pubkey,
        allowed: bool,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;

        if allowed {
            if !config.allowed_programs.contains(&program_id) {
                require!(
                    config.allowed_programs.len() < MAX_ALLOWED_PROGRAMS,
                    AggregatorError::TooManyAllowedPrograms
                );
                config.allowed_programs.push(program_id);
            }
        } else {
            config.allowed_programs.retain(|candidate| candidate != &program_id);
        }

        Ok(())
    }

    pub fn verify_route(
        ctx: Context<VerifyRoute>,
        quoted_out: u64,
        min_out: u64,
        requested_slippage_bps: u16,
        route_hash: [u8; 32],
        expected_route_hash: [u8; 32],
        target_program: Pubkey,
    ) -> Result<()> {
        let config = &ctx.accounts.config;

        require!(!config.paused, AggregatorError::Paused);
        require!(
            requested_slippage_bps <= config.max_slippage_bps,
            AggregatorError::SlippageTooHigh
        );
        require!(quoted_out >= min_out, AggregatorError::InvalidMinimumOutput);
        require!(route_hash == expected_route_hash, AggregatorError::RouteHashMismatch);
        require!(
            config.allowed_programs.contains(&target_program),
            AggregatorError::ProgramNotAllowed
        );

        Ok(())
    }
}

#[account]
pub struct AggregatorConfig {
    pub authority: Pubkey,
    pub max_slippage_bps: u16,
    pub paused: bool,
    pub allowed_programs: Vec<Pubkey>,
}

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(init, payer = authority, space = CONFIG_SPACE)]
    pub config: Account<'info, AggregatorConfig>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(mut, has_one = authority)]
    pub config: Account<'info, AggregatorConfig>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyRoute<'info> {
    pub config: Account<'info, AggregatorConfig>,
    pub authority: Signer<'info>,
}

#[error_code]
pub enum AggregatorError {
    #[msg("Requested slippage exceeds configured maximum.")]
    SlippageTooHigh,
    #[msg("Minimum output exceeds quoted output.")]
    InvalidMinimumOutput,
    #[msg("The aggregator is currently paused.")]
    Paused,
    #[msg("Route hash verification failed.")]
    RouteHashMismatch,
    #[msg("Program is not allow-listed.")]
    ProgramNotAllowed,
    #[msg("Maximum allowed-program list size reached.")]
    TooManyAllowedPrograms,
}
