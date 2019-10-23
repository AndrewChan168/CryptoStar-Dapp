import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;
    //console.log("Inside start function");
    //console.log("web3");
    //console.log(web3);

    try {
      // get contract instance
      //console.log("Get constract instance");
      const networkId = await web3.eth.net.getId();
      //console.log("networkId");
      //console.log(networkId);
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      //console.log("deployedNetwork");
      //console.log(deployedNetwork);
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );
      //console.log("After this.meta");

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[1];
      //console.log("account");
      //console.log(account);
    } catch (error) {
      App.setStatus("Could not connect to contract or chain.");
    }
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function() {
    //console.log("Inside createStar function");
    const { createStar } = this.meta.methods;
    //console.log("this.meta.methods.createStar");
    //console.log(createStar);
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    try {
      //window.App.meta.methods.createStar("A&V", 101).send({from:window.App.account});
      await createStar(name, id).send({from: this.account});
      App.setStatus("New Star Owner is " + this.account + ".");
    } catch (error) {
      App.setStatus("Error: "+error.message);
    }
  },

  // Implement Task 4 Modify the front end of the DAPP
  lookUp: async function (){
    const tokenId = document.getElementById("lookid").value;
    try {
      //window.App.meta.methods.lookUptokenIdToStarInfo(101, {from:window.App.account}).call;
      const tx = await this.meta.methods.lookUptokenIdToStarInfo(parseInt(tokenId)).call();
      console.log("transaction");
      console.log(tx);
      App.setStatus(`The star ${tokenId} you are looking for: ${JSON.stringify(tx)}`)

    } catch(err) {
      App.setStatus("Error: " + err.message);
    }
  }
};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});