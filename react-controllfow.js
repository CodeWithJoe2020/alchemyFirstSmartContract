interact.js
export const loadCurrentMessage = async () => { 
    const message = await helloWorldContract.methods.message().call(); 
    return message;
};


helloworld.js

//called only once
useEffect(() => {
  async function fetchMessage() {
    const message = await loadCurrentMessage();
    setMessage(message);
  }
  fetchMessage();
}, []);

-----------------------------------------------------------------------

helloworld.js

function addSmartContractListener() {
    helloWorldContract.events.UpdatedMessages({}, (error, data) => {
      if (error) {
        setStatus("😥 " + error.message);
      } else {
        setMessage(data.returnValues[1]);
        setNewMessage("");
        setStatus("🎉 Your message has been updated!");
      }
    });
  }
  ---------------------------------------------------------------------
  
  helloworld.js
  
  useEffect(() => {
  async function fetchMessage() {
    const message = await loadCurrentMessage();
    setMessage(message);  
  }
  fetchMessage();
  addSmartContractListener();
}, []);

-----------------------------------------------------------------------


interact.js

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

-------------------------------------------------------------------
helloworld.js

const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };
  
  -----------------------------------------------------------------
  
  interact.js
  
  export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

-------------------------------------------------------------------

helloworld.js

useEffect(() => {
  async function fetchMessage() {
    const message = await loadCurrentMessage();
    setMessage(message);
  }
  fetchMessage();
  addSmartContractListener();

  async function fetchWallet() {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status); 
  }
  fetchWallet();
}, []);

-------------------------------------------------------------------

helloworld.js

function addWalletListener() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        setStatus("👆🏽 Write a message in the text-field above.");
      } else {
        setWallet("");
        setStatus("🦊 Connect to Metamask using the top right button.");
      }
    });
  } else {
    setStatus(
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    );
  }
}

-------------------------------------------------------------------


helloworld.js

useEffect(() => {
  async function fetchMessage() {
    const message = await loadCurrentMessage();
    setMessage(message);
  }
  fetchMessage();
  addSmartContractListener();

  async function fetchWallet() {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status); 
  }
  fetchWallet();
  addWalletListener(); 
}, []);

-------------------------------------------------------------------


interact.js

export const updateMessage = async (address, message) => {
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (message.trim() === "") {
    return {
      status: "❌ Your message cannot be an empty string.",
    };
  }
};

-------------------------------------------------------------------



interact.js

export const updateMessage = async (address, message) => {

  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (message.trim() === "") {
    return {
      status: "❌ Your message cannot be an empty string.",
    };
  }

  //set up transaction parameters
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: helloWorldContract.methods.update(message).encodeABI(),
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};

-------------------------------------------------------------------

helloworld.js

const onUpdatePressed = async () => {
    const { status } = await updateMessage(walletAddress, newMessage);
    setStatus(status);
};

-------------------------------------------------------------------



