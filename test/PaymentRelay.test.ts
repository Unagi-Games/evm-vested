import { ChildChampTokenInstance, PaymentRelayInstance, } from "../types/truffle-contracts";

const ChildChamp = artifacts.require("ChildChampToken");
const PaymentRelay = artifacts.require("PaymentRelay");

contract("DistributionManager", (accounts) => {
  let champContract: ChildChampTokenInstance;
  let paymentRelayContract: PaymentRelayInstance;

  const operator = accounts[0];
  const sender = accounts[1];
  const receiver = accounts[2];
  const initialChampBalance = web3.utils.toWei("1000", "ether");

  before(async function () {
    champContract = await ChildChamp.new(accounts[0]);
    paymentRelayContract = await PaymentRelay.new();
    await paymentRelayContract.grantRole(await paymentRelayContract.TOKEN_ROLE(), champContract.address);
    await champContract.authorizeOperator(operator, { from: sender });

    await champContract.deposit(
      sender,
      web3.eth.abi.encodeParameter("uint256", initialChampBalance)
    );
  });

  describe('As any user', function() {
    it('I cannot interact with PaymentRelay through a token role', async function() {
      try {
        await champContract.send(paymentRelayContract.address, "100", "0x0", { from: sender });
        assert.fail("send() did not throw.");
      } catch (e: any) {
        expect(e.message).to.includes("missing role");
      }
    });

    it('I cannot interact with PaymentRelay directly', async function() {
      try {
        await paymentRelayContract.tokensReceived(operator, sender, receiver, "100", "0x0", "0x0", { from: sender });
        assert.fail("tokensReceived() did not throw.");
      } catch (e: any) {
        expect(e.message).to.includes("missing role");
      }
    });
  });

  describe('As operator', function() {
    describe('When token are sent', function() {

      const PAYMENT_UID = web3.utils.keccak256("PAYMENT_UID");
      const amount = "1000";

      before(async function() {
        const operatorData = `${PAYMENT_UID}${receiver.substring(2)}`;
        await champContract.operatorSend(sender, paymentRelayContract.address, amount, "0x0", operatorData);
      });

      it('Should sent tokens', async function() {
        expect((await champContract.balanceOf(receiver)).toString()).to.equals(amount);
      });

      it('Should mark payment as sent', async function() {
        expect(await paymentRelayContract.isPaymentProcessed(PAYMENT_UID)).to.be.true;
      });

      it('Should block payment duplication', async function() {
        const operatorData = `${PAYMENT_UID}${receiver.substring(2)}`;

        try {
          await champContract.operatorSend(sender, paymentRelayContract.address, amount, "0x0", operatorData);
          assert.fail("operatorSend() did not throw.");
        } catch(e: any) {
          expect(e.message).to.includes("already processed");
        }
      });

      it('Should keep free other UID', async function() {
        const ANY_UID = web3.utils.keccak256("ANY_UID");
        expect(await paymentRelayContract.isPaymentProcessed(ANY_UID)).to.be.false;
      })
    });
  });
});
