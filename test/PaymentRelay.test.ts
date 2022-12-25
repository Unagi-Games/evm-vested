import { ChildChampTokenInstance, PaymentRelayInstance, } from "../types/truffle-contracts";

const ChildChamp = artifacts.require("ChildChampToken");
const PaymentRelay = artifacts.require("PaymentRelay");
const TestPaymentRelay_V0 = artifacts.require("TestPaymentRelay_V0");

contract("PaymentRelay", (accounts) => {
  let champContract: ChildChampTokenInstance;
  let paymentRelayContract: PaymentRelayInstance;

  const sender = accounts[1];
  const receiver = accounts[2];
  const anyUser = accounts[5];
  const initialChampBalance = web3.utils.toWei("1000", "ether");

  before(async function () {
    champContract = await ChildChamp.new(accounts[0]);
    const paymentRelayContract_V0 = await TestPaymentRelay_V0.new();
    paymentRelayContract = await PaymentRelay.new(paymentRelayContract_V0.address);
    await paymentRelayContract.grantRole(await paymentRelayContract.TOKEN_ROLE(), champContract.address);
    await paymentRelayContract.grantRole(await paymentRelayContract.RECEIVER_ROLE(), receiver);

    await champContract.deposit(
      sender,
      web3.eth.abi.encodeParameter("uint256", initialChampBalance)
    );
  });

  describe('As any user', function() {
    it('I cannot interact with PaymentRelay directly', async function() {
      try {
        await paymentRelayContract.tokensReceived(sender, sender, receiver, "100", "0x0", "0x0", { from: sender });
        assert.fail("tokensReceived() did not throw.");
      } catch (e: any) {
        expect(e.message).to.includes("missing role");
      }
    });
  });

  describe('As any user', function() {
    describe('When token are sent', function() {

      const PAYMENT_UID = web3.utils.keccak256("PAYMENT_UID");
      const amount = "1000";

      before(async function() {
        const operatorData = `${PAYMENT_UID}${receiver.substring(2)}`;
        await champContract.operatorSend(sender, paymentRelayContract.address, amount, "0x0", operatorData, { from: sender });
      });

      it('Should sent tokens', async function() {
        expect((await champContract.balanceOf(receiver)).toString()).to.equals(amount);
      });

      it('Should mark payment as sent', async function() {
        expect(await paymentRelayContract.isPaymentProcessed(PAYMENT_UID, sender)).to.be.true;
      });

      it('Should block payment duplication', async function() {
        const operatorData = `${PAYMENT_UID}${receiver.substring(2)}`;

        try {
          await champContract.operatorSend(sender, paymentRelayContract.address, amount, "0x0", operatorData, { from: sender });
          assert.fail("operatorSend() did not throw.");
        } catch(e: any) {
          expect(e.message).to.includes("already processed");
        }
      });

      it('Should block payment to unauthorized receiver', async function() {
        const ANY_UID = web3.utils.keccak256("ANY_UID");
        const operatorData = `${ANY_UID}${anyUser.substring(2)}`;

        try {
          await champContract.operatorSend(sender, paymentRelayContract.address, amount, "0x0", operatorData, { from: sender });
          assert.fail("operatorSend() did not throw.");
        } catch(e: any) {
          expect(e.message).to.includes("missing role");
        }
      })

      it('Should keep free other UID', async function() {
        const ANY_UID = web3.utils.keccak256("ANY_UID");
        expect(await paymentRelayContract.isPaymentProcessed(ANY_UID, sender)).to.be.false;
      });

      it('Should prevent UID collision between users', async function() {
        expect(await paymentRelayContract.isPaymentProcessed(PAYMENT_UID, anyUser)).to.be.false;
      });
    });
  });
});
