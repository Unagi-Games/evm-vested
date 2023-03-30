import {
  PaymentRelayInstance,
  TestERC20Instance,
} from "../types/truffle-contracts";

const Token = artifacts.require("TestERC20");
const PaymentRelay = artifacts.require("PaymentRelay");

contract("PaymentRelay", (accounts) => {
  let champContract: TestERC20Instance;
  let paymentRelayContract: PaymentRelayInstance;

  const operator = accounts[0];
  const sender = accounts[1];
  const receiver = accounts[2];
  const anyUser = accounts[5];
  const initialChampBalance = web3.utils.toWei("1000", "ether");

  before(async function () {
    champContract = await Token.new(initialChampBalance, { from: sender });
    paymentRelayContract = await PaymentRelay.new();
    await paymentRelayContract.grantRole(
      await paymentRelayContract.TOKEN_ROLE(),
      champContract.address
    );
    await paymentRelayContract.grantRole(
      await paymentRelayContract.RECEIVER_ROLE(),
      receiver
    );
    await paymentRelayContract.grantRole(
      await paymentRelayContract.OPERATOR_ROLE(),
      operator
    );
  });

  describe("As any user", function () {
    const PAYMENT_UID = web3.utils.keccak256("PAYMENT_UID");
    const PAYMENT_UID_2 = web3.utils.keccak256("PAYMENT_UID_2");
    const ANY_UID = web3.utils.keccak256("ANY_UID");
    const amount = "500";

    describe("When payment is reserved", function () {
      before(async function () {
        await champContract.approve(paymentRelayContract.address, amount, {
          from: sender,
        });
        await paymentRelayContract.reservePayment(
          champContract.address,
          amount,
          PAYMENT_UID,
          { from: sender }
        );
      });

      it("Should mark payment as reserved", async function () {
        expect(
          await paymentRelayContract.isPaymentReserved(PAYMENT_UID, sender)
        ).to.be.true;

        const { 2: paymentState } = await paymentRelayContract.getPayment(
          PAYMENT_UID,
          sender
        );
        expect(paymentState).to.be.equal(
          await paymentRelayContract.PAYMENT_RESERVED()
        );
      });

      it("Should transfer reserved amount to escrow", async function () {
        expect(
          (
            await champContract.balanceOf(paymentRelayContract.address)
          ).toString()
        ).to.equals(amount);
      });

      it("Should block duplicate payment reservation", async function () {
        expect(
          await paymentRelayContract.isPaymentReserved(PAYMENT_UID, sender)
        ).to.be.true;

        try {
          await paymentRelayContract.reservePayment(
            champContract.address,
            amount,
            PAYMENT_UID,
            { from: sender }
          );
          assert.fail("execPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Payment already reserved");
        }
      });

      it("Should block payment execution to unauthorized receiver", async function () {
        try {
          await paymentRelayContract.execPayment(sender, PAYMENT_UID, anyUser, {
            from: sender,
          });
          assert.fail("execPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("missing role");
        }
      });

      it("Should block execution of payments that were not previously reserved", async function () {
        try {
          await paymentRelayContract.execPayment(sender, ANY_UID, receiver, {
            from: sender,
          });
          assert.fail("execPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Payment is not reserved");
        }
      });

      it("Should block refund of payments that were not previously reserved", async function () {
        try {
          await paymentRelayContract.refundPayment(sender, ANY_UID, {
            from: operator,
          });
          assert.fail("refundPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Payment is not reserved");
        }
      });

      it("Should only allow reservation owner, or contract operator to execute payment", async function () {
        try {
          await paymentRelayContract.execPayment(
            sender,
            PAYMENT_UID,
            receiver,
            { from: anyUser }
          );
          assert.fail("execPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes(
            "Caller does not have permission to execute payment"
          );
        }
      });

      it("Should only allow contract operator to refund payment", async function () {
        try {
          await paymentRelayContract.refundPayment(sender, PAYMENT_UID, {
            from: anyUser,
          });
          assert.fail("refundPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("missing role");
        }

        try {
          await paymentRelayContract.refundPayment(sender, PAYMENT_UID, {
            from: sender,
          });
          assert.fail("refundPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("missing role");
        }
      });
    });

    describe("When payment is executed", function () {
      before(async function () {
        await paymentRelayContract.execPayment(sender, PAYMENT_UID, receiver, {
          from: operator,
        });
      });

      it("Should sent tokens", async function () {
        expect((await champContract.balanceOf(receiver)).toString()).to.equals(
          amount
        );
        expect(
          (
            await champContract.balanceOf(paymentRelayContract.address)
          ).toString()
        ).to.equals("0");
      });

      it("Should mark payment as executed", async function () {
        expect(
          await paymentRelayContract.isPaymentProcessed(PAYMENT_UID, sender)
        ).to.be.true;

        const { 2: paymentState } = await paymentRelayContract.getPayment(
          PAYMENT_UID,
          sender
        );
        expect(paymentState).to.be.equal(
          await paymentRelayContract.PAYMENT_EXECUTED()
        );
      });

      it("Should keep free other UID", async function () {
        expect(await paymentRelayContract.isPaymentReserved(ANY_UID, sender)).to
          .be.false;
        expect(await paymentRelayContract.isPaymentProcessed(ANY_UID, sender))
          .to.be.false;
      });

      it("Should prevent UID collision between users", async function () {
        expect(
          await paymentRelayContract.isPaymentReserved(PAYMENT_UID, anyUser)
        ).to.be.false;
        expect(
          await paymentRelayContract.isPaymentProcessed(PAYMENT_UID, anyUser)
        ).to.be.false;
      });
    });

    describe("When payment is refunded", function () {
      let balanceBeforeReserve: string;

      before(async function () {
        balanceBeforeReserve = (
          await champContract.balanceOf(sender)
        ).toString();
        await champContract.approve(paymentRelayContract.address, amount, {
          from: sender,
        });
        await paymentRelayContract.reservePayment(
          champContract.address,
          amount,
          PAYMENT_UID_2,
          { from: sender }
        );
        await paymentRelayContract.refundPayment(sender, PAYMENT_UID_2, {
          from: operator,
        });
      });

      it("Should mark payment as refunded", async function () {
        expect(
          await paymentRelayContract.isPaymentProcessed(PAYMENT_UID_2, sender)
        ).to.be.true;

        const { 2: paymentState } = await paymentRelayContract.getPayment(
          PAYMENT_UID_2,
          sender
        );
        expect(paymentState).to.be.equal(
          await paymentRelayContract.PAYMENT_REFUNDED()
        );
      });

      it("Should refund tokens back to the user", async function () {
        expect((await champContract.balanceOf(sender)).toString()).to.equals(
          balanceBeforeReserve
        );
        expect(
          (
            await champContract.balanceOf(paymentRelayContract.address)
          ).toString()
        ).to.equals("0");
      });
    });

    describe("When payment is processed", function () {
      before(async function () {
        assert(
          await paymentRelayContract.isPaymentProcessed(PAYMENT_UID, sender),
          "Payment `PAYMENT_UID` is not processed"
        );
        assert(
          await paymentRelayContract.isPaymentProcessed(PAYMENT_UID_2, sender),
          "Payment `PAYMENT_UID_2` is not processed"
        );
      });

      it("Should block reservation of the already processed payment", async function () {
        try {
          await paymentRelayContract.reservePayment(
            champContract.address,
            amount,
            PAYMENT_UID,
            { from: sender }
          );
          assert.fail("reservePayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Payment already processed");
        }
        try {
          await paymentRelayContract.reservePayment(
            champContract.address,
            amount,
            PAYMENT_UID,
            { from: sender }
          );
          assert.fail("reservePayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Payment already processed");
        }
      });

      it("Should block execution of the already processed payment", async function () {
        try {
          await paymentRelayContract.execPayment(
            sender,
            PAYMENT_UID,
            receiver,
            {
              from: operator,
            }
          );
          assert.fail("execPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Payment is not reserved");
        }
        try {
          await paymentRelayContract.execPayment(
            sender,
            PAYMENT_UID_2,
            receiver,
            {
              from: operator,
            }
          );
          assert.fail("execPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Payment is not reserved");
        }
      });

      it("Should block refund of the already processed payment", async function () {
        try {
          await paymentRelayContract.refundPayment(sender, PAYMENT_UID, {
            from: operator,
          });
          assert.fail("refundPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Payment is not reserved");
        }
        try {
          await paymentRelayContract.refundPayment(sender, PAYMENT_UID_2, {
            from: operator,
          });
          assert.fail("refundPayment() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Payment is not reserved");
        }
      });
    });
  });
});
