import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";

describe("TokenSlabs", function () {
  let TestERC20: Contract;
  let contractFactory: ContractFactory;
  let TokenSlabs: Contract;
  let owner: Signer, otherAccount: Signer;
  const SLABVALUES = [100, 200, 300, 400, 500];
  
  async function init() {
    const [owner, otherAccount] = await ethers.getSigners();
    contractFactory = await ethers.getContractFactory("TokenSlabs");
    TokenSlabs = await contractFactory.deploy(SLABVALUES);
    contractFactory = await ethers.getContractFactory("TestERC20");
    TestERC20 = await contractFactory.deploy();
    await TestERC20.mint(await owner.getAddress(), 1000);
    return [owner,otherAccount];
  }

  describe("Tests", function () {
    it("Deploys all relevant contracts", async () => {
      [owner, otherAccount] = await loadFixture(init);
    });

    it("Checks if ERC20 is minted", async () => {
      expect(await TestERC20.balanceOf(await owner.getAddress())).to.be.equal(1000);
    });

    it("Checks Current Slab",async()=>{
      expect(await TokenSlabs.tokenCurrentSlab(TestERC20.address)).to.be.equal(0);
    });
    
    it("Makes deposit to verify slab change",async()=>{
      await TestERC20.approve(TokenSlabs.address, 1000);
      
      await TokenSlabs.deposit(TestERC20.address, 99);
      expect(await TokenSlabs.tokenCurrentSlab(TestERC20.address)).to.be.equal(0);
      
      await TokenSlabs.deposit(TestERC20.address, 1);
      expect(await TokenSlabs.tokenCurrentSlab(TestERC20.address)).to.be.equal(0);
      
      await TokenSlabs.deposit(TestERC20.address, 2);
      expect(await TokenSlabs.tokenCurrentSlab(TestERC20.address)).to.be.equal(1);

      await TokenSlabs.deposit(TestERC20.address, 97);
      expect(await TokenSlabs.tokenCurrentSlab(TestERC20.address)).to.be.equal(1);

      await TokenSlabs.deposit(TestERC20.address, 3);
      expect(await TokenSlabs.tokenCurrentSlab(TestERC20.address)).to.be.equal(2);
    });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
