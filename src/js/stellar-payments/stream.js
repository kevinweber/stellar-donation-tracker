/**
 * Keep a connection with a Stellar account for real-time payment updates.
 */
export default class PaymentsStream {
  constructor(server, accountId, callback) {
    /**
     * Request all payments from server & keep connection open.
     * To close the connection, call `closeStream()`.
     */
    const stream = server.payments()
      .forAccount(accountId)
      .limit(200)
      .stream({
        onmessage: callback,
      });

    return {
      close: stream,
    };
  }
}
