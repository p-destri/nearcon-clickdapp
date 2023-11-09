const {
  global,
  dispatchState,
  dispatchEvent,
  registerEvent,
  plasmicRootClassName,
  renderPlasmicElement,
} = props;

// Load ABIs
let priceFeedAbi = fetch(
  "https://raw.githubusercontent.com/1Mateus/ethlisbon_poc/main/src/abi/price-feed-abi.json"
);
let troveManagerAbi = fetch(
  "https://raw.githubusercontent.com/1Mateus/ethlisbon_poc/main/src/abi/trove-manager-abi.json"
);
let borrowerOperationAbi = fetch(
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
  isOpenTrove,
} = global

State.init({
  option: "withdraw",
  token: "ETH",
  address: "",
  check: false,
  value: "",
  complete: false,
  error: "",
});

// Define address
const priceFeedAddress = "0x07dD4Ce17De84bA13Fc154A7FdB46fC362a41E2C";
const troveManageAddress = "0x0ECDF34731eE8Dd46caa99a1AAE173beD1B32c67";
const borrowerOperationsAddress = "0xD69fC8928D4F3229341cb431263F1EBd87B1ade8";

// Load Interfaces
const priceFeedInterface = new ethers.utils.Interface(priceFeedAbi.body);
const troveManageInterface = new ethers.utils.Interface(troveManagerAbi.body);

const EPSILON = 2.2e-16;

const infoHandler = () => {
  Ethers.provider()
    .getNetwork()
    .then((chainIdData) => {
      if (chainIdData?.chainId) {
        State.update({ chainId: chainIdData.chainId });
      }
    });

  const encodedForPrice = priceFeedInterface.encodeFunctionData("getPrice");

  Ethers.provider()
    .call({
      to: priceFeedAddress,
      data: encodedForPrice,
    })
    .then((raw) => {
      const receiverBalanceHex = priceFeedInterface.decodeFunctionResult(
        "getPrice",
        raw
      );
      const result = receiverBalanceHex[0].div("1000000000000000000");
      State.update({
        currentPrice: result.toString(),
        currentPriceRaw: receiverBalanceHex[0].toString(),
      });
    });

  const encodedForICR = troveManageInterface.encodeFunctionData(
    "getCurrentICR",
    [address, state.currentPriceRaw || "2000000000000000000000"]
  );

  Ethers.provider()
    .call({
      to: troveManageAddress,
      data: encodedForICR,
    })
    .then((raw) => {
      const receiverBalanceHex = troveManageInterface.decodeFunctionResult(
        "getCurrentICR",
        raw
      );
      const result = receiverBalanceHex[0].div("1000000000000000000");
      State.update({ currentICR: result.toString() });
    });

  const encodedForColl = troveManageInterface.encodeFunctionData(
    "getTroveColl",
    [address]
  );
  Ethers.provider()
    .call({
      to: troveManageAddress,
      data: encodedForColl,
    })
    .then((raw) => {
      const receiverBalanceHex = troveManageInterface.decodeFunctionResult(
        "getTroveColl",
        raw
      );
      State.update({
        currentColl: ethers.utils
          .formatEther(receiverBalanceHex[0].toString())
          .toString(),
      });
    });

  const encodedForDebt = troveManageInterface.encodeFunctionData(
    "getTroveDebt",
    [address]
  );

  Ethers.provider()
    .call({
      to: troveManageAddress,
      data: encodedForDebt,
    })
    .then((raw) => {
      const receiverBalanceHex = troveManageInterface.decodeFunctionResult(
        "getTroveDebt",
        raw
      );
      const result = receiverBalanceHex[0].div("1000000000000000000");
      State.update({ currentDebt: result.toString() });
    });
};

if (address) {
  infoHandler();
}

const checkFunc = () => {
  if (state.token === "ETH") {
    if (!state.value) {
      State.update({
        check: false,
        error: "Invalid Amount",
      });

      return;
    }

    if (state.updatedICR < 1.1) {
      State.update({ check: false, error: "Invalid Amount" });

      return;
    }
  } else if (state.token === "LUSD") {
    if (!state.value) {
      State.update({ check: false, error: "Invalid Amount" });

      return;
    }

    if (state.updatedICR < 1.1) {
      State.update({ check: false, error: "Invalid Amount" });

      return;
    }

    if (state.updatedDebt < 2000) {
      State.update({ check: false, error: "Invalid Amount" });

      return;
    }
  }
  State.update({ check: true, error: "" });
};

const changeHandler = (value) => {
  value =
    typeof value === "object"
      ? Number(value.target.value.replace(/[^.0-9]/g, ""))
      : !value
      ? 0
      : Number(value);

  State.update({ value });

  if (!state.currentColl || !state.currentDebt || !state.currentPrice) {
    return;
  }

  // deposit-ETH
  if (state.option === "deposit" && state.token === "ETH") {
    State.update({
      updatedColl: Number(state.currentColl) + Number(value),
      updatedICR:
        value === 0
          ? null
          : Math.round(
              (((Number(state.currentColl) + Number(value)) /
                Number(state.currentDebt)) *
                Number(state.currentPrice) +
                EPSILON) *
                1000
            ) / 1000,
    });
  }
  // withdraw-ETH
  else if (state.option === "withdraw" && state.token === "ETH") {
    State.update({
      updatedColl: Number(state.currentColl) - Number(value),
      updatedICR:
        e.target.value === ""
          ? null
          : Math.round(
              (((Number(state.currentColl) - Number(value)) /
                Number(state.currentDebt)) *
                Number(state.currentPrice) +
                EPSILON) *
                1000
            ) / 1000,
    });
  }
  // deposit-LUSD
  else if (state.option === "deposit" && state.token === "LUSD") {
    State.update({
      updatedDebt: Number(state.currentDebt) - Number(value),
      updatedICR:
        e.target.value === ""
          ? null
          : Math.round(
              ((Number(state.currentColl) /
                (Number(state.currentDebt) - Number(value))) *
                Number(state.currentPrice) +
                EPSILON) *
                1000
            ) / 1000,
    });
  }
  // withdraw-LUSD
  else if (state.option === "withdraw" && state.token === "LUSD") {
    State.update({
      updatedDebt: Number(state.currentDebt) + Number(value),
      updatedICR:
        e.target.value === ""
          ? null
          : Math.round(
              ((Number(state.currentColl) /
                (Number(state.currentDebt) + Number(value))) *
                Number(state.currentPrice) +
                EPSILON) *
                1000
            ) / 1000,
    });
  }

  checkFunc();
};

const optionHandler = (option) => {
  State.update({ option: option });

  changeHandler(Number(state.value));
};

const tokenHandler = (token) => {
  State.update({ token: token });
  changeHandler(Number(state.value));
};

const confirmHandler = () => {
  if (state.complete) {
    State.update({ complete: false, hash: null });
    checkFunc();
  }
  if (!state.check) {
    return;
  }
  const borrowerOperationsContract = new ethers.Contract(
    borrowerOperationsAddress,
    borrowerOperationAbi.body,
    Ethers.provider().getSigner()
  );
  const amount = ethers.utils
    .parseUnits(state.value.toString(), "ether")
    .toString();

  if (state.option === "deposit" && state.token === "ETH") {
    borrowerOperationsContract
      .addColl(address, address, { value: amount })
      .then((transactionHash) => {
        State.update({
          loading: true,
          hash: transactionHash.hash,
          value: "",
          updatedColl: null,
          updatedDebt: null,
          updatedICR: null,
        });
        // console.log(transactionHash.hash);
      });
  } else if (state.option === "withdraw" && state.token === "ETH") {
    borrowerOperationsContract
      .withdrawColl(amount.toString(), address, address)
      .then((transactionHash) => {
        State.update({
          loading: true,
          hash: transactionHash.hash,
          value: "",
          updatedColl: null,
          updatedDebt: null,
          updatedICR: null,
        });
        // console.log(transactionHash.hash);
      });
  } else if (state.option === "deposit" && state.token === "LUSD") {
    borrowerOperationsContract
      .repayLUSD(amount.toString(), address, address)
      .then((transactionHash) => {
        State.update({
          loading: true,
          hash: transactionHash.hash,
          value: "",
          updatedColl: null,
          updatedDebt: null,
          updatedICR: null,
        });
        // console.log(transactionHash.hash);
      });
  } else if (state.option === "withdraw" && state.token === "LUSD") {
    borrowerOperationsContract
      .withdrawLUSD(
        "5000000000000000",
        amount.toString(),
        address,
        address
      )
      .then((transactionHash) => {
        State.update({
          loading: true,
          hash: transactionHash.hash,
          value: "",
          updatedColl: null,
          updatedDebt: null,
          updatedICR: null,
        });
        // console.log(transactionHash.hash);
      });
  }
};

Ethers.provider() &&
  Ethers.provider()
    .waitForTransaction(state.hash)
    .then((res) => {
      State.update({ loading: false, value: "", complete: true });
      infoHandler();
    })
    .catch((err) => {
      // console.log(err);
      State.update({ loading: false });
    });

const cutDecimal = (data) => {
  if (isNaN(Number(data))) {
    return data;
  }
  return Math.round((Number(data) + EPSILON) * 1000) / 1000;
};

return (
  <div className={"bos " + plasmicRootClassName}>
    <div className="flex">
      {renderPlasmicElement("typeButton", {
        children: "Deposit",
        isActive: state.option === "deposit",
        isDisabled: !address || !isOpenTrove,
        onClick: () => {
          optionHandler("deposit");
        },
      })}

      {renderPlasmicElement("typeButton", {
        children: "Withdraw",
        isDisabled: !address || !isOpenTrove,
        isActive: state.option === "withdraw",
        onClick: () => {
          optionHandler("withdraw");
        },
      })}
    </div>

    <div className="flex items-center justify-center">
      {renderPlasmicElement("input", {
        type: "text",
        value: state.value,
        onChange: changeHandler,
        isDisabled: !address || !isOpenTrove,
        placeholder: state.token === "ETH" ? "0.0000 ETH" : "0.0000 LUSD",
      })}

      <div className="flex">
        {renderPlasmicElement("tokenButton", {
          children: "ETH",
          isDisabled: !address || !isOpenTrove,
          isActive: state.token === "ETH",
          onClick: () => {
            tokenHandler("ETH");
          },
        })}

        {renderPlasmicElement("tokenButton", {
          children: "LUSD",
          isDisabled: !address || !isOpenTrove,
          isActive: state.token === "LUSD",
          onClick: () => {
            tokenHandler("LUSD");
          },
        })}
      </div>
    </div>

    <div>
      <div className="flex justify-between items-center">
        {renderPlasmicElement("textInfo", {
          children: "Your Collateral Ratio",
        })}

        <div className="flex items-center justify-center">
          {renderPlasmicElement("textValue", {
            children: !isNaN(
              (((Number(state.currentColl) / Number(state.currentDebt)) *
                Number(state.currentPrice) +
                EPSILON) *
                1000) /
                1000
            )
              ? Math.round(
                  ((Number(state.currentColl) / Number(state.currentDebt)) *
                    Number(state.currentPrice) +
                    EPSILON) *
                    1000
                ) / 1000
              : "-",
          })}

          {state.updatedICR &&
            Number(state.updatedICR) !==
              Number(
                Math.round(
                  ((Number(state.currentColl) / Number(state.currentDebt)) *
                    Number(state.currentPrice) +
                    EPSILON) *
                    1000
                ) / 1000
              ) &&
            state.updatedICR &&
            renderPlasmicElement("textValue", {
              children: `=> ${
                state.updatedICR >= 0 ? cutDecimal(state.updatedICR) : 0
              }
                  `,
            })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        {renderPlasmicElement("textInfo", {
          children: "Your Collateral",
        })}

        <div className="flex items-center justify-center">
          {renderPlasmicElement("textValue", {
            children: state.currentColl,
          })}

          {state.updatedColl &&
            Number(state.updatedColl) !== Number(state.currentColl) &&
            renderPlasmicElement("textValue", {
              children: `=> ${
                state.updatedColl >= 0 ? cutDecimal(state.updatedColl) : 0
              }`,
            })}

          {renderPlasmicElement("textValue", {
            children: "ETH",
          })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        {renderPlasmicElement("textInfo", {
          children: "Your Debt",
        })}

        <div className="flex items-center justify-center">
          {renderPlasmicElement("textValue", {
            children: state.currentDebt,
          })}

          {state.updatedDebt &&
            state.updatedDebt.toString() !== state.currentDebt.toString() &&
            state.updatedDebt > 0 &&
            renderPlasmicElement("textValue", {
              children: `=> ${cutDecimal(state.updatedDebt)}`,
            })}

          {renderPlasmicElement("textValue", {
            children: "LUSD",
          })}
        </div>
      </div>

      <div className="flex justify-between items-center">
        {renderPlasmicElement("textInfo", {
          children: "Ethereum Price",
        })}

        <div className="flex items-center justify-center">
          {renderPlasmicElement("textValue", {
            children: state.currentPrice,
          })}

          {renderPlasmicElement("textValue", {
            children: "$",
          })}
        </div>
      </div>
    </div>

    {renderPlasmicElement("actionButton", {
      onClick: confirmHandler,
      isDisabled:
        chainId !== 11155111 ||
        !state.value ||
        !state.check ||
        !address,
      children: !address
        ? "Connect Wallet"
        : chainId !== 11155111
        ? "Change network to Sepolia"
        : isOpenTrove === false
        ? "Open Trove"
        : state.loading
        ? "Loadig..."
        : state.complete
        ? "Success"
        : state.check
        ? `Send ${state.option}`
        : !state.value
        ? "Enter input value"
        : state.error,
    })}
  </div>
);
