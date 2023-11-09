const { global, dispatchState, plasmicRootClassName, renderPlasmicElement } =
  props || {};

const priceFeedAbi = fetch(
  "https://raw.githubusercontent.com/1Mateus/ethlisbon_poc/main/src/abi/price-feed-abi.json"
);
const troveManagerAbi = fetch(
  "https://raw.githubusercontent.com/1Mateus/ethlisbon_poc/main/src/abi/trove-manager-abi.json"
);
const borrowerOperationAbi = fetch(
  "https://raw.githubusercontent.com/1Mateus/ethlisbon_poc/main/src/abi/borrower-operation-abi.json"
);

if (
  !priceFeedAbi ||
  !troveManagerAbi ||
  !borrowerOperationAbi ||
  !renderPlasmicElement
) {
  return "loading...";
}

const {
  chainId,
  address,
  balanceETH,
  isOpenTrove,
} = global

const balance = global?.balanceETH

const priceFeedAddress = "0x07dD4Ce17De84bA13Fc154A7FdB46fC362a41E2C";
const troveManagerAddress = "0x0ECDF34731eE8Dd46caa99a1AAE173beD1B32c67";
const borrowerOperationAddress = "0xD69fC8928D4F3229341cb431263F1EBd87B1ade8";

State.init({
  msg: "",
  displayColl: "",
  displayBorrow: "",

  loading: false,
  complete: false,
  isBlocked: true,

  coll: 0,
  price: 0,
  borrow: 0,
  totalcoll: 200,
  borrowingFee: 0,
  collateralRatio: 0,
  liquidationReserve: 200,
});

const setcoll = (depositChangeEvent) => {
  const value = depositChangeEvent.target.value.replace(/[^.0-9]/g, "");

  const coll = Number(value);

  const { totalcoll } = state;

  const collateralRatio = ((coll * state.price) / Number(totalcoll)) * 100;

  State.update({
    displayColl: value,
    coll,
    collateralRatio,
  });

  validateTrove();
};

const setBorrow = (borrowChangeEvent) => {
  const { coll, liquidationReserve } = state;

  const value = borrowChangeEvent.target.value.replace(/[^.0-9]/g, "");

  const borrow = Number(value);

  const borrowingFee = (borrow * 0.5) / 100;

  const totalcoll =
    borrow + Number(borrowingFee.toFixed(2)) + liquidationReserve;

  const collateralRatio = ((coll * state.price) / Number(totalcoll)) * 100;

  State.update({
    borrow,
    totalcoll,
    borrowingFee,
    collateralRatio,
    displayBorrow: value,
  });

  validateTrove();
};

const validateTrove = () => {
  const { coll, borrow, totalcoll } = state;

  if (borrow < 1800) {
    State.update({
      isBlocked: true,
      msg: "Borrow must be at least 1800 LUSD",
    });

    return;
  }

  const collateralRatio = ((coll * state.price) / Number(totalcoll)) * 100;

  if (collateralRatio < 110) {
    State.update({
      isBlocked: true,
      msg: "Collateral ratio must be at least 110%",
    });

    return;
  }

  if (coll > Number(balance)) {
    State.update({
      isBlocked: true,
      msg: `The amount you're trying to deposit exceeds your balance by ${coll} ETH`,
    });

    return;
  }

  State.update({ msg: "", isBlocked: false });
};

const openTrove = () => {
  if (state.complete) {
    State.update({ complete: false, hash: null });
  }
  const borrowerOperationContract = new ethers.Contract(
    borrowerOperationAddress,
    borrowerOperationAbi.body,
    Ethers.provider().getSigner()
  );

  borrowerOperationContract
    .openTrove(
      ethers.BigNumber.from(5000000000000000),
      ethers.BigNumber.from(state.borrow * 100)
        .mul("10000000000000000")
        .toString(),
      "0x1Bc65296aa95A0fD41d6A8AEb34C49665c6de81d",
      "0x1Bc65296aa95A0fD41d6A8AEb34C49665c6de81d",
      {
        value: ethers.BigNumber.from(
          (state.coll * 1000000000000000000).toString()
        ),
      }
    )
    .then((transactionHash) => {
      State.update({
        loading: true,
        hash: transactionHash.hash,
        borrow: 0,
        displayBorrow: "",
        coll: 0,
        displayColl: "",
        borrowingFee: 0,
        totalcoll: 200,
        collateralRatio: 0,
        liquidationReserve: 200,
      });
    });
};

if (address && chainId === 11155111) {
  if (state.price === 0) {
    const priceFeedContract = new ethers.Contract(
      priceFeedAddress,
      priceFeedAbi.body,
      Ethers.provider().getSigner()
    );

    const troveManagerContract = new ethers.Contract(
      troveManagerAddress,
      troveManagerAbi.body,
      Ethers.provider().getSigner()
    );

    priceFeedContract
      .getPrice()
      .then((priceRes) => {
        const price = Number(ethers.utils.formatEther(priceRes));

        State.update({ price });
        troveManagerContract.getTCR(priceRes).then((tcrRes) => {
          const tcr = Number(ethers.utils.formatEther(tcrRes)) * 100;

          State.update({ tcr });
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
}

const complete = () => {
  State.update({ complete: true });
};

Ethers.provider() &&
  Ethers.provider()
    .waitForTransaction(state.hash)
    .then((res) => {
      State.update({
        loading: false,
      });
      complete();
    })
    .catch((err) => {
      State.update({ loading: false });
    });

return (
  <div className={"bos " + plasmicRootClassName}>
    <div className="flex flex-col space-y-2">
      {renderPlasmicElement("textInput", { children: "Deposit (ETH)" })}

      {renderPlasmicElement("input", {
        type: "text",
        onChange: setcoll,
        value: state.displayColl,
        placeholder: "0.0000 ETH",
        disabled:
          !address || isOpenTrove || chainId !== 11155111,
      })}
    </div>

    <div className="flex flex-col space-y-2">
      {renderPlasmicElement("textInput", { children: "Borrow (LUSD)" })}

      {renderPlasmicElement("input", {
        type: "text",
        onChange: setBorrow,
        value: state.displayBorrow,
        placeholder: "0.0000 LUSD",
        disabled:
          !address || isOpenTrove || chainId !== 11155111,
      })}
    </div>

    {state.msg && renderPlasmicElement("text", { children: state.msg })}

    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        {renderPlasmicElement("textInfo", { children: "Liquidation Reserve" })}

        {renderPlasmicElement("textInfo", {
          children: state.liquidationReserve + "LUSD",
        })}
      </div>

      <div className="flex justify-between items-center">
        {renderPlasmicElement("textInfo", { children: "Borrowing Fee" })}

        {renderPlasmicElement("textInfo", {
          children: `${state.borrowingFee.toFixed(2)} LUSD (0.50%)`,
        })}
      </div>

      <div className="flex justify-between items-center">
        {renderPlasmicElement("textInfo", { children: "Recieve" })}

        <div className="flex items-center justify-center">
          {renderPlasmicElement("textInfo", {
            children: state.borrow.toFixed(2),
          })}

          {renderPlasmicElement("textInfo", { children: "LUSD" })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        {renderPlasmicElement("textInfo", { children: "Total debt" })}

        <div className="flex justify-center items-center">
          {renderPlasmicElement("textInfo", {
            children: state.totalcoll.toFixed(2),
          })}

          {renderPlasmicElement("textInfo", { children: "LUSD" })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        {renderPlasmicElement("textInfo", { children: "Collateral" })}

        <div className="flex justify-center items-center">
          {renderPlasmicElement("textInfo", {
            children: state.collateralRatio.toFixed(1),
          })}

          {renderPlasmicElement("textInfo", { children: "%" })}
        </div>
      </div>
    </div>

    {renderPlasmicElement("button", {
      onClick: openTrove,
      isDisabled:
        state.isBlocked ||
        isOpenTrove === true ||
        state.coll === 0 ||
        state.borrow === 0,
      children: !address
        ? "Connect Wallet"
        : Ethers.provider() && chainId !== 11155111
        ? "Change network to Sepolia"
        : isOpenTrove === true
        ? "You already have active Trove"
        : state?.loading
        ? "Loading..."
        : state?.complete
        ? "Success!"
        : state?.coll === 0 || state?.borrow === 0
        ? "Invalid amount"
        : state.isBlocked
        ? "Check stats"
        : "Open Trove",
    })}
  </div>
);
