// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

/**
 * @title TestUniswapPool
 */
contract TestUniswapPool
{
    address public token0 = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public token1 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    struct Observation
    {
        int56 tickCumulative;
        uint160 secondsPerLiquidityCumulativeX128;
    }
    mapping(uint32 => Observation) observations;

    function observe(uint32[] calldata secondsAgos)
        external
        view
        returns (int56[] memory tickCumulatives, uint160[] memory secondsPerLiquidityCumulativeX128s)
    {
        tickCumulatives = new int56[](secondsAgos.length);
        secondsPerLiquidityCumulativeX128s = new uint160[](secondsAgos.length);
        for (uint i = 0; i < secondsAgos.length; i++) {
            Observation storage observation = observations[secondsAgos[i]];
            tickCumulatives[i] = observation.tickCumulative;
            secondsPerLiquidityCumulativeX128s[i] = observation.secondsPerLiquidityCumulativeX128;
        }
    }

    function setObservation(
        uint32 secondsAgo,
        int56 tickCumulative,
        uint160 secondsPerLiquidityCumulativeX128
        )
        external
    {
        observations[secondsAgo] = Observation({
            tickCumulative: tickCumulative,
            secondsPerLiquidityCumulativeX128: secondsPerLiquidityCumulativeX128
        });
    }
}
