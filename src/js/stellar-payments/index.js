import PaymentsStream from './stream.js';

/**
 * This class is used to manage all payments and payment streams.
 * Right now, this class only supports running one stream at a time.
 * If `updateStream` is called, the previously running stream gets closed.
 */
export default class Payments {
  constructor(server) {
    this.server = server;
    this.currentStream = {
      close: function () {},
    };

    return {
      updateStream: this.updateStream.bind(this),
    };
  }

  closeStream() {
    this.currentStream.close();
  }

  updateStream(accountId, callback) {
    // In case there's a stream running already, close it before starting another one
    this.closeStream();
    this.currentStream = new PaymentsStream(this.server, accountId, callback);
  }
}
