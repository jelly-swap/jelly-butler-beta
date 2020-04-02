import { EventEmitter } from 'events';

export default class Emitter {
    private static instance: Emitter;

    private eventEmitter: EventEmitter;

    /**
     * Initiate the event emitter
     */
    constructor() {
        if (Emitter.instance) {
            return Emitter.instance;
        }

        this.eventEmitter = new EventEmitter();

        Emitter.instance = this;
    }

    /**
     * Adds the @listener function to the end of the listeners array
     * for the event named @eventName
     * Will ensure that only one time the listener added for the event
     *
     * @param {string} eventName
     * @param {function} listener
     */
    on(eventName, listener) {
        this.eventEmitter.on(eventName, listener);
    }

    /**
     * Will temove the specified @listener from @eventname list
     *
     * @param {string} eventName
     * @param {function} listener
     */
    removeEventListener(eventName, listener) {
        this.eventEmitter.removeListener(eventName, listener);
    }

    /**
     * Will emit the event on the evetn name with the @payload
     * and if its an error set the @error value
     *
     * @param {string} event
     * @param {object} payload
     * @param {boolean} error
     */
    emit(event, payload, error = false) {
        this.eventEmitter.emit(event, payload, error);
    }
}
