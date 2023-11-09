const { plasmicRootClassName, renderPlasmicElement, dispatchState } = props

const lusdTokenAbi = fetch(
  "https://raw.githubusercontent.com/IDKNWHORU/liquity-sepolia/main/lusd-token-abi.json"
);

const troveManagerAbi = fetch(
  "https://raw.githubusercontent.com/1Mateus/ethlisbon_poc/main/src/abi/trove-manager-abi.json"
);

if (!lusdTokenAbi || !troveManagerAbi || !renderPlasmicElement) {
  return;
}
const lusdTokenAddress = "0x80668Ed2e71290EB7526ABE936327b4f5dB52dA8";
const troveManagerAddress = "0x0ECDF34731eE8Dd46caa99a1AAE173beD1B32c67";

State.init({
  address: undefined,
  chainId: undefined,
  balanceETH: undefined,
  balanceLUSD: undefined,
  isOpenTrove: undefined,
});

if (Ethers.provider()) {
  const signer = Ethers.provider().getSigner();

  const lusdTokenContract = new ethers.Contract(
    lusdTokenAddress,
    lusdTokenAbi.body,
    signer
  );

  signer.getAddress().then((address) => {
    State.update({ address });
    dispatchState({ address })

    if (state.chainId === 11155111) {
      if (state.balanceETH === undefined) {
        Ethers.provider()
          .getBalance(address)
          .then((balance) => {
            State.update({
              balanceETH: Big(balance).div(Big(10).pow(18)).toFixed(2),
            });

            dispatchState({ balanceETH: Big(balance).div(Big(10).pow(18)).toFixed(2) })
          });
      }

      if (state.balanceLUSD === undefined) {
        lusdTokenContract.balanceOf(address).then((lusdBalanceRes) => {
          const lusdBalance = Number(
            ethers.utils.formatEther(lusdBalanceRes.toString())
          );
          State.update({
            balanceLUSD: lusdBalance,
          });

          dispatchState({ balanceLUSD: lusdBalance })
        });
      }
    }

    if (state.isOpenTrove === undefined) {
      const troveManagerContract = new ethers.Contract(
        troveManagerAddress,
        troveManagerAbi.body,
        Ethers.provider().getSigner()
      );

      troveManagerContract.getTroveStatus(address).then((res) => {
        const isOpenTrove = ethers.utils.formatEther(res).includes("1");

        State.update({ isOpenTrove });

        dispatchState({ isOpenTrove });
      });
    }
  });

  Ethers.provider()
    .getNetwork()
    .then((chainIdData) => {
      if (chainIdData?.chainId) {
        State.update({ chainId: chainIdData.chainId });
        dispatchState({ chainId: chainIdData.chainId })
      }
    });
}

return (
  <div
    className={plasmicRootClassName}
  >
    {state.address && renderPlasmicElement('text', {
      children: `Balance: ${state.balanceETH} ETH / ${state.balanceLUSD} LUSD`
    })}
  </div>
)
