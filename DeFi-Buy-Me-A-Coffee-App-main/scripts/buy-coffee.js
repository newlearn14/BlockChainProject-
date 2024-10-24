const hre = require("hardhat");

// Returns the Ether Balance of the given address
async function getBalance(address){
    const balanceBigInt = await hre.waffle.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs Ether balances for a list of addresses
async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
      console.log(`Address ${idx} balance: `, await getBalance(address));
      idx ++;
    }
  }

// Logs memos stored on-chain from coffee purchases  
async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}`);
    }
}

async function main(){
    // Get example accounts
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
    
    // Get contract to deploy and deploy
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to: ", buyMeACoffee.address);

    // Deploy contract
    const addresses = [owner.address, tipper.address, buyMeACoffee.address];
    console.log("==Start==");
    await printBalances(addresses);

    // Buy the owner a few coffees
    const tip = {value: hre.ethers.utils.parseEther("1")};
    await buyMeACoffee.connect(tipper).buyCoffee("Sahil", "Bought you a Coffee, Keep up with the great stuff!!!", tip);
    await buyMeACoffee.connect(tipper2).buyCoffee("Dinesh", "Keep posting great content!", tip);
    await buyMeACoffee.connect(tipper3).buyCoffee("Dhairya", "This is a great dApp!!!", tip);

    // Check balances after coffee purchase
    console.log("== Bought Coffee ==");
    await printBalances(addresses);

    // Withdraw funds
    await buyMeACoffee.connect(owner).withdrawTips();
    
    // Check balances after withdraw
    console.log("== WithdrawTips ==");
    await printBalances(addresses);

    // Read all the memos left for the owner
    console.log("== Memos ==");
    const memos = await buyMeACoffee.getMemos();
    printMemos(memos); 
}

main()
    .then(() => process.exit(0)) 
    .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  