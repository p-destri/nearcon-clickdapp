const { global, plasmicRootClassName, renderPlasmicElement } = props;

// Load ABIs
const priceFeedAbi = fetch(
  "https://raw.githubusercontent.com/1Mateus/ethlisbon_poc/main/src/abi/price-feed-abi.json"
);

const troveManagerAbi = fetch(
  "https://raw.githubusercontent.com/1Mateus/ethlisbon_poc/main/src/abi/trove-manager-abi.json"
);

const borrowerOperationAbi = fetch(
  "https://raw.githubusercontent.com/1Mateus/ethlisbon_poc/main/src/abi/borrower-operation-abi.json"
);

const lusdTokenAbi = fetch(
  "https://raw.githubusercontent.com/IDKNWHORU/liquity-sepolia/main/lusd-token-abi.json"
);

if (!priceFeedAbi || !troveManagerAbi || !borrowerOperationAbi || !renderPlasmicElement) {
  return "loading...";
}

const {
  chainId,
  address,
} = global

const borrowerOperationAddress = "0xD69fC8928D4F3229341cb431263F1EBd87B1ade8";
const troveManagerAddress = "0x0ECDF34731eE8Dd46caa99a1AAE173beD1B32c67";
const lusdTokenAddress = "0x80668Ed2e71290EB7526ABE936327b4f5dB52dA8";

State.init({ mouse: false, loading: false, complete: false, isBlock: true });

const closeTrove = () => {
  if (state.complete) {
    State.update({ complete: false, hash: null });
    return;
  }
  const borrowerOperationContract = new ethers.Contract(
    borrowerOperationAddress,
    borrowerOperationAbi.body,
    Ethers.provider().getSigner()
  );

  borrowerOperationContract.closeTrove().then((transactionHash) => {
    State.update({ loading: true, hash: transactionHash.hash });
  });
};

const infoHandler = () => {
  if (chainId === 11155111) {
    const troveManagerContract = new ethers.Contract(
      troveManagerAddress,
      troveManagerAbi.body,
      Ethers.provider().getSigner()
    );

    const lusdTokenContract = new ethers.Contract(
      lusdTokenAddress,
      lusdTokenAbi.body,
      Ethers.provider().getSigner()
    );

    troveManagerContract.getTroveDebt(address).then((troveDebtRes) => {
      const troveDebt = Number(
        ethers.utils.formatEther(troveDebtRes.toString())
      );
      State.update({
        troveDebt: troveDebt === 0 ? 0 : troveDebt - 200,
      });

      lusdTokenContract.balanceOf(address).then((lusdBalanceRes) => {
        const lusdBalance = Number(
          ethers.utils.formatEther(lusdBalanceRes.toString())
        );
        if (troveDebt - 200 - lusdBalance > 0) {
          State.update({
            isBlock: true,
          });
        }
      });
    });
  }
};

if (address && chainId) {
  infoHandler();
}

address && Ethers.provider() &&
  Ethers.provider()
    .waitForTransaction(state.hash)
    .then((res) => {
      State.update({ loading: false, complete: true });
      infoHandler(address);
    })
    .catch((err) => {
      State.update({ loading: false });
    });

return (
  <div className={"bos " + plasmicRootClassName}>
    {renderPlasmicElement("text", { children: "Your debt" })}

    {renderPlasmicElement("text", {
      children:
        state.troveDebt === 0
          ? state.troveDebt
          : `${state.troveDebt ?? 0} LUSD`,
    })}

    <div className="confirm-wrapper">
      {renderPlasmicElement("button", {
        onClick: closeTrove,
        isDisabled: !address || state.isBlock || state.troveDebt === 0,
        children: !address
          ? "Connect Wallet"
          : state.loading
          ? "Loading..."
          : state.complete
          ? "Success!"
          : state.troveDebt === 0
          ? "No debt"
          : state.isBlock
          ? "Insufficient funds"
          : "Pay off debt",
      })}
    </div>
  </div>
);
